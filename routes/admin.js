import { Router } from "express";
import
{
    getGems,
    postGem,
    editGem,
    deleteGem
} from "../controllers/admin";
import checkAuth from "../middleware/checkAuth";

const router = Router();

router.get( "/gems", checkAuth, getGems );
router.post( "/gems", checkAuth, postGem );
router.post( "/gems", checkAuth, editGem );
router.delete( "/gems:id", checkAuth, deleteGem );


export default router;
