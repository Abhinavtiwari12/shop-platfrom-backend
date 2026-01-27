import mongoose from "mongoose";
import { category } from "../models/category.model.js";

const productSchema = new mongoose.Schema(
    // product details, product-id, quantity, brands, price, name, colour, 

    {
        name: {
            type: String,
            require: true,
        },
        productId :{
            type: String,
            require: true,
        },
        productImage: {
            type: String  // url
        },
        quantity:{
            type: Number,
            default : 0
        },
        price:{
            type: Number,
            require: true,
        },
        category:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Category"
        },
        productImage:{
            type: String,
            
        }



    },
    {
        timestamps: true
    }
)

export const Product = mongoose.model("Product", productSchema)