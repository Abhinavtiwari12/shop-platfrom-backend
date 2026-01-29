import mongoose from "mongoose";
import { Router } from "express";
import { verifyJwtOwner } from "../middlewares/autho.middlewares.js";
import { uplode } from "../middlewares/multer.middleware.js";

import { registerOwner,
    ownerlogin, 
    ownerlogout, 
    createProduct, 
    updateProduct, 
    deleteProduct 
} from "../controllers/owner.controller.js";


const router = Router();

router.route('/ownerRegister').post(registerOwner)
router.route('/ownerLogin').post(ownerlogin)
router.route('/ownerlogout').post(verifyJwtOwner, ownerlogout)
// router.route('/createProduct')

router.route('/createProduct').post(
    verifyJwtOwner,
    uplode.fields([
        {name: "productImage",}
    ]),
createProduct)

router.route('/updateProduct').post(verifyJwtOwner, updateProduct)
router.route('/deleteProduct').post(verifyJwtOwner, deleteProduct)

// router.route('/updateProduct/:id').post(verifyJwtOwner, updateProduct)


export default router;