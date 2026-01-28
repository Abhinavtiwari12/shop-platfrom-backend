import { Router } from "express";
import { verifyJwt } from "../middlewares/autho.middlewares.js";
import { createProduct } from "../controllers/prodeuct.controller.js";
import {uplode} from "../middlewares/multer.middleware.js"


const router = Router();


router.route('/createProduct').post(
    uplode.fields([
        {
            name: "productImage",
        }
    ]),
    
    createProduct)

export default router