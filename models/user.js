import { model, Schema } from "mongoose";
import { hash } from "bcrypt";
import permissions from "../permissions";
import { generateRandomToken } from "../utils";

const userSchema = new Schema(
    {
        email:
        {
            type: String,
            required: true,
            unique: true
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
        emailToken: String,
        emailTokenExpires: Date,
        permissions:
        {
            type: Object
        }

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

        // @ts-ignore
        user.emailToken = generateRandomToken( 12 );
        user.emailTokenExpires = new Date( oneHr );

        // @ts-ignore
        user.password = await hash( user.password, 12 );

    }


    next();
} );

/**
 * Add a permission to a user
 * @param {string} perm The permission 
 */
userSchema.methods.addPerm = function ( perm )
{
    if ( permissions[ perm ] )
    {
        const user = this;
        user.permissions[ perm ] = true;
        return user.save();
    }
    else
    {
        throw Error( `Cannot add permission ${ perm } to the user` );
    }
};

/**
 * Remove a permission from a user
 * @param {string} perm The permission 
 */
userSchema.methods.removePerm = function ( perm )
{
    if ( permissions[ perm ] )
    {
        const user = this;
        user.permissions[ perm ] = false;
        return user.save();
    }
    else
    {
        throw Error( `Cannot remove permission ${ perm } from user` );
    }
};


export default model( "User", userSchema );
