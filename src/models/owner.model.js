import mongoose, { Schema } from "mongoose";

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
    }
})

export const Owner = new mongoose.model("Owner", ownerSchema)