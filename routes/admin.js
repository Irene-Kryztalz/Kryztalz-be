import { Router } from "express";
import
{
    postGem,
    editGem,
    deleteGem
} from "../controllers/admin";
import User from "../models/user";
import permissions from "../permissions";
import checkAuth from "../middleware/checkAuth";
import checkPermissions from "../middleware/checkPermissions";
import fileUpload from "../middleware/fileUpload";

const router = Router();


router.post( "/gems", checkAuth, checkPermissions( permissions.WRITE ), fileUpload, postGem );
router.put( "/gems:id", checkAuth, checkPermissions( permissions.WRITE ), fileUpload, editGem );
router.delete( "/gems:id", checkAuth, deleteGem );

router.post( "/gems/add", checkAuth, ( req, res, next ) =>
{

} );


export default router;
