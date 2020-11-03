import { Router } from "express";
import { body } from "express-validator";
import
{
    postGem,
    editGem,
    deleteGem,
    getUser,
    getOverview,
    getPermissions,
    addUserPermission,
    removeUserPermission,
    postSignIn,
} from "../controllers/admin";
import permissions from "../access/permissions";
import checkAuth from "../middleware/checkAuth";
import checkPermissions from "../middleware/checkPermissions";
import fileUpload from "../middleware/fileUpload";

const router = Router();


router.post( "/signin",
    [
        body( "email", "Invalid Email" )
            .trim()
            .normalizeEmail()
            .isEmail(),
        body( "password",
            "Password length must be at least 8 characters long. Only letters and numbers allowed" )
            .trim()
            .notEmpty()
    ], postSignIn );



router.post( "/gems", checkAuth, checkPermissions( permissions.ADD_GEM ), fileUpload, postGem );
router.put( "/gems/:gemId", checkAuth, checkPermissions( permissions.EDIT_GEM ), fileUpload, editGem );
router.delete( "/gems/:gemId", checkAuth, checkPermissions( permissions.DELETE_GEM ), deleteGem );


router.post( "/user", checkAuth,
    [
        body( "email", "Invalid Email" )
            .trim()
            .normalizeEmail()
            .isEmail()
    ], getUser );

router.put( "/add-permission", checkAuth, checkPermissions( permissions.EDIT_USER ), addUserPermission );
router.put( "/remove-permission", checkAuth, checkPermissions( permissions.EDIT_USER ), removeUserPermission );
router.get( "/permissions", checkAuth, getPermissions );


router.get( "/overview", checkAuth, getOverview );


export default router;
