import multer from "multer";
import { nanoid } from 'nanoid';

const fileStorage = multer.diskStorage(
    {
        destination: ( req, file, cb ) =>
        {
            cb( null, `./images` );
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
        file.mimetype === "image/webp" )
    {
        cb( null, true );
    }
    else
    {
        cb( null, false );
    }

};

const upload = multer( { fileFilter, storage: fileStorage } ).array( 'photos', 4 );

export default upload;
