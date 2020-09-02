import { Router } from "express";
import
    {
        getProducts,
        postProduct
    } from "../controllers/admin";
import checkAuth from "../middleware/checkAuth";

const router = Router();

router.get( "/products", checkAuth, getProducts );
router.post( "/products", checkAuth, postProduct );


export default router;
