import express from "express";
import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs"

const userSchema = new Schema(
    // username, email, password, name, refreshtoken

    {
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
    },
    {
        timestamps: true
    }
)


userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.method.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password)
}

export const  User = new mongoose.model("User", userSchema)
