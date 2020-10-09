// @ts-nocheck
import { model, Schema } from "mongoose";
import { hash } from "bcrypt";
import { inverse } from "../access/permissions";
import roles from "../access/roles";
import { generateRandomToken } from "../utils";

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
            required: true,
            lowercase: true
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
        const oneHr = new Date().getTime() + ( 60 * 60 * 1000 );
        user.emailToken = generateRandomToken( 12 );
        user.emailTokenExpires = new Date( oneHr );
        user.password = await hash( user.password, 12 );

    }

    next();
} );

/**
 * Add a permissions to a user
 * @param {Array} perms The permissions 
 */
userSchema.methods.addPerm = async function ( perms )
{
    const user = this;

    perms.forEach( perm => 
    {
        if ( perm in inverse )
        {
            user.roleId = user.roleId | +perm;
        }
    } );

    user.save();

};

/**
 * Remove  permissions from a user
 * @param {Array} perms The permissions
 */
userSchema.methods.removePerm = function ( perms )
{
    const user = this;

    perms.forEach( perm => 
    {
        if ( perm in inverse && !!( user.roleId & perm ) )
        {
            user.roleId = user.roleId ^ +perm;
        }
    } );

    user.save();
};

export default model( "User", userSchema );
