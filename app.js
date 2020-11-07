import path from "path";
import cors from 'cors';
import express from "express";
import { json } from "body-parser";

import { origin, admin_origin } from "./config";

import userRoutes from "./routes/user";
import shopRoutes from "./routes/shop";
import adminRoutes from "./routes/admin";
import ordersRoutes from "./routes/orders";

const app = express();

const whitelist = [ origin, admin_origin, "http://localhost:3000", "http://localhost:3001" ];

const corsOptions =
{
    origin: function ( origin, callback )
    {
        if ( whitelist.indexOf( origin ) !== -1 || !origin )
        {
            callback( null, true );
        } else
        {
            callback( new Error( 'Not allowed by CORS' ) );
        }
    }
};

app.use( cors( corsOptions ) );
app.use( json() );

app.use( "/images", express.static( path.join( __dirname, "images" ) ) );
app.get( "/favicon.ico", ( req, res ) => 
{
    res.status( 200 ).end();
} );

app.use( "/user", userRoutes );
app.use( "/shop", shopRoutes );
app.use( "/admin", adminRoutes );
app.use( "/orders", ordersRoutes );

app.get( [ "/", '/test' ], async ( req, res ) =>
{
    res.json( { message: 'Server is online!' } );
} );

app.use( ( req, res, next ) =>
{
    const err = new Error( "Resource not Found" );
    err.statusCode = 404;
    next( err );

} );

app.use( ( error, req, res, next ) =>
{
    const status = error.statusCode || 500;
    let data = error.data;

    res.status( status ).json(
        {
            error: error.message,
            data
        } );

} );

export default app;
