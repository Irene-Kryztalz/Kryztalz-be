import { connection, connect } from "mongoose";
import { dbUrlTest } from "../config";

const opts =
{
    useUnifiedTopology: true,
    useNewUrlParser: true
};

async function removeAllCollections ()
{
    const collections = Object.keys( connection.collections );
    for ( const collectionName of collections )
    {
        const collection = connection.collections[ collectionName ];
        await collection.deleteMany( {} );
    }
}

async function dropAllCollections ()
{
    const collections = Object.keys( connection.collections );
    for ( const collectionName of collections )
    {
        const collection = connection.collections[ collectionName ];
        try
        {
            await collection.drop();
        } catch ( error )
        {
            // Sometimes this error happens, but you can safely ignore it
            if ( error.message === 'ns not found' ) return;
            // This error occurs when you use it.todo. You can
            // safely ignore this error too
            if ( error.message.includes( 'a background operation is currently running' ) ) return;
            console.log( error.message );
        }
    }
}

const setUpDB = () =>
{
    // Connect to Mongoose
    beforeAll( async () =>
    {
        await connect( dbUrlTest, opts );
    } );

    // Cleans up database between each test
    afterEach( async () =>
    {
        await removeAllCollections();
    } );

    // Disconnect Mongoose
    afterAll( async () =>
    {
        await dropAllCollections();
        await connection.close();
    } );
};

export default setUpDB;
