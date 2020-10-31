import Gem from "../models/gem";
import User from "../models/user";
import Order from "../models/order";
import { throwErr, catchErr } from "../utils";

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
            gems = await Gem.find( { _id: { "$gt": lastId } } ).limit( ITEM_PER_PAGE );
        }
        else
        {
            gems = await Gem.find().limit( ITEM_PER_PAGE );
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
        res.json( gem );

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
    if ( type && !cutType )
    {
        cases[ "T" ] = true;
    }
    if ( !type && cutType )
    {
        cases[ "C" ] = true;
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
                    gems = await Gem.find( filter ).limit( ITEM_PER_PAGE );
                    break;

                case cases.T:
                    filter =
                    {
                        _id: { "$gt": lastId },
                        type
                    };
                    gems = await Gem.find( filter ).limit( ITEM_PER_PAGE );
                    break;

                case cases.C:
                    filter =
                    {
                        _id: { "$gt": lastId },
                        cutType
                    };
                    gems = await Gem.find( filter ).limit( ITEM_PER_PAGE );
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
                    gems = await Gem.find( filter ).limit( ITEM_PER_PAGE );
                    break;

                case cases.T:
                    filter = { type };
                    gems = await Gem.find( filter ).limit( ITEM_PER_PAGE );
                    break;


                case cases.C:
                    filter = { cutType };
                    gems = await Gem.find( filter ).limit( ITEM_PER_PAGE );
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

        if ( lastId )
        {
            filter = { _id: { "$gt": lastId } };
        }

        filter = { ...filter, $text: { $search: searchString } };

        let gems = await Gem.find(
            filter,
            { score: { $meta: "textScore" } },
        ).sort(
            { score: { $meta: 'textScore' } }
        ).limit( ITEM_PER_PAGE );

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
            gems = await Gem.find( filter ).limit( ITEM_PER_PAGE );
        }

        res.json( gems );
    }
    catch ( error ) 
    {
        catchErr( error, next );
    }


};

const addToCart = async ( req, res, next ) =>
{

};

const addToWishList = async ( req, res, next ) =>
{

};

const purchaseItems = async ( req, res, next ) =>
{

};

export
{
    addToCart,
    addToWishList,
    getAllGems,
    purchaseItems,
    getAllFilteredGems,
    getOneGem,
    searchAllGems
};
