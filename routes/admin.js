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
router.post( "/gems", checkAuth, fileUpload, editGem );
router.delete( "/gems:id", checkAuth, deleteGem );


export default router;
