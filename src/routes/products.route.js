import { Router } from "express";
import { verifyJwtOwner  } from "../middlewares/autho.middlewares.js";
import { createProduct, 
    updateProduct, 
    deleteProduct, 
    searchProducts, 
    getMostSearchedProducts 
} from "../controllers/prodeuct.controller.js";
import {uplode} from "../middlewares/multer.middleware.js"


const router = Router();



router.route('/createProduct').post(
    verifyJwtOwner,
    uplode.fields([
        {name: "productImage",
            maxCount: 1
        }
    ]),
createProduct)

router.route('/updateProduct').put(verifyJwtOwner, updateProduct)
router.route('/deleteProduct').delete(verifyJwtOwner, deleteProduct)
router.route('/search').get(verifyJwtOwner, searchProducts)
router.route('/mostSearch').get(verifyJwtOwner, getMostSearchedProducts)

export default router