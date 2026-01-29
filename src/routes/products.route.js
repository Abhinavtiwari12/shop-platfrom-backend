import { Router } from "express";
import { verifyJwtOwner  } from "../middlewares/autho.middlewares.js";
import { createProduct, updateProduct, deleteProduct } from "../controllers/prodeuct.controller.js";
import {uplode} from "../middlewares/multer.middleware.js"


const router = Router();



router.route('/createProduct').post(
    verifyJwtOwner,
    uplode.fields([
        {name: "productImage",}
    ]),
createProduct)

router.route('/updateProduct').post(verifyJwtOwner, updateProduct)
router.route('/deleteProduct').post(verifyJwtOwner, deleteProduct)

export default router