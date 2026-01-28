import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandeler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { Owner } from "../models/owner.model.js";

export const verifyJwt = asyncHandler(async (req, res, next)  =>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")
    
        if (!token) {
            throw new ApiError(401, "unathorized token")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        // const owner = await Owner.findById(decodedToken?._id).select("-password -refreshToken")    
    
        if (!user) {
            throw new ApiError(409, "invalid access token")
        }
        // if (!owner) {
        //     throw new ApiError(409, "invalid access token")
        // }
    
        req.user = user;
        // req.owner = owner;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid access token")
    }
})




export const verifyJwtOwner = asyncHandler(async (req, res, next)  =>{
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer", "")
    
        if (!token) {
            throw new ApiError(401, "unathorized token")
        }
    
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        // const user = await User.findById(decodedToken?._id).select("-password -refreshToken")

        const owner = await Owner.findById(decodedToken?._id).select("-password -refreshToken")    
    
        // if (!user) {
        //     throw new ApiError(409, "invalid access token")
        // }

        if (!owner) {
            throw new ApiError(409, "invalid access token")
        }
    
        // req.user = user;
        req.owner = owner;
        next()
    } catch (error) {
        throw new ApiError(401, error?.message || "invalid access token")
    }
})

// export {verifyJwt, verifyJwtOwner}