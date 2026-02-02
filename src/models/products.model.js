import mongoose from "mongoose";
import { Owner } from "./owner.model.js";

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
        },
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Owner",
            // required: true,
            index: true
        }, 
        lastSearchedAt: Date,
    },
    {
        timestamps: true
    }
)

export const Product = mongoose.model("Product", productSchema)