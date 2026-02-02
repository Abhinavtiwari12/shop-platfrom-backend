import mongoose from "mongoose";
import { Router } from "express";
import { verifyJwtOwner } from "../middlewares/autho.middlewares.js";
import { uplode } from "../middlewares/multer.middleware.js";

import { registerOwner,
    ownerlogin, 
    ownerlogout,
    userMostSearchProduct,
    userMostSearchKeywords,
    singleUserMostSearchProducts,
    singleUserMostSearchKeywords, 
  
} from "../controllers/owner.controller.js";


const router = Router();

router.route('/ownerRegister').post(registerOwner)
router.route('/ownerLogin').post(ownerlogin)
router.route('/ownerlogout').post(verifyJwtOwner, ownerlogout)
router.route('/userMostSearchProduct').get(verifyJwtOwner, userMostSearchProduct)
router.route('/userMostSearchKeyword').get(verifyJwtOwner, userMostSearchKeywords)
router.route('/singleUserMostSearchProducts').get(verifyJwtOwner, singleUserMostSearchProducts)
router.route('/singleUserMostSearchKeywords').get(verifyJwtOwner, singleUserMostSearchKeywords)


// router.route('/updateProduct/:id').post(verifyJwtOwner, updateProduct)


export default router;