import { Router } from "express";
import { verifyJwt } from "../middlewares/autho.middlewares.js";
import { createProduct } from "../controllers/prodeuct.controller.js";


const router = Router();


router.route('/createProduct').post(verifyJwt, createProduct)