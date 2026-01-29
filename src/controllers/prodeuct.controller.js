import { asyncHandler } from '../utils/asyncHandeler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { Product } from '../models/products.model.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';



const createProduct = asyncHandler( async (req, res) =>{
    const { productName, productId, quantity, price, category} = req.body

    if(
        [productName, productId, quantity, price, category].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All field are require.")
    }

    // const productImageLocalPth = req.files?.productImage?.path;

    let productImageLocalPth;
    if (req.files && Array.isArray(req.files.productImage) && req.files.productImage.length > 0) {
        productImageLocalPth = req.files.productImage[0].path
    }

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


export { createProduct, updateProduct, deleteProduct }