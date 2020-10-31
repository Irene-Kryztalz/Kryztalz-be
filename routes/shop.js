import { Router } from "express";
import checkAuth from "../middleware/checkAuth";

import 
{
    addToCart,
    addToWishList,
    purchaseItems,
    getAllProducts
}
    from "../controllers/shop";

const router = Router();

router.post( "/cart", checkAuth, addToCart );
router.post( "/wishlist", checkAuth, addToWishList );
router.get( "/gems", checkAuth, getAllProducts );
router.post( "/purchase", checkAuth, purchaseItems );

export default router;
