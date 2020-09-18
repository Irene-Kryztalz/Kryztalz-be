import { format } from "url";
import { port } from "../config";
import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";

import User from "../models/user";
import { sgKey, sender, jwtSecret } from "../config";
import { throwErr, catchErr, checkValidationErr } from "../utils";

sgMail.setApiKey( sgKey );

const postSignIn = async ( req, res, next ) =>
{
    const { password, email } = req.body;

    const errs = checkValidationErr( req );

    if ( errs )
    {
        return catchErr( errs, next );
    }


    try 
    {

        const user = await User.findOne( { email: email.toLowerCase() } );
        if ( !user || !user.isVerified )
        {
            const error =
            {
                message: "Invalid user",
                statusCode: 403
            };
            throwErr( error );
        }

        // @ts-ignore
        if ( !await compare( password, user.password ) )
        {
            const error =
            {
                message: "Email/Password mismatch"
            };
            throwErr( error );
        }

        const token = jwt.sign(
            {
                email,
                userId: user._id.toString()
            }, jwtSecret,
            { expiresIn: "10m" }
        );


        res.status( 200 ).json( { user: { token, email } } );


    }
    catch ( error ) 
    {
        catchErr( error, next );
    }
};

const postSignUp = async ( req, res, next ) =>
{
    const { name, email, password } = req.body;

    const errs = checkValidationErr( req );

    if ( errs )
    {
        return catchErr( errs, next );
    }

    const user = await new User(
        {
            name,
            email: email.toLowerCase(),
            password,
            wishlist: [],
            cart: [],
        } ).save();

    const response =
    {
        message: "User created",
        user:
        {
            name: user.name,
            email: user.email
        }
    };

    res.status( 201 ).json( response );

    const url = `${ format(
        {
            protocol: req.protocol,
            host: req.hostname,
        } ) }:${ port }/user/confirm-email?id=${ user._id }&emailToken=${ user.emailToken }`;

    //delete this later
    console.log( `${ url }` );

    //send mail
    /*
      const message = {
        to: email,
        from: sender,
        subject: "Krystalz",
        html: `<a target="_blank" href="${ url }">Confirm email.</a> <p> This link will expire in 1hr <p>`,
    };
    
    sgMail.send( message )
        .then( () => { } )
        .catch( error =>
        {
            if ( error.response )
            {
                console.error( "mail sending failed" );
            }
        } );
        */

};

const confirmEmail = async ( req, res, next ) =>
{
    const { id, emailToken } = req.query;

    try 
    {
        const user = await User.findById( id );

        if ( user.emailToken )
        {
            const timeLeft = user.emailTokenExpires.getTime() - new Date().getTime();

            if ( user.emailToken === emailToken && timeLeft > 0 )
            {
                // @ts-ignore
                user.isVerified = true;
                user.emailToken = undefined;
                user.emailTokenExpires = undefined;

                await user.save();

                res.status( 200 ).json( { message: "User verified" } );
            }
            else
            {
                const error =
                {
                    message: "Invalid Action. Unable to verify user",
                    statusCode: 403
                };
                throwErr( error );

            }
        }
        else
        {
            const error =
            {
                message: "Expired Token",
                statusCode: 403
            };
            throwErr( error );
        }

    }
    catch ( error ) 
    {
        catchErr( error, next );
    }

};


export
{
    postSignIn,
    postSignUp,
    confirmEmail
};
