// @ts-nocheck
import "core-js/stable";
import "regenerator-runtime/runtime";
import { compareSync } from "bcrypt";
import User from "../../models/user";
import setUpDB from "../../setUpTests";

setUpDB( "user-model" );

//describe user model
/**
 * it should hash user pwd
 * it should generate email token
 * it should not allow duplicate email
 */

describe( "The User model", () =>
{
    it( "should hash a user password", async () =>
    {
        const user =
        {
            name: "testing",
            password: "password",
            email: "test@test.com"
        };

        const createdUser = await new User( user ).save();

        expect( compareSync( user.password, createdUser.password ) ).toBe( true );
        expect( user.name ).toEqual( createdUser.name );
        expect( user.email ).toEqual( createdUser.email );
        expect( createdUser.emailToken ).toBeTruthy();
        expect( createdUser.emailTokenExpires ).toBeTruthy();
        expect( createdUser.isValid ).not.toBeTruthy();

        try 
        {
            await new User( user ).save();
        }
        catch ( error ) 
        {
            expect( error ).toBeTruthy();
        }

    } );
} );
