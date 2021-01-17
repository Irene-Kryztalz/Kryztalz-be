import { Router } from "express";
import checkAuth from "../middleware/checkAuth";

import 
{
    addToCart,
    addToWishList,
    getAllGems,
    getAllFilteredGems,
    getOneGem,
    searchAllGems,
    removeFromWishList,
    removeFromCart,
    getExchange
}
    from "../controllers/shop";

const router = Router();

router.post( "/add-cart", checkAuth, addToCart );
router.post( "/add-wishlist", checkAuth, addToWishList );

router.post( "/remove-cart", checkAuth, removeFromCart );
router.post( "/remove-wishlist", checkAuth, removeFromWishList );

router.get( "/search", searchAllGems );
router.get( "/gems/filter", getAllFilteredGems );
router.get( "/gems/:gemId", getOneGem );
router.get( "/gems", getAllGems );

router.get( "/rates", getExchange );

export default router;
