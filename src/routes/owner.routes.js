import mongoose from "mongoose";
import { Router } from "express";
import { verifyJwt } from "../middlewares/autho.middlewares.js";
// import { ownerlogin, own } from "../controllers/owner.controller.js";
import { registerOwner, ownerlogin, ownerlogout } from "../controllers/owner.controller.js";
// import { app } from "../app";

const router = Router();

router.route('/ownerRegister').post(registerOwner)
router.route('/ownerLogin').post(ownerlogin)
router.route('/ownerlogout').post(ownerlogout)


export default router;