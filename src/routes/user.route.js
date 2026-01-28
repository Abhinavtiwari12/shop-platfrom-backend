import { Router } from "express";
import { verifyJwt } from "../middlewares/autho.middlewares.js";
import { registerUser, userlogin, userlogout } from "../controllers/user.controller.js";


const router = Router();




router.route('/createUser').post(registerUser)
router.route('/login').post(userlogin)
router.route('/user-logout').post(verifyJwt, userlogout)


export default router

