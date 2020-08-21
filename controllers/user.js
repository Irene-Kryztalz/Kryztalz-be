import User from "../models/user";
import sgMail from "@sendgrid/mail";

import { sgKey, sender } from "../config";
import { throwErr, catchErr } from "../utils";

sgMail.setApiKey( sgKey );

const postSignIn = ( req, res, next ) =>
{

};

const postSignUp = async ( req, res, next ) =>
{
    const { name, email, password, isAdmin } = req.body;

    const user = await new User(
        {
            name, email, password,
            wishlist: [],
            cart: [],
            isVerified: false,
            isAdmin
        } ).save();


    res.status( 201 ).json( { message: "User created", user } );

    const msg = {
        to: email,
        from: sender,
        subject: "Krystalz",
        html: `<a target="_blank" href="http://localhost:3031/user/confirm-email?id=${ user._id }&emailToken=${ user.emailToken }">Confirm email.</a> <p> This link will expire in 1hr <p>`,
    };

    //send mail
    sgMail.send( msg )
        .then( () => { } )
        .catch( error =>
        {
            console.error( error );
            if ( error.response )
            {
                console.error( error.response.body );
            }
        } );

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

                res.status( 200 ).json( { msg: "User verified" } );
            }
            else
            {
                const error =
                {
                    msg: "Invalid Action. Unable to verify user",
                    statusCode: 403
                };
                throwErr( error );

            }
        }
        else
        {
            const error =
            {
                msg: "Expired Token",
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
