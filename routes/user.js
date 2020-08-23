import { Router } from "express";
import { body } from "express-validator";

import User from "../models/user";


import { postSignUp, postSignIn, confirmEmail } from "../controllers/user";

const router = Router();

router.post( "/signup",
    [
        body( "email", "Invalid Email" )
            .trim()
            .isEmail()
            .normalizeEmail()
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
            .isLength( { min: 8 } )
            .isAlphanumeric()
            .trim(),
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

router.post( "/signin", postSignIn );

router.get( "/confirm-email", confirmEmail );

export default router;
