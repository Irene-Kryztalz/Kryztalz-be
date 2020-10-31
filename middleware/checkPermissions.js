import { throwErr, catchErr } from "../utils";
import User from "../models/user";

const checkPermissions = ( permission ) => async ( req, res, next ) =>
{

    try 
    {
        const user = await User.findById( req.userId, "roleId" );

        if ( !!( user.roleId & permission ) )
        {
            return next();
        }
        throwErr(
            {
                message: "Not enough permissions to perform this action",
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
