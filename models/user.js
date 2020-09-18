// @ts-nocheck
import { model, Schema } from "mongoose";
import { hash } from "bcrypt";
import permissions from "../access/permissions";
import roles from "../access/roles";
import { generateRandomToken } from "../utils";

function defaultPermissions ()
{
    return (
        {
            [ permissions.ADD_GEM ]: false,
            [ permissions.READ_GEM ]: true,
            [ permissions.EDIT_GEM ]: false,
            [ permissions.DELETE_GEM ]: false,
            [ permissions.ADD_USER ]: false,
            [ permissions.READ_USER ]: false,
            [ permissions.EDIT_USER ]: false,
            [ permissions.DELETE_USER ]: false,
        }
    );
}

const userSchema = new Schema(
    {
        email:
        {
            type: String,
            required: true,
            unique: true,
            lowercase: true
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
                        ref: "Gem",
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
        roleId:
        {
            type: Number,
            default: roles.NORMAL
        },
        permissions:
        {
            type: Schema.Types.Mixed,
            default: defaultPermissions
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
        user.emailToken = generateRandomToken( 12 );
        user.emailTokenExpires = new Date( oneHr );
        user.password = await hash( user.password, 12 );

    }

    next();
} );

/**
 * Add a permission to a user
 * @param {string} perm The permission 
 */
userSchema.methods.addPerm = async function ( perm )
{

};

/**
 * Remove a permission from a user
 * @param {string} perm The permission 
 */
userSchema.methods.removePerm = function ( perm )
{

};

export default model( "User", userSchema );
