import { Router } from "express";
import { verifyJwtOwner  } from "../middlewares/autho.middlewares.js";
import { createProduct, updateProduct } from "../controllers/prodeuct.controller.js";
import {uplode} from "../middlewares/multer.middleware.js"


const router = Router();


router.route('/createProduct').post(
    uplode.fields([
        {
            name: "productImage",
        }
    ]),
    
createProduct)

router.route('/updateProduct').post( updateProduct)
export default router