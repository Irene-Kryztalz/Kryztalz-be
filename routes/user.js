import { Router } from "express";


import { postSignUp, postSignIn } from "../controllers/user";

const router = Router();

router.post( "/signup", postSignUp );

router.post( "/signin", postSignIn );

export default router;
