import jwt from "jsonwebtoken";
import { throwErr, catchErr } from "../utils";
import { jwtSecret } from "../config";

const checkAuth = ( req, res, next ) =>
{

    const authHeader = req.get( "Authorization" );
    if ( !authHeader )
    {

        const error =
        {
            message: "Not authenticated",
            statusCode: 401
        };

        throwErr( error );
    }
    const token = authHeader.split( " " )[ 1 ];
    let decodedToken;

    try 
    {
        decodedToken = jwt.verify( token, jwtSecret );
    }
    catch ( error ) 
    {
        error.statusCode = 403;
        return catchErr( error, next );
    }

    if ( !decodedToken )
    {
        const error =
        {
            message: "Not authenticated",
            statusCode: 401
        };

        throwErr( error );
    }

    // @ts-ignore
    req.userId = decodedToken.userId;

    next();

};

export default checkAuth;
