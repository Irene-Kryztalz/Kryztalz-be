import { model, Schema } from "mongoose";
import { hash } from "bcrypt";
import { generateRandomToken } from "../utils";

const userSchema = new Schema(
    {
        email:
        {
            type: String,
            required: true
        },
        name:
        {
            type: String,
            required: true
        },
        password:
        {
            type: String,
            required: true
        },
        wishlist:
            [
                {
                    _id: false,
                    gemId:
                    {
                        type: Schema.Types.ObjectId,
                        ref: "Gem",
                        required: true,
                    },
                }
            ],

        cart:
            [
                {
                    _id: false,
                    gemId:
                    {
                        type: Schema.Types.ObjectId,
                        ref: "Product",
                        required: true,
                    },
                    quantity:
                    {
                        type: Number,
                        required: true,
                    },
                }
            ],
        isVerified: Boolean,
        token: String,
        tokenExpires: Date,
        isAdmin: Boolean

    }
);

/**
 * Hash and save the user's password before
 * saving to the database
 *
 * @return {null}
 */
userSchema.pre( 'save', async function ( next ) 
{
    const user = this;

    if ( user.password && user.isModified( "password" ) )
    {
        const oneHr = new Date().getTime() + ( 24 * 60 * 60 * 1000 );
        user.token = generateRandomToken( 12 );
        user.tokenExpires = new Date( oneHr );

        user.password = await hash( user.password, 12 );

    }


    next();
} );


export default model( "User", userSchema );
