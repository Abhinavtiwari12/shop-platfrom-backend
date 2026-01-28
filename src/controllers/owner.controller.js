import { asyncHandler } from '../utils/asyncHandeler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { User } from '../models/user.model.js';
// import {createUser } from '../service/user.service.js';
import { Owner } from '../models/owner.model.js';


const generateAccessAndRefereshTokens = async(ownerId) =>{
    try {
        const owner = await Owner.findById(ownerId)
        const accessToken = owner.generateAccessToken()
        const refreshToken = owner.generateRefreshToken()

        owner.refreshToken = refreshToken
        await owner.save({ validateBeforeSave: false })

        return {accessToken, refreshToken}


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating referesh and access token")
    }
}


const registerOwner = asyncHandler( async (req, res) => {

    const {fullname, username, email, password} = req.body

    if(
        [fullname, username, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All field are require.")
    }

    // const checkExistingUserCond = {
    //     email,
    //     username,
    // }
    // const existedowner = await findUser(checkExistingUserCond)

    // if (existedUser.success) {
    //     throw new ApiError(409, existedUser.message)
    // }

    // const userPayload = {
    //     fullname,
    //     email,
    //     password,
    //     username: username.toLowerCase()

    // }

    const existedOwner = await Owner.findOne({
        $or: [{ username }, { email }]
    })

    if (existedOwner) {
        throw new ApiError(409, "User with email or username already exists")
    }

    const owner = await Owner.create({
        fullname,
        email,
        password,
        username: username.toLowerCase()

    })

    const createdOwner = Owner.findById(owner._id).select(" -password -refreshToken ")
    // const createdUser = await createUser(userPayload)

    if (!createdOwner) {
        throw new ApiError(500, "somthing went wrong")
    }

    return res.status(201).json(
        new ApiResponse(200, createdOwner.data, createdOwner.message)
    )

})


const ownerlogin = asyncHandler( async (req, res) => {

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

    const owner = await Owner.findOne({
        $or: [{username},{email}]
    })

    if (!owner) {
        throw new ApiError(400, "username or password is incorrect")
    }

    const isPasswordValid = await owner.isPasswordCorrect(password)

    if (!isPasswordValid) {
    throw new ApiError(401, "Invalid user credentials")
    }

    
   const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(owner._id)

    const loggedInOwner = await User.findById(owner._id).select("-password -refreshToken")

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
                owner: loggedInOwner, accessToken, refreshToken
            },
            "User logged In Successfully"
        )
    )
})


const ownerlogout = asyncHandler(async (req, res) => {
    await Owner.findByIdAndUpdate(
        req.owner._id,
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
    .json(new ApiResponse(200,{}, "Owner logout success."))

})




export { 
    registerOwner,
    ownerlogin,
    ownerlogout
 }