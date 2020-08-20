import http from "http";
import app from "./app";

const server = http.createServer( app );

const port = 3000;

server.listen( port, () =>
{
    console.log( "Server is listening" );
} );
