import { resolve } from "path";
import "core-js/stable";
import "regenerator-runtime/runtime";
import supertest from "supertest";
import jwt from "jsonwebtoken";

import { jwtSecret } from "../../config";
import { cloudinaryDelete } from "../../middleware/fileHandler";

import setUpDB from "../../setUpTests";
import app from "../../app";
import User from "../../models/user";
import roles from "../../access/roles";

const request = supertest( app );
setUpDB( "admin-endpoint" );

const gemConfig =
{
    type: "emerald",
    name: "emarald",
    cutType: "none",
    weight: 3,
    price: 12.88,
    description: "Description of gem",
    file: "test-img.jpg"
};

let users = [];


describe( 'The POST gem process', () =>
{
    beforeAll( async done =>
    {
        //should not trigger pre middleware
        users = await User.insertMany( [
            {
                name: "Levi",
                email: "humanity_strongest@gmail.com",
                password: "testing99",
                isVerified: true,
                roleId: roles.SUPER_ADMIN
            }
        ] );

        done();
    } );

    it( 'tests that super admin can add gems', async done =>
    {

        let userA = users[ 0 ];

        const token = jwt.sign(
            {
                userId: userA._id.toString()
            }, jwtSecret );

        const res = await request.post( '/admin/gems' )
            .set( "Content-Type", "multipart/form-data" )
            .set( "Authorization", `Bearer ${ token }` )
            .field( "name", gemConfig.name )
            .field( "type", gemConfig.type )
            .field( "cutType", gemConfig.cutType )
            .field( "price", gemConfig.price )
            .field( "description", gemConfig.description )
            .attach( "photos", resolve( __dirname, gemConfig.file ) );

        expect( res.body.name ).toEqual( gemConfig.name );
        expect( res.body.imageUrls.length ).toEqual( 1 );

        await cloudinaryDelete( res.body.imageIds[ 0 ], "image" );

        done();


    } );

} );
