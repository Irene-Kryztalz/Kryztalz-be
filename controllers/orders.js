import fs from 'fs';
import path from 'path';
import handlebars from "handlebars";
import puppeteer from "puppeteer";
import Order from "../models/order";
import User from "../models/user";
import Gem from "../models/gem";

import { throwErr, catchErr, checkValidationErr } from "../utils";

const ITEM_PER_PAGE = 10;

const generatePDF = async order => 
{

    const templateHtml = fs.readFileSync( path.join( __dirname, '../templates/invoice.html' ), 'utf8' );
    const template = handlebars.compile( templateHtml );
    const formatter = new Intl.NumberFormat( 'en-NG' );

    order.items = order.items.map( o => 
    {
        o.volumePrice = formatter.format( ( o.price * o.quantity / ( order.rateToCurr ) ) );
        o.price = formatter.format( o.price / order.rateToCurr );

        return o;
    } );

    order.amountDue = formatter.format( order.amountDue / order.rateToCurr );
    order.discount = formatter.format( order.discount / order.rateToCurr );
    order.total = formatter.format( order.total / order.rateToCurr );

    const html = template( order );


    const options =
    {
        format: 'A4',
        printBackground: true,
        margin:
        {
            left: '0px',
            top: '0px',
            right: '0px',
            bottom: '0px',

        }
    };

    const browser = await puppeteer.launch( {
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
        ],
        headless: true
    } );

    const page = await browser.newPage();

    await page.setContent( `${ html }`, {
        waitUntil: 'networkidle0'
    } );

    const buffer = await page.pdf( options );
    await browser.close();

    return [ buffer, html ];

};


const getOneOrder = async ( req, res, next ) =>
{
    const { orderId } = req.params;

    try 
    {
        const order = await Order.findById( orderId );

        if ( !order )
        {
            const error =
            {
                message: "Unable to find order",
                statusCode: 404
            };
            throwErr( error );
        }

        res.status( 200 ).json( order );
    }
    catch ( error ) 
    {
        catchErr( error, next );
    }
};

const getOrders = async ( req, res, next ) =>
{
    const { lastId } = req.query;

    try 
    {
        let orders;

        if ( lastId )
        {
            orders = await Order.find(
                { _id: { "$lt": lastId }, userId: req.userId } ).sort( { _id: "desc" } ).limit( ITEM_PER_PAGE );
        }
        else
        {
            orders = await Order.find( { userId: req.userId } ).sort( { _id: "desc" } ).limit( ITEM_PER_PAGE );
        }

        const count = await Order.countDocuments( { userId: req.userId } );



        res.json( { orders, count } );
    }
    catch ( error ) 
    {
        if ( error.message.includes( "Cast to ObjectId failed " ) )
        {
            error.message = "Invalid value provided for lastId.";
        }
        catchErr( error, next );
    }
};

const createOrder = async ( req, res, next ) =>
{
    let {
        items: gems,
        userCurrency,
        discount,
        deliveryAddress,
        description,
        rateToCurr
    } = req.body;

    const errs = checkValidationErr( req );

    if ( errs )
    {
        return catchErr( errs, next );
    }

    if ( !deliveryAddress || !deliveryAddress.length === 0 )
    {
        deliveryAddress = [ "No address available" ];
    }

    const ids = gems.map( g => g._id );
    const items = [];

    try 
    {
        const gemList = await Gem.find().where( '_id' ).in( ids ).exec();

        if ( gemList.length < 1 )
        {
            const error =
            {
                message: "Invalid Ids provided for gems",
                statusCode: 400
            };
            throwErr( error );
        }
        else if ( gemList.length !== gems.length )
        {
            const missingGems = gems.filter( g =>
            {
                const gem = gemList.find( gem => gem._id == g._id );

                if ( !gem )
                {
                    return true;
                }

                return false;

            } ).map( g => g._id );
            const error =
            {
                message: `Unable to proceed with order. The following gems with ids [${ missingGems }] do not exist anynore`,
                statusCode: 400
            };
            throwErr( error );
        }

        let total = 0;

        gemList.forEach( ( g ) => 
        {
            const gem = gems.find( gem => gem._id == g._id );

            if ( !gem.quantity )
            {
                const error =
                {
                    message: "Please provide quantity for gem",
                    statusCode: 400
                };
                throwErr( error );
            }

            const item =
            {
                quantity: +gem.quantity,
                price: +g.price,
                cutType: g.cutType,
                type: g.type,
                name: g.name
            };

            total = total + ( +g.price * +gem.quantity );

            items.push( item );
        } );


        if ( userCurrency === "₦" )
        {
            rateToCurr = 1;
        }

        let amountDue = total;

        if ( discount )
        {
            if ( discount > total )
            {
                discount = total;
            }

            amountDue = total - discount;
        }


        const order = await new Order(
            {
                items,
                total,
                discount,
                amountDue,
                userCurrency,
                deliveryAddress,
                rateToCurr,
                description,
                orderedAt: new Date().toISOString(),
                userId: req.userId
            }
        ).save();

        const user = await User.findById( req.userId, "cart" );
        user.cart = [];

        await user.save();

        res.status( 201 ).json( order );
    }
    catch ( error ) 
    {
        if ( error.message.includes( "http" ) )
        {
            error.message = "Unable to validate order";
        }
        catchErr( error, next );
    }



};

const generateOrderInvoice = async ( req, res, next ) =>
{
    const { orderId } = req.params;

    try 
    {
        let order = await Order.findById( orderId )
            .populate( "userId", "name email" )
            .exec();

        if ( !order )
        {
            const error =
            {
                message: "Unable to find order",
                statusCode: 404
            };
            throwErr( error );
        }

        order = JSON.parse( JSON.stringify( order ) );

        order.orderedAt = new Date( order.orderedAt ).toLocaleDateString( 'en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        } );

        const [ buffer, /*html*/ ] = await generatePDF( order );
        //res.send( html );
        res.end( buffer );
    }
    catch ( error ) 
    {
        catchErr( error, next );
    }

};

export 
{
    getOrders,
    createOrder,
    getOneOrder,
    generateOrderInvoice,
};
