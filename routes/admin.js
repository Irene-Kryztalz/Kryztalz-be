import { Router } from "express";
import
{
    postGem,
    editGem,
    deleteGem,
    addUserPermission,
    getPermissions,
} from "../controllers/admin";
import permissions from "../access/permissions";
import checkAuth from "../middleware/checkAuth";
import checkPermissions from "../middleware/checkPermissions";
import fileUpload from "../middleware/fileUpload";

const router = Router();


router.post( "/gems", checkAuth, checkPermissions( permissions.ADD_GEM ), fileUpload, postGem );
router.put( "/gems:id", checkAuth, checkPermissions( permissions.EDIT_GEM ), fileUpload, editGem );
router.delete( "/gems:id", checkAuth, checkPermissions( permissions.DELETE_GEM ), deleteGem );

router.put( "/add-permission", checkAuth, checkPermissions( permissions.EDIT_USER ), addUserPermission );

router.get( "/get-permissions", checkAuth, getPermissions );
export default router;
