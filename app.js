import path from "path";
import express from "express";
import { json } from "body-parser";

import userRoutes from "./routes/user";

const app = express();

app.use( ( req, res, next ) =>
{
    res.header( "Access-Control-Allow-Origin", "*" );
    res.header( "Access-Control-Allow-Methods", "GET, POST, PUT,PATCH, DELETE" );
    res.header( "Access-Control-Allow-Headers", "Content-Type, Authorization" );
    next();
} );

app.use( json() );

app.use( "/images", express.static( path.join( __dirname, "images" ) ) );
app.get( "/favicon.ico", ( req, res ) => 
{
    res.status( 200 ).end();

} );


app.use( "/user", userRoutes );

app.use( ( req, res, next ) =>
{
    const err = new Error( "Not Found" );

    err.statusCode = 404;

    next( err );

} );


app.use( ( error, req, res, next ) =>
{
    const message = error.message;
    const status = error.statusCode || 500;
    const data = error.data;

    res.status( status ).json( { message, data } );

} );

export default app;
