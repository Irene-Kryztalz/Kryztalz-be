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
import fileUpload from "../middleware/fileHandler";

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

router.post( "/gems", checkAuth, checkPermissions( permissions.ADD_GEM ),
    fileUpload, [
    body( "name", "Please provide a valid string" )
        .trim()
        .notEmpty(),
    body( "type", "Please provide a valid string for field `type`" )
        .trim()
        .notEmpty(),
    body( "cutType", "Please provide a valid string for field `cutType`" )
        .trim()
        .notEmpty(),
    body( "price", "Please provide a valid number for field `price`" )
        .isNumeric(),
    body( "description", "Please provide a valid string for field `description`" )
        .trim()
        .notEmpty(),

], postGem );

router.put( "/gems/:gemId",
    checkAuth,
    checkPermissions( permissions.EDIT_GEM ),
    fileUpload,
    [
        body( "name", "Please provide a valid string" )
            .trim()
            .notEmpty(),
        body( "type", "Please provide a valid string for field `type`" )
            .trim()
            .notEmpty(),
        body( "cutType", "Please provide a valid string for field `cutType`" )
            .trim()
            .notEmpty(),
        body( "price", "Please provide a valid number for field `price`" )
            .isNumeric(),
        body( "description", "Please provide a valid string for field `description`" )
            .trim()
            .notEmpty(),

    ],
    editGem );
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
