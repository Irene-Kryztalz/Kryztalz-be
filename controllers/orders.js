import Order from "../models/order";
import { throwErr, catchErr } from "../utils";

const ITEM_PER_PAGE = 10;

const purchaseItems = async ( req, res, next ) =>
{

};

const getOneOrder = async ( req, res, next ) =>
{

};

const getOrders = async ( req, res, next ) =>
{

};

const createOrder = async ( req, res, next ) =>
{

};

const generateOrderInvoice = async ( req, res, next ) =>
{

    try 
    {
        res.json();
    }
    catch ( error )
    {

    }

};

export 
{
    getOrders,
    createOrder,
    getOneOrder,
    purchaseItems,
    generateOrderInvoice,
};
