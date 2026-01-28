import { asyncHandler } from '../utils/asyncHandeler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { Product } from '../models/products.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

// const generateAccessAndRefereshTokens = async(ownerId) =>{
//     try {
//         const owner = await Owner.findById(ownerId)
//         const accessToken = owner.generateAccessToken()
//         const refreshToken = owner.generateRefreshToken()

//         owner.refreshToken = refreshToken
//         await owner.save({ validateBeforeSave: false })

//         return {accessToken, refreshToken}


//     } catch (error) {
//         throw new ApiError(500, "Something went wrong while generating referesh and access token")
//     }
// }

const createProduct = asyncHandler( async (req, res) =>{
    const { productName, productId, quantity, price, category} = req.body

    if(
        [productName, productId, quantity, price, category].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All field are require.")
    }

    const productImageLocalPth = req.files?.productImage?.path;

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

export { createProduct }