import { Router } from "express";
import
{
    postGem,
    editGem,
    deleteGem
} from "../controllers/admin";
import permissions from "../permissions";
import checkAuth from "../middleware/checkAuth";
import checkPermissions from "../middleware/checkPermissions";
import fileUpload from "../middleware/fileUpload";



const router = Router();


router.post( "/gems", checkAuth, checkPermissions( permissions.WRITE ), fileUpload, postGem );
router.put( "/gems:id", checkAuth, checkPermissions( permissions.WRITE ), fileUpload, editGem );
router.delete( "/gems:id", checkAuth, deleteGem );


export default router;
