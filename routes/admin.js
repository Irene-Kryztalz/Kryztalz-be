import { Router } from "express";
import
{
    postGem,
    editGem,
    deleteGem
} from "../controllers/admin";

import checkAuth from "../middleware/checkAuth";
import fileUpload from "../middleware/fileUpload";



const router = Router();


router.post( "/gems", checkAuth, fileUpload, postGem );
router.put( "/gems:id", checkAuth, fileUpload, editGem );
router.delete( "/gems:id", checkAuth, deleteGem );


export default router;
