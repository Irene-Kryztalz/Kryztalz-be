import jwt from "jsonwebtoken";
import { compare } from "bcrypt";
import Gem from "../models/gem";
import User from "../models/user";
import Order from "../models/order";
import permissions from "../access/permissions";
import 
{
    cloudinaryUpload as uploadImages,
    cloudinaryDelete as deleteImages
} from "../middleware/fileHandler";

import { jwtSecret } from "../config";
import { throwErr, catchErr, checkValidationErr, deleteFiles } from "../utils";

const postGem = async ( req, res, next ) =>
{
    const images = req.files;
    const imageUrls = [];
    const imageIds = [];
    const paths = images.map( i => i.path );

    const uploader = async ( path ) => await uploadImages( path, 'Kryztalz' );

    if ( images.length < 1 || images.length > 4 )
    {

        deleteFiles( paths );
        const error =
        {
            message: "Invalid Images.\nNumber of images must be at least 1 and less than 5",
            data: []
        };
        return catchErr( error, next );
    }

    const errs = checkValidationErr( req );

    if ( errs )
    {
        //remove uploaded file
        //for some reason i cannot validate before file upload
        deleteFiles( paths );
        return catchErr( errs, next );
    }

    try 
    {
        for ( const img of images )
        {
            let { path } = img;

            const newPath = await uploader( path );

            imageUrls.push( newPath.url );
            imageIds.push( newPath.id );
        }

    }
    catch ( error ) 
    {

        deleteFiles( paths );
        return catchErr( error, next );
    }

    deleteFiles( paths );

    try 
    {
        let { type, name, cutType, price, description } = req.body;

        const gem = await new Gem(
            {
                type: type.toLowerCase(),
                name: name.toLowerCase(),
                cutType: cutType.toLowerCase(),
                price, description, imageUrls, imageIds
            }
        ).save();



        res.status( 201 ).json( gem );
    }
    catch ( error ) 
    {

        catchErr( error, next );
    }


};

const editGem = async ( req, res, next ) =>
{
    const images = req.files || [];
    const paths = images.map( i => i.path );

    const uploader = async ( path ) => await uploadImages( path, 'Kryztalz' );


    if ( images.length > 4 )
    {

        deleteFiles( paths );
        const error =
        {
            message: "Invalid Images.\nNumber of images must be at less than 5",
            data: []
        };
        return catchErr( error, next );
    }

    const errs = checkValidationErr( req );

    if ( errs )
    {

        deleteFiles( paths );
        return catchErr( errs, next );
    }


    try 
    {
        let { type, name, cutType, price, description } = req.body;
        let imageUrls = [];
        let imageIds = [];

        if ( images.length > 0 )
        {

            for ( const img of images )
            {
                let { path } = img;

                const newPath = await uploader( path );

                imageUrls.push( newPath.url );
                imageIds.push( newPath.id );
            }

            deleteFiles( paths );
        }

        let gem = await Gem.findById( req.params.gemId );


        if ( !gem )
        {
            const error =
            {
                message: "Unable to find gem with this id",
                statusCode: 404
            };
            throwErr( error );
        }

        gem.type = type.toLowerCase();
        gem.name = name.toLowerCase();
        gem.cutType = cutType.toLowerCase();
        gem.price = price;
        gem.description = description;

        if ( imageUrls.length > 0 )
        {

            gem.imageIds = imageIds;
            gem.imageUrls = imageUrls;
        }

        gem = await gem.save();

        res.json( gem );

    }
    catch ( error )
    {
        deleteFiles( paths );
        catchErr( error, next );
    }



};

const deleteGem = async ( req, res, next ) =>
{
    const deleter = async ( id ) => await deleteImages( id, "image" );
    const { gemId } = req.params;

    try 
    {
        const gem = await Gem.findById( gemId );

        if ( !gem )
        {
            const error =
            {
                message: "Unable to find gem with this id",
                statusCode: 404
            };
            throwErr( error );
        }

        for ( let index = 0; index < gem.imageIds.length; index++ ) 
        {
            const id = gem.imageIds[ index ];
            await deleter( id );

        }

        await Gem.deleteOne( { _id: gemId } );

        res.json( { message: `Gem ${ gemId } successfully deleted` } );
    }
    catch ( error ) 
    {
        catchErr( error, next );
    }


};

const addUserPermission = async ( req, res, next ) =>
{
    const { id, perms } = req.body;

    try 
    {
        const userToEdit = await User.findById( id, "name email roleId" );

        await userToEdit.addPerm( perms );

        res.json( userToEdit );
    }
    catch ( error ) 
    {
        catchErr( error, next );
        res.end();
    }

};

const removeUserPermission = async ( req, res, next ) =>
{
    const { id, perms } = req.body;

    try 
    {
        const userToEdit = await User.findById( id, "name email roleId" );

        await userToEdit.removePerm( perms );

        res.json( userToEdit );
    }
    catch ( error ) 
    {
        catchErr( error, next );
        res.end();
    }

};



const getUser = async ( req, res, next ) =>
{
    const { email } = req.body;
    const errs = checkValidationErr( req );

    if ( errs )
    {
        return catchErr( errs, next );
    }

    try 
    {
        const user = await User.findOne( { email }, 'name email roleId' );

        if ( !user )
        {
            const error =
            {
                message: "Unable to find user",
                statusCode: 404
            };
            throwErr( error );
        }

        res.status( 200 ).json( { user, permissions } );

    }
    catch ( error ) 
    {
        catchErr( error, next );
    }
};

const postSignIn = async ( req, res, next ) =>
{
    const { password, email } = req.body;

    const errs = checkValidationErr( req );

    if ( errs )
    {
        return catchErr( errs, next );
    }

    try 
    {
        const user = await User.findOne( { email: email.toLowerCase() } );
        if ( !user || !user.isVerified )
        {
            const error =
            {
                message: "Invalid user"
            };
            throwErr( error );
        }

        // @ts-ignore
        if ( !await compare( password, user.password ) )
        {
            const error =
            {
                message: "Email/Password mismatch"
            };
            throwErr( error );
        }

        const fourH = 1000 * 60 * 60 * 4;
        const token = jwt.sign(
            {
                userId: user._id.toString()
            }, jwtSecret,
            { expiresIn: "4h" }
        );


        res.status( 200 ).json( {
            user:
            {
                token,
                email,
                name: user.name,
                role: user.roleId,
                expires: ( fourH + new Date().getTime() )
            }
        } );


    }
    catch ( error ) 
    {
        catchErr( error, next );
    }
};

const getOverview = async ( req, res, next ) =>
{
    try 
    {
        const gemCount = await Gem.estimatedDocumentCount();

        const gemDistByType = await Gem.aggregate().
            group( { _id: '$type', count: { $sum: 1 } } );

        const gemDistByCut = await Gem.aggregate().
            group( { _id: '$cutType', count: { $sum: 1 } } );

        const ordersByType = await Order.aggregate(
            [
                { $project: { "items": 1 } },
                { $unwind: '$items' },
                {
                    $group:
                    {
                        _id:
                        {
                            _id: "$_id",
                            type: "$items.type",
                            quantity: "$items.quantity"
                        }
                    }
                },
                {
                    $group:
                    {
                        _id: "$_id.type",
                        count: { $sum: "$_id.quantity" }
                    }

                },
                {
                    $addFields:
                    {
                        count: { $toDouble: "$count" }
                    }
                }

            ] );

        const ordersByCut = await Order.aggregate(
            [
                { $project: { "items": 1 } },
                { $unwind: '$items' },
                {
                    $group:
                    {
                        _id:
                        {
                            _id: "$_id",
                            cutType: "$items.cutType",
                            quantity: "$items.quantity"
                        }
                    }
                },
                {
                    $group:
                    {
                        _id: "$_id.cutType",
                        count: { $sum: "$_id.quantity" }
                    }

                },
                {
                    $addFields:
                    {
                        count: { $toDouble: "$count" }
                    }
                }

            ] );


        res.json(
            {
                gemCount,
                gemDistByType,
                gemDistByCut,
                ordersByType,
                ordersByCut
            } );


    }
    catch ( error )
    {
        catchErr( error, next );
    }

};

export
{
    postGem,
    editGem,
    deleteGem,
    getUser,
    postSignIn,
    addUserPermission,
    removeUserPermission,
    getOverview
};
