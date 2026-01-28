import { asyncHandler } from '../utils/asyncHandeler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { User } from '../models/user.model.js';
import {createUser,findUser } from '../service/user.service.js';


const generateAccessAndRefereshTokens = async(userId) =>{
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}


const registerUser = asyncHandler( async (req, res) => {

    const {fullname, username, email, password} = req.body

    if(
        [fullname, username, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All field are require.")
    }

    const checkExistingUserCond = {
        email,
        username,
    }
    const existedUser = await findUser(checkExistingUserCond)

    if (existedUser.success) {
        throw new ApiError(409, existedUser.message)
    }

    const userPayload = {
        fullname,
        email,
        password,
        username: username.toLowerCase()

    }

    // const createdUser = User.findById(user._id).select(" -password -refreshToken ")
    const createdUser = await createUser(userPayload)

    if (!createdUser.success) {
        throw new ApiError(500, createUser.message)
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser.data, createdUser.message)
    )

})


const userlogin = asyncHandler( async (req, res) => {

    const {username, password, email} = req.body

    if (!username && !email) {
        throw new ApiError(401, "username and email are required.")
    }

    // const verifyingUser = {
    //     username,
    //     email
    // }

    // const user = await getUserById(verifyingUser)

    // if (user) {
    //     throw ApiError(409, user.message)
    // }

    const user = await User.findOne({
        $or: [{username},{email}]
    })

    if (!user) {
        throw new ApiError(400, "username or password is incorrect")
    }

    const isPasswordValid = await user.isPasswordCorrect(password)

    if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

    
   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200, 
            {
                user: loggedInUser, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
})


const userlogout = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200,{}, "User logout success."))

})




export { 
    registerUser,
    userlogin,
    userlogout
 }