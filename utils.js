/**
 * Throw error for server failure (status code 5XX).
 * 
 * If no status code on error object, set it to 500.
 * @param {Object} err Error Object.
 * @param {function} next 
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
 * @param {string} errConfig.msg Error message.
 * @param {array} [errConfig.data = []] Data about the error.
 * @param {number} [errConfig.statusCode = 422] Error status code, default is 422.
 */
const throwErr = ( { msg, data = [], statusCode = 422 } ) =>
{
    const error = new Error( msg );
    error.statusCode = statusCode;
    error.data = data;

    throw error;
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

export
{
    generateRandomToken,
    catchErr,
    throwErr
};
