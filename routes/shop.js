import { Router } from "express";
import checkAuth from "../middleware/checkAuth";

import 
{
    addToCart,
    addToWishList,
    getAllGems,
    purchaseItems,
    getAllFilteredGems,
    getOneGem,
    searchAllGems
}
    from "../controllers/shop";

const router = Router();

router.post( "/cart", checkAuth, addToCart );
router.post( "/wishlist", checkAuth, addToWishList );

router.get( "/search", searchAllGems );
router.get( "/gems/filter", getAllFilteredGems );
router.get( "/gems/:gemId", getOneGem );
router.get( "/gems", getAllGems );

router.post( "/purchase", checkAuth, purchaseItems );

export default router;
