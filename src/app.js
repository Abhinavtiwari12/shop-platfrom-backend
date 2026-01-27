import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import cors from 'cors';



// import {registerUser, userlogin, userlogout} from './controllers/user.controller.js'
// import { verifyJwt } from "./middlewares/autho.middlewares.js";

const app = express();

app.use(cors({
    origin: process.env.CROS_ORIGEN,
    credentials:true
}))

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(cookieParser());

// app.use("/test", async function (req, res) {
//     res.send("hello")
// })


app.use('/api/user', userRouter)


// app.post('/createUser',registerUser)
// app.post('/loginUser', userlogin)
// app.post('/user-logout', verifyJwt, userlogout)

export { app }