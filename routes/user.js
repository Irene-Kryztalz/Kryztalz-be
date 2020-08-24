import { Router } from "express";
import { body, query } from "express-validator";

import User from "../models/user";


import { postSignUp, postSignIn, confirmEmail } from "../controllers/user";

const router = Router();

router.post( "/signup",
    [
        body( "email", "Invalid Email" )
            .trim()
            .normalizeEmail()
            .isEmail()
            .not()
            .isIn( [ "test@test.com" ] )
            .custom( ( value ) => 
            {
                return User.findOne( { email: value } )
                    .then( userDoc => 
                    {
                        if ( userDoc )
                        {
                            return Promise.reject( "User with this email already exists." );
                        }
                    } );
            } ),
        body( "name", "Username cannot be blank" )
            .trim()
            .isLength( { min: 1 } ),
        body( "password",
            "Password length must be at least 8 characters long. Only letters and numbers allowed" )
            .trim()
            .isLength( { min: 8 } )
            .isAlphanumeric(),
        body( "confirmPassword" )
            .custom( ( value, { req } ) =>
            {
                if ( value !== req.body.password )
                {
                    throw new Error( "The passwords do not match" );
                }
                return true;
            } )
            .trim()
    ], postSignUp );

router.post( "/signin",
    [
        body( "email", "Invalid Email" )
            .trim()
            .normalizeEmail()
            .isEmail(),
        body( "password",
            "Password length must be at least 8 characters long. Only letters and numbers allowed" )
            .trim()
            .notEmpty()
    ], postSignIn );

router.get( "/confirm-email",
    [
        query( "id", "User id is invalid" )
            .trim()
            .notEmpty(),
        query( "emailToken", "User token is invalid" )
            .trim()
            .notEmpty()
    ], confirmEmail );

export default router;
