import express from "express";
import cookieParser from "cookie-parser";
import {registerUser, userlogin, userlogout} from './controllers/user.controller.js'
import { verifyJwt } from "./middlewares/autho.middlewares.js";

const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/test", async function (req, res) {
    res.send("hello")
})
app.post('/createUser',registerUser)
app.post('/loginUser', userlogin)
app.post('/user-logout', verifyJwt, userlogout)

export { app }