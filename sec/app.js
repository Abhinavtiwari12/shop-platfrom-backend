import express from "express";
import cookieParser from "cookie-parser";

const app = express();


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(cookieParser());

app.use("/createUser", userRoutes)

export { app }