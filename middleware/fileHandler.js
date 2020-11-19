import multer from "multer";
import { nanoid } from 'nanoid';
import cloudinary from "cloudinary";

import 
{
    cloudinary_secret,
    cloudinary_key,
    cloudinary_name
} from "../config";

cloudinary.config( {
    cloud_name: cloudinary_name,
    api_key: cloudinary_key,
    api_secret: cloudinary_secret
} );

const fileStorage = multer.diskStorage(
    {
        destination: ( req, file, cb ) =>
        {
            cb( null, `./images/` );
        },
        filename: ( req, file, cb ) =>
        {
            const fileId = nanoid();
            cb( null, `${ fileId }-${ file.originalname }` );
        },
    } );

const fileFilter = ( req, file, cb ) =>
{
    if ( file.mimetype === "image/jpeg" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/png" ||
        file.mimetype === "image/webp" ||
        file.mimetype === "image/svg+xml" )
    {
        cb( null, true );
    }
    else
    {
        cb( null, false );
    }

};

const cloudinaryUpload = ( file, folder ) =>
{
    return new Promise( ( resolve, reject ) =>
    {
        cloudinary.v2.uploader.upload( file,
            {
                resource_type: "auto",
                folder: folder,
                width: 400,
                height: 400,
                crop: "limit"
            }, ( error, result ) =>
        {

            if ( error )
            {

                reject( { ...error } );
            }
            else
            {

                resolve( {
                    url: result.secure_url,
                    id: result.public_id
                } );
            }

        } );
    } );
};

const cloudinaryDelete = ( id, type ) =>
{
    return new Promise( ( resolve, reject ) =>
    {
        cloudinary.v2.uploader.destroy( id,
            {
                resource_type: type
            }, ( error, result ) =>
        {
            if ( error )
            {
                reject( { message: "Unable to delete image( s ) from cloudinary" } );
            }
            else
            {
                resolve( result );
            }
        } );
    } );
};

const upload = multer( { fileFilter, storage: fileStorage } ).array( 'photos', 4 );

export default upload;
export { cloudinaryUpload, cloudinaryDelete };
