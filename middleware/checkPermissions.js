import { throwErr, catchErr } from "../utils";
import roles from "../access/roles";
import permissions from "../access/permissions";
import User from "../models/user";

const checkPermissions = ( permission ) => async ( req, res, next ) =>
{
    try 
    {
        const user = await User.findById( req.userId );

        if ( user.permissions[ permissions[ permission ] ] || user.roleId === roles.SUPER_ADMIN )
        {
            console.log( user );
            return next();

        }
        throwErr(
            {
                message: "Not allowed",
                statusCode: 403
            }
        );


    }
    catch ( err ) 
    {
        catchErr( err, next );
    }

};

export default checkPermissions;
