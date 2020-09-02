import { Router } from "express";
import { getProducts } from "../controllers/admin";
import checkAuth from "../middleware/checkAuth";

const router = Router();

router.get( "/products", checkAuth, getProducts );

export default router;
