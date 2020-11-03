import { Router } from "express";
import checkAuth from "../middleware/checkAuth";

import 
{
    purchaseItems,
}
    from "../controllers/orders";

const router = Router();

router.use( checkAuth );


router.post( "/purchase", purchaseItems );


export default router;
