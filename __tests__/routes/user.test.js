import "core-js/stable";
import "regenerator-runtime/runtime";
import supertest from "supertest";
import { hash } from "bcrypt";

import roles from "../../access/roles";
import setUpDB from "../../setUpTests";
import app from "../../app";
import User from "../../models/user";

const request = supertest( app );
setUpDB( "user-endpoint" );

it( 'Tests that server is active', async done =>
{
    // Sends GET Request to /test endpoint
    const response = await request.get( '/test' );

    expect( response.status ).toBe( 200 );
    expect( response.body.message ).toBe( 'Server is online!' );

    // ...
    done();
} );

it( 'Should save user to database', async done =>
{
    const user =
    {
        name: "Naruto",
        email: "ramen_hokage@gmail.com",
        password: "testing99",
        confirmPassword: "testing99"
    };

    const res = await request.post( '/user/signup' )
        .send( user );

    //Ensures response contains name and email
    expect( res.body.user.name ).toEqual( user.name );
    expect( res.body.user.email ).toEqual( user.email );


    done();
} );



describe( 'Test sign in process', () =>
{
    let verified;

    beforeAll( async done =>
    {
        verified = await User.insertMany( [
            {
                name: "Levi",
                email: "humanity_strongest@gmail.com",
                password: await hash( "testing123", 12 ),
                isVerified: true,
                roleId: roles.SUPER_ADMIN
            },
            {
                name: "Naruto",
                email: "ramen_hokage@gmail.com",
                password: await hash( "testing123", 12 ),
                isVerified: true,
                roleId: roles.NORMAL
            },
        ] );

        done();

    } );


    it( "should verify that the user signed in with correct details", async done =>
    {

        const userA = verified[ 0 ];

        const res = await request.post( '/user/signin' )
            .send( { email: userA.email, password: "testing123" } );

        expect( res.body.user.email ).toEqual( userA.email );

        done();
    } );


    it( "should not sign user in", async ( done ) => 
    {

        const userB = verified[ 1 ];

        const res = await request.post( '/user/signin' )
            .send( { email: userB.email, password: "TEST" } );

        expect( res.body.message ).toEqual( "Invalid user" );
        done();

    } );


} );
