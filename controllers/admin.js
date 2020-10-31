//add a Gem
//edit a Gem
//delete a Gem
import Gem from "../models/gem";
import User from "../models/user";
import permissions from "../access/permissions";
import { throwErr, catchErr, checkValidationErr } from "../utils";

const postGem = async ( req, res, next ) =>
{
    const images = req.files;


    if ( images.length < 1 || images.length > 4 )
    {
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
        return catchErr( errs, next );
    }

    try 
    {
        let { type, name, cutType, price, description } = req.body;

        const imageUrls = images.map( img => 
        {
            if ( img.path.includes( "\\" ) )
            {
                return img.path.replace( "\\", "/" );
            }
            return img.path;
        } );


        const gem = await new Gem(
            {
                type: type.toLowerCase(),
                name: name.toLowerCase(),
                cutType: cutType.toLowerCase(),
                price, description, imageUrls
            }
        ).save();

        res.status( 201 ).json( { ...gem._doc, price } );
    }
    catch ( error ) 
    {
        catchErr( error, next );
    }


};

const editGem = ( req, res, next ) =>
{

    res.json( { message: "edit" } );
};

const deleteGem = ( req, res, next ) =>
{

    res.json( { message: "delete" } );
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

const getPermissions = ( req, res ) =>
{
    res.status( 200 ).json( permissions );
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

        res.status( 200 ).json( user );

    } catch ( error ) 
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
    getPermissions,
    addUserPermission,
    removeUserPermission,
};
