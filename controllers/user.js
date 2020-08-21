import User from "../models/user";

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
};

export
{
    postSignIn,
    postSignUp
};
