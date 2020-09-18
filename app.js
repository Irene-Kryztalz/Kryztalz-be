import path from "path";
import cors from 'cors';
import express from "express";
import { json } from "body-parser";
import userRoutes from "./routes/user";
import adminRoutes from "./routes/admin";

const app = express();

app.use( cors() );
app.use( json() );

app.use( "/images", express.static( path.join( __dirname, "images" ) ) );
app.get( "/favicon.ico", ( req, res ) => 
{
    res.status( 200 ).end();

} );


app.use( "/user", userRoutes );
app.use( "/admin", adminRoutes );

app.get( '/test', async ( req, res ) =>
{
    res.json( { message: 'Server is online!' } );
} );

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
    let data = error.data;

    res.status( status ).json( { message, data } );

} );

export default app;
