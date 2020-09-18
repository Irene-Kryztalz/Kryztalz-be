//add a Gem
//edit a Gem
//delete a Gem
import Gem from "../models/gem";
import User from "../models/User";
import { throwErr, catchErr, checkValidationErr, parseBool } from "../utils";

const postGem = async ( req, res, next ) =>
{
    const images = req.files;

    if ( images.length < 1 || images.length > 4 )
    {
        throwErr( { message: "Invalid Images.\nNumber of images must be at least 1 and less than 5", statusCode: 400 } );
    }
    checkValidationErr( req );

    try 
    {
        let { type, name, isRough, cutType, weight, price, description } = req.body;

        isRough = isRough === "";

        if ( parseBool( isRough ) )
        {
            cutType = "";
        }
        else
        {
            isRough = false;
        }

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
                isRough,
                weight,
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

const editUser = async ( req, res, next ) =>
{
    const { id, perms } = req.body;

    try 
    {
        const userToEdit = await User.findById( id, "roleId permissions" );

        console.log( userToEdit );

        res.end();
    }
    catch ( error ) 
    {
        catchErr( error, next );
        res.end();
    }

};




export
{

    postGem,
    editGem,
    deleteGem,
    editUser
};
