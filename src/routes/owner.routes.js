import mongoose from "mongoose";
import { Router } from "express";
import { verifyJwt } from "../middlewares/autho.middlewares.js";

import { registerOwner, ownerlogin, ownerlogout } from "../controllers/owner.controller.js";


const router = Router();

router.route('/ownerRegister').post(registerOwner)
router.route('/ownerLogin').post(ownerlogin)
router.route('/ownerlogout').post(verifyJwt, ownerlogout)


export default router;