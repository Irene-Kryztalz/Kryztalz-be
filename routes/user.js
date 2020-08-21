import { Router } from "express";


import { postSignUp, postSignIn, confirmEmail } from "../controllers/user";

const router = Router();

router.post( "/signup", postSignUp );

router.post( "/signin", postSignIn );

router.get( "/confirm-email", confirmEmail );

export default router;
