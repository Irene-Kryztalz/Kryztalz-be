import { Router } from "express";
import { body } from 'express-validator';
import checkAuth from "../middleware/checkAuth";

import 
{
    getOrders,
    createOrder,
    getOneOrder,
    generateOrderInvoice,
}
    from "../controllers/orders";

const router = Router();

router.use( checkAuth );


router.get( "/", getOrders );
router.get( "/:orderId", getOneOrder );

router.post( "/",
    [
        body( "items", "Please provide an array containing objects with _id and quantity keys" )
            .isArray( { min: 1 } ),
        body( "userCurrency", "Please provide a currency symbol" )
            .trim()
            .notEmpty(),
        body( "rateToCurr", "Please provide a number  (greater than 0) that represents the value of 1 unit of currency in naira" )
            .isNumeric()
            .not().equals( "0" )
    ]
    , createOrder );
router.get( "/invoice/:orderId", generateOrderInvoice );


export default router;
