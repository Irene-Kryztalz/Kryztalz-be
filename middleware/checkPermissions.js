import { throwErr, catchErr } from "../utils";
import permissions from "../permissions";
import User from "../models/user";

const checkPermissions = ( permission ) => async ( req, res, next ) =>
{
    try 
    {

        const userPerms = await User.findById( req.userId );

        const condition = ( userPerms.permissions[ permission ] || userPerms.permissions[ permissions.ALL ] ) && !userPerms.permissions[ permissions.NONE ];



        if ( permissions[ permission ] && condition )
        {
            next();
        }
        else
        {
            const error =
            {
                message: "Not allowed",
                statusCode: 403
            };

            throwErr( error );
        }

    }
    catch ( error ) 
    {

        error.statusCode = 403;
        return catchErr( error, next );
    }

};

export default checkPermissions;
