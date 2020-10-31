import { Router } from "express";
import { body } from "express-validator";
import
{
    postGem,
    editGem,
    deleteGem,
    getUser,
    getPermissions,
    addUserPermission,
    removeUserPermission
} from "../controllers/admin";
import permissions from "../access/permissions";
import checkAuth from "../middleware/checkAuth";
import checkPermissions from "../middleware/checkPermissions";
import fileUpload from "../middleware/fileUpload";

const router = Router();


router.post( "/gems", checkAuth, checkPermissions( permissions.ADD_GEM ), fileUpload, postGem );
router.put( "/gems:id", checkAuth, checkPermissions( permissions.EDIT_GEM ), fileUpload, editGem );
router.delete( "/gems:id", checkAuth, checkPermissions( permissions.DELETE_GEM ), deleteGem );


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

export default router;
