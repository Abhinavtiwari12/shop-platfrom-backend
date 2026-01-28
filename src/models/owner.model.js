import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const ownerSchema = new Schema({

    
    username:{
        type: String,
        unique: true,
        lowercase: true,
        require: true,
        trim: true,
        index: true
    },
    email: {
        type: String,
        require: true,
        lowercase: true,
        unique: true,
        trim: true
    },
    password :{
        type: String,
        require: true,
        trim: true,
    },
    fullname: {
        type: String,
        require: true,
        index: true,
    },
    refreshToken:{
        type: String
    },
    
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

})


ownerSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10)
})

ownerSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password)
}

ownerSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username,
            fullname: this.fullname
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

ownerSchema.methods.generateRefreshToken = function() {
    return jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}



export const Owner = new mongoose.model("Owner", ownerSchema)