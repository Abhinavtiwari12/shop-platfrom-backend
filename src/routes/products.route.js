import { Router } from "express";
import { verifyJwt, verifyJwtOwner  } from "../middlewares/autho.middlewares.js";
import { createProduct, 
    updateProduct, 
    deleteProduct, 
    searchProducts, 
    getMostSearchedProducts, 
    getMostSearchKeywords
} from "../controllers/prodeuct.controller.js";
import {uplode} from "../middlewares/multer.middleware.js"


const router = Router();



router.route('/createProduct').post(
    verifyJwtOwner,
    uplode.single('productImage'),
createProduct)

router.route('/updateProduct').put(verifyJwtOwner, updateProduct)
router.route('/deleteProduct').delete(verifyJwtOwner, deleteProduct)
// router.route('/search').get(verifyJwtOwner, searchProducts)
router.route('/search').get(searchProducts)
router.route('/mostSearch').get(verifyJwtOwner, getMostSearchedProducts)
router.route('/mostSearchKeyword').get(verifyJwtOwner, getMostSearchKeywords)

export default router