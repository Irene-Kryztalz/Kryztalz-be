//add a Gem
//edit a Gem
//delete a Gem
import Gem from "../models/gem";
import User from "../models/user";
import permissions from "../access/permissions";
import { throwErr, catchErr, checkValidationErr, parseBool } from "../utils";

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
    checkValidationErr( req );

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

        res.status( 201 ).json( gem );
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
        const userToEdit = await User.findById( id, "roleId permissions" );

        userToEdit.addPerm( perms );

        res.end();
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
        const userToEdit = await User.findById( id, "roleId permissions" );

        userToEdit.removePerm( perms );

        res.end();
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




export
{

    postGem,
    editGem,
    deleteGem,
    getPermissions,
    addUserPermission,
    removeUserPermission,
};
