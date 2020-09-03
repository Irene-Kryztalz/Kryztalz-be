// @ts-nocheck
import "core-js/stable";
import "regenerator-runtime/runtime";
import supertest from "supertest";

import setUpDB from "../../setUpTests";
import app from "../../app";
import User from "../../models/user";

const request = supertest( app );
setUpDB( "user-endpoint" );

const users = [
    {
        name: "Naruto",
        email: "ramen_hokage@gmail.com",
        password: "testing99",
        confirmPassword: "testing99"
    },
    {
        name: "Luffy",
        email: "gomu_gomu@gmail.com",
        password: "testing99",
        confirmPassword: "testing99"
    },
    {
        name: "Levi",
        email: "humanity_strongest@gmail.com",
        password: "testing99",
        confirmPassword: "testing99"
    }
];

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
    const res = await request.post( '/user/signup' )
        .send( users[ 2 ] );

    //Ensures response contains name and email
    expect( res.body.user.name ).toEqual( "Levi" );
    expect( res.body.user.email ).toEqual( "humanity_strongest@gmail.com" );


    done();
} );



describe( 'Test sign in process', () =>
{


    it( "should verify that the user signed in with correct details", async done =>
    {

        const userA = await User.create( users[ 0 ] );

        await request.get( `/user/confirm-email?id=${ userA._id }&emailToken=${ userA.emailToken }` );

        const res = await request.post( '/user/signin' )
            .send( { email: userA.email, password: users[ 0 ].password } );


        expect( res.body.user.email ).toEqual( userA.email );

        done();
    } );


    it( "should not sign user in", async ( done ) => 
    {

        const userB = await User.create( users[ 1 ] );

        const res = await request.post( '/user/signin' )
            .send( { email: userB.email, password: userB.password } );

        expect( res.body.message ).toEqual( "Invalid user" );
        done();

    } );


} );
