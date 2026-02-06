import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routes/user.route.js";
import ownerRouter from "./routes/owner.routes.js"
import productRouter from "./routes/products.route.js"
import cors from 'cors';




const app = express();

app.use(cors({
    origin: process.env.CROS_ORIGEN,
    credentials:true
}))

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(cookieParser());



app.use('/api/user', userRouter);
app.use('/api/owner', ownerRouter);
app.use('/api/product', productRouter)



export { app }