import Gem from "../models/gem";
import User from "../models/user";
import { throwErr, catchErr } from "../utils";
import { exchange } from "../config";
import { get } from "https";

const ITEM_PER_PAGE = 10;

const getAllGems = async ( req, res, next ) =>
{
    const { lastId, gemCount } = req.query;

    try 
    {
        let gems;

        const count = await Gem.estimatedDocumentCount();

        if ( count === +gemCount )
        {
            return res.json( { message: "No more gems left to fetch" } );
        }

        if ( lastId )
        {
            gems = await Gem.find( { _id: { "$gt": lastId } }, "name price imageUrls type cutType" ).limit( ITEM_PER_PAGE );
        }
        else
        {
            gems = await Gem.find( {}, "name price imageUrls type cutType" ).limit( ITEM_PER_PAGE );
        }

        res.json( { count, gems } );
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

const getOneGem = async ( req, res, next ) =>
{
    const { gemId } = req.params;

    try 
    {
        const gem = await Gem.findById( gemId );
        if ( gem )
        {
            res.json( gem );
        }
        else
        {
            throwErr(
                {
                    message: "Unable to find this gem",
                    statusCode: 404
                } );
        }

    }
    catch ( error ) 
    {
        catchErr( error, next );
    }
};

const getAllFilteredGems = async ( req, res, next ) =>
{
    const { type, cutType, lastId } = req.query;

    const cases = {};

    if ( type && cutType )
    {
        cases[ "TC" ] = true;
    }
    else if ( type && !cutType )
    {
        cases[ "T" ] = true;
    }
    else if ( !type && cutType )
    {
        cases[ "C" ] = true;
    }
    else
    {
        return res.status( 400 ).json( { error: "Please provide at least one of cutType and type" } );
    }

    try 
    {
        let gems;
        let filter;

        if ( lastId )
        {
            switch ( true ) 
            {
                case cases.TC:
                    filter =
                    {
                        _id: { "$gt": lastId },
                        type,
                        cutType
                    };
                    gems = await Gem.find( filter, "name price imageUrls type cutType" ).limit( ITEM_PER_PAGE );
                    break;

                case cases.T:
                    filter =
                    {
                        _id: { "$gt": lastId },
                        type
                    };
                    gems = await Gem.find( filter, "name price imageUrls type cutType" ).limit( ITEM_PER_PAGE );
                    break;

                case cases.C:
                    filter =
                    {
                        _id: { "$gt": lastId },
                        cutType
                    };
                    gems = await Gem.find( filter, "name price imageUrls type cutType" ).limit( ITEM_PER_PAGE );
                    break;

                default:
                    gems = [];
            }
        }
        else
        {
            switch ( true ) 
            {
                case cases.TC:
                    filter = { type, cutType };
                    gems = await Gem.find( filter, "name price imageUrls type cutType" ).limit( ITEM_PER_PAGE );
                    break;

                case cases.T:
                    filter = { type };
                    gems = await Gem.find( filter, "name price imageUrls type cutType" ).limit( ITEM_PER_PAGE );
                    break;


                case cases.C:
                    filter = { cutType };
                    gems = await Gem.find( filter, "name price imageUrls type cutType" ).limit( ITEM_PER_PAGE );
                    break;


                default:
                    gems = [];
            }
        }

        if ( filter )
        {
            delete filter._id;
        }

        const count = filter ? await Gem.countDocuments( filter ) : 0;

        res.json( { gems, count } );


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

const searchAllGems = async ( req, res, next ) =>
{
    const { searchString, lastId } = req.query;
    let regex = new RegExp( searchString, 'i' );

    try 
    {
        let filter = {};
        let count = null;

        if ( lastId )
        {
            filter = { _id: { "$gt": lastId } };
        }

        filter = { ...filter, $text: { $search: searchString } };

        let gems = await Gem.find(
            filter, "name price imageUrls type cutType",
            {
                score: { $meta: "textScore" },
                projection: { score: { $meta: 'textScore' } }
            },
        ).sort(
            { score: { $meta: 'textScore' } }
        ).limit( ITEM_PER_PAGE );

        count = await Gem.countDocuments( { $text: { $search: searchString } } );

        //enable partial search
        if ( gems.length === 0 )
        {
            let filter = {};
            if ( lastId )
            {
                filter = { _id: { "$gt": lastId } };
            }
            filter =
            {
                ...filter,
                "$or":
                    [
                        { name: regex },
                        { type: regex },
                        { cutType: regex }
                    ]
            };
            gems = await Gem.find( filter, "name price imageUrls type cutType" ).limit( ITEM_PER_PAGE );
            count = await Gem.countDocuments( {
                "$or":
                    [
                        { name: regex },
                        { type: regex },
                        { cutType: regex }
                    ]
            } );
        }


        return res.json( { gems, count } );
    }
    catch ( error ) 
    {
        catchErr( error, next );
    }


};

const addToCart = async ( req, res, next ) =>
{
    const { gemId, quantity } = req.body;

    try 
    {

        const user = await User.findById( req.userId, "cart" );
        const gem = await Gem.findById( gemId );

        if ( !gem )
        {
            const error =
            {
                message: "Unable to find gem",
                statusCode: 404
            };
            throwErr( error );
        }

        const index = user.cart.findIndex( g =>
            g.gemId.toString() === gemId );

        if ( index > -1 )
        {
            user.cart[ index ].quantity += quantity;

            if ( user.cart[ index ].quantity <= 0 )
            {
                user.cart = user.cart.filter( g => g.gemId.toString() !== gemId );
            }
        }
        else
        {
            user.cart = [ ...user.cart, { gemId, quantity } ];
        }

        await user.save();

        res.json( user.cart );

    }
    catch ( error ) 
    {
        catchErr( error, next );
    }
};

const addToWishList = async ( req, res, next ) =>
{
    const { gemId } = req.body;

    try 
    {
        const user = await User.findById( req.userId, "wishlist" );
        const gem = await Gem.findById( gemId );

        if ( !gem )
        {
            const error =
            {
                message: "Unable to find gem",
                statusCode: 404
            };
            throwErr( error );
        }

        const index = user.wishlist.findIndex( g =>
            g.gemId.toString() === gemId );

        if ( index < 0 )
        {
            user.wishlist = [ ...user.wishlist, { gemId } ];
        }


        await user.save();

        res.json( user.wishlist );


    }
    catch ( error ) 
    {
        catchErr( error, next );
    }
};


const removeFromCart = async ( req, res, next ) =>
{
    const { gemId } = req.body;

    try 
    {
        const user = await User.findById( req.userId, "cart" );

        user.cart = [ ...user.cart ].filter( item => item.gemId.toString() !== gemId );

        await user.save();

        res.json( user.cart );


    }
    catch ( error ) 
    {
        catchErr( error, next );
    }
};

const removeFromWishList = async ( req, res, next ) =>
{
    const { gemId } = req.body;

    try 
    {
        const user = await User.findById( req.userId, "wishlist" );

        user.wishlist = [ ...user.wishlist ].filter( item => item.gemId.toString() !== gemId );

        await user.save();

        res.json( user.wishlist );

    }
    catch ( error ) 
    {
        catchErr( error, next );
    }
};

const getExchange = async ( req, res, next ) =>
{

    get( `https://openexchangerates.org/api/latest.json?app_id=${ exchange }`, ratesJSON => 
    {
        let data = "";

        ratesJSON.on( "data", chunk => 
        {
            data += chunk;
        } );

        ratesJSON.on( "end", () => 
        {
            const parsed = JSON.parse( data );

            if ( parsed.error )
            {
                const error =
                {
                    message: parsed.message,
                    statusCode: parsed.status
                };

                catchErr( error, next );
                return;

            }

            res.json( parsed.rates );
        } );
    } ).on( "error", ( error ) =>
    {
        catchErr( error, next );
    } );



};

export
{
    addToCart,
    addToWishList,
    getAllGems,
    getAllFilteredGems,
    getOneGem,
    searchAllGems,
    removeFromCart,
    removeFromWishList,
    getExchange
};
