import { throwErr, catchErr } from "../utils";
import roles from "../access/roles";
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
