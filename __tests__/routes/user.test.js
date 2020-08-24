// @ts-nocheck
import "core-js/stable";
import "regenerator-runtime/runtime";
import supertest from "supertest";

import setUpDB from "../../setUpTests";
import app from "../../app";

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

it( 'Tests that server is actiive', async done =>
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

it( "should verify that the user signed in with correct details", async done =>
{
    //seed db
    //use luffy to sign in
    //check luffy email = email in db
    //check luffy pword = pword in db
    done();
} );
