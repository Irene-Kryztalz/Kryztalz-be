import Gem from "../models/gem";
import User from "../models/user";
import { throwErr, catchErr } from "../utils";

const ITEM_PER_PAGE = 2;

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
            gems = await Gem.find( { _id: { "$gt": lastId } }, "name price imageUrls type" ).limit( ITEM_PER_PAGE );
        }
        else
        {
            gems = await Gem.find( {}, "name price imageUrls type" ).limit( ITEM_PER_PAGE );
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
                    gems = await Gem.find( filter, "name price imageUrls type" ).limit( ITEM_PER_PAGE );
                    break;

                case cases.T:
                    filter =
                    {
                        _id: { "$gt": lastId },
                        type
                    };
                    gems = await Gem.find( filter, "name price imageUrls type" ).limit( ITEM_PER_PAGE );
                    break;

                case cases.C:
                    filter =
                    {
                        _id: { "$gt": lastId },
                        cutType
                    };
                    gems = await Gem.find( filter, "name price imageUrls type" ).limit( ITEM_PER_PAGE );
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
                    gems = await Gem.find( filter, "name price imageUrls type" ).limit( ITEM_PER_PAGE );
                    break;

                case cases.T:
                    filter = { type };
                    gems = await Gem.find( filter, "name price imageUrls type" ).limit( ITEM_PER_PAGE );
                    break;


                case cases.C:
                    filter = { cutType };
                    gems = await Gem.find( filter, "name price imageUrls type" ).limit( ITEM_PER_PAGE );
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
            filter, "name price imageUrls type",
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
            gems = await Gem.find( filter, "name price imageUrls type" ).limit( ITEM_PER_PAGE );
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
    const { productId, quantity } = req.body;

    try 
    {
        const user = User.findById( req.userId, "cart" );

        const gem = Gem.findById( productId );

        if ( !gem )
        {
            const error =
            {
                message: "Unable to find gem",
                statusCode: 404
            };
            throwErr( error );
        }

        user.cart = [ ...user.cart, { _id: productId, quantity } ];

        await user.save();

        res.json( user );


    }
    catch ( error ) 
    {
        catchErr( error, next );
    }
};

const addToWishList = async ( req, res, next ) =>
{
    const { productId } = req.body;

    try 
    {
        const user = User.findById( req.userId, "wishlist" );
        const gem = Gem.findById( productId );

        if ( !gem )
        {
            const error =
            {
                message: "Unable to find gem",
                statusCode: 404
            };
            throwErr( error );
        }

        user.wishlist = [ ...user.wishlist, { _id: productId } ];

        await user.save();

        res.json( user );


    }
    catch ( error ) 
    {
        catchErr( error, next );
    }
};


const removeFromCart = async ( req, res, next ) =>
{
    const { productId } = req.body;

    try 
    {
        const user = User.findById( req.userId, "cart" );

        user.cart = [ ...user.cart ].filter( item => item._id.toString() !== productId );

        await user.save();

        res.json( user );


    }
    catch ( error ) 
    {
        catchErr( error, next );
    }
};

const removeFromWishList = async ( req, res, next ) =>
{
    const { productId } = req.body;

    try 
    {
        const user = User.findById( req.userId, "wishlist" );

        user.wishlist = [ ...user.wishlist ].filter( item => item._id.toString() !== productId );

        await user.save();

        res.json( user );

    }
    catch ( error ) 
    {
        catchErr( error, next );
    }
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
    removeFromWishList
};
