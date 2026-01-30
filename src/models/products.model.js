import mongoose from "mongoose";
import { Category } from "../models/category.model.js";

const productSchema = new mongoose.Schema(
    // product details, product-id, quantity, brands, price, name, colour, 

    {
        productName: {
            type: String,
            require: true,
        },
        productId :{
            type: String,
            require: true,
            unique: true
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
            type: String,
        },
        searchCount:{
            type:Number,
            default:0,
            index: true
        }

    },
    {
        timestamps: true
    }
)

export const Product = mongoose.model("Product", productSchema)