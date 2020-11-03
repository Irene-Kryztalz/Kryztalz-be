import { compare } from "bcrypt";
import jwt from "jsonwebtoken";
import sgMail from "@sendgrid/mail";

import User from "../models/user";
import { sgKey, sender, jwtSecret, email_confirm_template, email_trouble_template } from "../config";
import { throwErr, catchErr, checkValidationErr, generateRandomToken } from "../utils";

sgMail.setApiKey( sgKey );

function sendMail ( { to, template, data } )
{
    const message = {
        to,
        from: sender,
        templateId: template,
        dynamic_template_data: data
    };

    sgMail.send( message )
        .then( () => { } )
        .catch( error =>
        {
            if ( error.response )
            {
                console.error( `Unable to send mail to ${ to }` );
            }
        } );
}

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
                message: "Invalid user"
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

        const fourH = 1000 * 60 * 60 * 4;
        const token = jwt.sign(
            {
                userId: user._id.toString()
            }, jwtSecret,
            { expiresIn: "4h" }
        );


        res.status( 200 ).json( {
            user:
            {
                token,
                email,
                wishlist: user.wishlist,
                cart: user.cart,
                expires: ( fourH + new Date().getTime() )
            }
        } );


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

    try 
    {
        const user = await new User(
            {
                name: name.toLowerCase(),
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

        const url = `${ req.headers.origin }/verify-account?id=${ user._id }&emailToken=${ user.emailToken }`;

        console.log( url );

        //send mail


        /*
            sendMail(
                {
                    to: user.email,
                    template: email_confirm_template,
                    data:
                    {
                        name: user.name,
                        url
                    }
                }
            );
         */


    } catch ( error ) 
    {
        catchErr( error, next );
    }


};

const confirmEmail = async ( req, res, next ) =>
{
    const { id, emailToken } = req.query;
    const errs = checkValidationErr( req );

    if ( errs )
    {
        return catchErr( errs, next );
    }

    try 
    {
        const user = await User.findById( id );

        if ( user.isVerified )
        {
            const error =
            {
                message: "This account has already been confirmed",
                statusCode: 403
            };
            throwErr( error );
        }
        else if ( user.emailToken )
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

const troubleConfirm = async ( req, res, next ) =>
{
    const { id } = req.query;
    const errs = checkValidationErr( req );

    if ( errs )
    {
        return catchErr( errs, next );
    }

    try 
    {
        const user = await User.findById( id );

        if ( user.isVerified )
        {
            res.json( { message: "User has already been verified" } );
        }
        else 
        {

            user.emailToken = generateRandomToken( 12 );
            const oneHr = new Date().getTime() + ( 60 * 60 * 1000 );
            user.emailTokenExpires = new Date( oneHr );

            await user.save();

            const url = `${ req.headers.origin }/verify-account?id=${ user._id }&emailToken=${ user.emailToken }`;

            res.json( { message: "User has been sent another token" } );


            sendMail(
                {
                    to: user.email,
                    template: email_trouble_template,
                    data:
                    {
                        name: user.name,
                        url
                    }
                }
            );
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
    confirmEmail,
    troubleConfirm
};
