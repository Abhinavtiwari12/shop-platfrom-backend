import { asyncHandler } from '../utils/asyncHandeler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { User } from '../models/user.model.js';
import {createUser } from '../service/user.service.js';
import { Owner } from '../models/owner.model.js';
import { Product } from '../models/products.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';


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

    const loggedInOwner = await Owner.findById(owner._id).select("-password -refreshToken")

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


const createProduct = asyncHandler( async (req, res) =>{
    const { productName, productId, quantity, price, category} = req.body

    if(
        [productName, productId, quantity, price, category].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All field are require.")
    }

    const productImageLocalPth = req.files?.productImage[0]?.path;

    if (!productImageLocalPth) {
        throw new ApiError(400, "Product image is require")
        
    }

    const productImage = uploadOnCloudinary(productImageLocalPth)

    const product = await Product.create({
        productName,
        productId,
        productImage: productImage.url,
        quantity,
        price,
        category, 
    })

    const newProduct = await Product.findById(product._id)

    if (!newProduct) {
        throw new ApiError(400, "somthing went wrong product doest not created")
    }

    return res.status(201).json(
        new ApiResponse(200, newProduct, "New product added Successfully")
    )
})

const updateProduct = asyncHandler( async (req, res) => {
    console.log("Params ID:", req.params.id);
    console.log("Body:", req.body);

    const {productName, quantity, price, category, productId} = req.body

    const product = await Product.findOneAndUpdate(
        // req.body._id,
        // req.params._id,
        { productId: productId},
        {
            $set: {
                productName,
                quantity,
                price,
                category, 
            }
        },
        {new: true}
    )

    // const updatedProduct = await Product.findById(Product._id)

    if (!product) {
        throw new ApiError(400, "somthing went wrong please check product id.")
    }

    return res
    .status(200)
    .json(new ApiResponse(200, product, "Account updated successfully"))
})

const deleteProduct = asyncHandler(async (req, res) => {
    const {productId} = req.body

    const product = await Product.findOneAndDelete(
        {productId: productId}
    )

    if (!product) {
        throw new ApiError(404, "Product does not dound")
    }

    return res.status(200).json(
        new ApiResponse(200, product, "product delete sucessfull.")
    )
})




export { 
    registerOwner,
    ownerlogin,
    ownerlogout,
    createProduct,
    updateProduct,
    deleteProduct
 }