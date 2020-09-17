import { resolve } from "path";
import "core-js/stable";
import "regenerator-runtime/runtime";
import supertest from "supertest";

import { deleteFiles } from "../../utils";

import permissions from "../../permissions";
import setUpDB from "../../setUpTests";
import app from "../../app";
import User from "../../models/user";

const request = supertest( app );
setUpDB( "admin-endpoint" );


const users = [
    {
        name: "Naruto",
        email: "ramen_hokage@gmail.com",
        password: "testing99",
        confirmPassword: "testing99",
        permissions:
        {
            [ permissions.WRITE ]: true,
        }
    },
    {
        name: "Levi",
        email: "humanity_strongest@gmail.com",
        password: "testing99",
        confirmPassword: "testing99"
    }
];

const gemConfig =
{
    type: "emerald",
    name: "emarald",
    isRough: true,
    cutType: "",
    weight: 3,
    price: 12.88,
    description: "Description of gem",
    file: "test-img.jpg"
};

describe( 'The POST gem process', () => 
{

    it( 'tests that admin can post with correct credentials', async done => 
    {
        let userA = await new User( users[ 0 ] ).save();

        await request.get( `/user/confirm-email?id=${ userA._id }&emailToken=${ userA.emailToken }` );

        const t = await request.post( '/user/signin' )
            .send( { email: userA.email, password: users[ 0 ].password } );

        const token = t.body.user.token;

        const res = await request.post( '/admin/gems' )
            .set( "Content-Type", "multipart/form-data" )
            .set( "Authorization", `Bearer ${ token }` )
            .field( "name", gemConfig.name )
            .field( "type", gemConfig.type )
            .field( "isRough", gemConfig.isRough )
            .field( "cutType", gemConfig.cutType )
            .field( "weight", gemConfig.weight )
            .field( "price", gemConfig.price )
            .field( "description", gemConfig.description )
            .attach( "photos", resolve( __dirname, gemConfig.file ) );

        expect( res.body.name ).toEqual( gemConfig.name );
        expect( res.body.imageUrls[ 0 ].endsWith( gemConfig.file ) ).toBe( true );

        deleteFiles( res.body.imageUrls );

        done();

    } );

    it( 'tests that admin cannot post with incorrect credentials', async done => 
    {
        let userA = await new User( users[ 1 ] ).save();

        await request.get( `/user/confirm-email?id=${ userA._id }&emailToken=${ userA.emailToken }` );

        const t = await request.post( '/user/signin' )
            .send( { email: userA.email, password: users[ 1 ].password } );

        const token = t.body.user.token;

        const res = await request.post( '/admin/gems' )
            .set( "Content-Type", "multipart/form-data" )
            .set( "Authorization", `Bearer ${ token }` )
            .field( "name", gemConfig.name )
            .field( "type", gemConfig.type )
            .field( "isRough", gemConfig.isRough )
            .field( "cutType", gemConfig.cutType )
            .field( "weight", gemConfig.weight )
            .field( "price", gemConfig.price )
            .field( "description", gemConfig.description )
            .attach( "photos", resolve( __dirname, gemConfig.file ) );

        expect( res.body.message ).toBeTruthy();

        done();

    } );


} );
