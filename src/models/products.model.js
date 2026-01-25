import mongoose from "mongoose";
import { category } from "./category.model";

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



    },
    {
        timestamps: true
    }
)

export const Product = mongoose.model("Product", productSchema)