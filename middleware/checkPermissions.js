import { throwErr, catchErr } from "../utils";
import User from "../models/user";

const checkPermissions = ( permission ) => ( req, res, next ) =>
{
    try 
    {
        const userPerms = User.findById( req.userId );
        if ( userPerms[ permission ] )
        {
            console.log( permission );
            console.log( userPerms );
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

    } catch ( error ) 
    {
        error.statusCode = 403;
        return catchErr( error, next );
    }

};

export default checkPermissions;
