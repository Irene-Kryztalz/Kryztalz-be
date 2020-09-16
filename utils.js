import { validationResult } from "express-validator";

/**
 * Throw error for server failure (status code 5XX).
 * 
 * If no status code on error object, set it to 500.
 * @param {Object} err Error Object.
 * @param {function} next Call next middleware
 */
const catchErr = ( err, next ) =>
{
    if ( !err.statusCode )
    {
        err.statusCode = 500;
    }
    return next( err );
};


/**
 * Throw error for bad requests from client (status code 4XX)
 * @param {Object} errConfig Error message configuratons.
 * @param {string} errConfig.message Error message.
 * @param {array} [errConfig.data = []] Data about the error.
 * @param {number} [errConfig.statusCode = 422] Error status code, default is 422.
 */
const throwErr = ( { message, data = [], statusCode = 401 } ) =>
{
    const error = new Error( message );
    error.statusCode = statusCode;
    error.data = data;

    throw error;
};



/**
 * Catch error for bad requests from client (status code 4XX)
 * @param {Object} errConfig Error message configuratons.
 * @param {string} errConfig.message Error message.
 * @param {array} [errConfig.data = []] Data about the error.
 * @param {number} [errConfig.statusCode = 422] Error status 
 * code, default is 422.
 *
 * @param {function} next Call next middleware
 */


/**
 * Check for existence of errors in the input validation middleware
 * @param {Object} req The request
 * @param {Function} next Call next middleware
 * 
 *  
 */
const checkValidationErr = ( req ) =>
{
    const errors = validationResult( req );

    if ( !errors.isEmpty() )
    {

        const error =
        {
            message: "One or more fields are invalid",
            data: errors.array(),
            statusCode: 401
        };
        console.log( 77 );
        return error;
    }
    return null;
};


/**
 * Generate an string of random characters.
 * @param {number} len Token length.
 * 
 * @returns {string} token : A string that satisfies the given length.
 */

const generateRandomToken = ( len ) =>
{
    const chars = "0123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM$£";

    let token = "";

    for ( let i = 0; i < len; i++ ) 
    {
        token += chars.charAt( Math.floor( Math.random() * chars.length ) );
    }

    return token;
};

const parseBool = value =>
{
    switch ( value )
    {
        case false:
        case "false":
        case "undefined":
        case null:
        case undefined:
        case NaN:
        case 0:
            return false;

        default:
            return true;
    }
};


export
{
    generateRandomToken,
    catchErr,
    throwErr,
    checkValidationErr,
    parseBool
};
