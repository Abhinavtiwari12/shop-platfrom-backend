import { asyncHandler } from '../utils/asyncHandeler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { Product } from '../models/products.model.js';
import { uploadOnCloudinary, uploadOnCloudinaryBuffer } from '../utils/cloudinary.js';
import { findProduct, mostSearchedKeywords, mostSearchedProducts } from '../service/product.service.js';
import {searchQuery} from '../queries/product.queries.js'
import { User } from '../models/user.model.js';
import mongoose from 'mongoose';



const createProduct = asyncHandler( async (req, res) =>{
    const { productName, productId, quantity, price, category,}  = req.body

    if(
        [productName, productId, quantity, price, category].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All field are require.")
    }

    if (!req.file || !req.file.buffer) {
        throw new ApiError(400, "Product image is require")
    }

    const productImg = await uploadOnCloudinaryBuffer(req.file);

    // if (!productImg) {
    //     throw new ApiError(400, "productImage file is required")
    // }
    
// console.log("Uploaded Image:", productImg)

    const product = await Product.create({
        productName,
        productId,
        productImage: productImg?.secure_url || productImg?.url,
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

const searchProducts = asyncHandler(async (req, res) => {

    const { keyword } = req.query;

    if (!keyword) {
        return res.status(400).json({
            message: "Keyword is required"
        });
    }
    const query =  searchQuery(keyword);
    if(!query) ApiError(400,"Unable to get the query")
    const getProduct = await findProduct(query);

    if(!getProduct.success){
    return res.status(400).json({message:getProduct?.message});
    }

    const products = getProduct.data.data;

    if (req.user && Array.isArray(products) && products.length > 0) {

        const productId = products[0]._id;
        await User.updateOne(
            {
                _id: req.user._id,
                "searchedProducts.product": productId
            },
            {
                $inc: { "searchedProducts.$.count": 1 },
                $set: { "searchedProducts.$.searchedAt": new Date() }
            }
        );
        await User.updateOne(
            {
                _id: req.user._id,
                "searchedProducts.product": { $ne: productId }
            },
            {
                $push: {
                    searchedProducts: {
                    product: productId,
                    count: 1,
                    searchedAt: new Date()
                    }
                }
            }
        );
    }

    if (req.user && req.user._id) {

        const keywordText = keyword.toLowerCase().trim();

        const updateResult = await User.updateOne({
            _id: req.user._id,
            "searchedKeywords.keyword": keywordText
        },
        {
            $inc: { "searchedKeywords.$.count": 1 },
            $set: { "searchedKeywords.$.searchedAt": new Date() }
        });
        if (updateResult.matchedCount === 0) {
            await User.updateOne(
                { _id: req.user._id },
                {
                    $push: {
                        searchedKeywords: 
                        {
                            keyword: keywordText,
                            count: 1,
                            searchedAt: new Date()
                        }
                    }
                }
            );
        }
    }
        


    res.status(200).json({
        message:getProduct?.message,
        data:getProduct?.data
    });
});

const getMostSearchedProducts = asyncHandler(async (req, res) => {

  const limit = parseInt(req.query.limit) || 10;

  if (!limit) {
        return res.status(400).json({
            message: "limit is required"
        });
    }

  const products = await mostSearchedProducts(limit);

  if (!products) {
    throw new ApiError(400, "product not found please check");
    
  }

  return res.status(200).json({
    success: true,
    count: products?.length,
    data: products
  });

});




export { 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    searchProducts, 
    getMostSearchedProducts, 
    getMostSearchKeywords 
}