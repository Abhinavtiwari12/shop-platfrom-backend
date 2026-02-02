import mongoose from 'mongoose';
import {findDataAndAggregate, findMany, updateData} from '../dal/dal.js'
import {Product} from '../models/products.model.js'
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/apiError.js';

export const findProduct = async(query) => {
    if(!query) return {success:false,message:"Condition is required",data:null};
    const getSearchedProduct = await findDataAndAggregate(Product,query);
    if(getSearchedProduct == []) return {success:false,message:"Unable to get the product",data:null};
    const condition = {
        // _id: new mongoose.Types.ObjectId(getSearchedProduct[0]?._id)
        _id: { $in: getSearchedProduct.map(p => p._id) }

    }
    // console.log("ifbieurgvn", condition)
    const updateBody = {
            $inc:{
                searchCount: 1
            }
    }
    const updatedSearchedProductCount = await updateData(Product,condition,updateBody);
    return {success:true,message:"Product searched successfully!!",data:updatedSearchedProductCount}   
}


export const mostSearchedProducts = async (limit) => {

    if(!limit)return {success:false,message:"limit is require", data:null}
    const filter = {
        searchCount:{$gt:0}
    }
    const sort = {
        searchCount: -1
    }
    const products = await findMany(Product,filter,sort,limit);

    if (!products || products.length === 0) {
        return [];
    }

    return {success:true, message:"Most search products got sucessfully.", data:products};
};

export const mostSearchedKeywords = async (limit) => {

  const safeLimit = Number(limit);
  if (!safeLimit) {
    return { success: false, message: "limit is required", data: null };
  }

  const keywords = await User.aggregate([
    { $unwind: "$searchedKeywords" },
    {
      $group: {
        _id: "$searchedKeywords.keyword",
        count: { $sum: "$searchedKeywords.count" }
      }
    },
    { $sort: { count: -1 } },
    { $limit: safeLimit }
  ]);

  if (!keywords || keywords.length === 0) {
    return {
      success: true,
      message: "No searched keywords found",
      data: []
    };
  }

  return {
    success: true,
    message: "Most searched keywords got successfully.",
    data: keywords
  };
};

export const userMostSearchProductService = async(limit) => {

  const safelimit = Number(limit);

  if (!safelimit) {
    throw new ApiError(404, "limit is required")
  }

  const searchProducts = await User.aggregate([
  { $unwind: "$searchedProducts" },

  // product join (name ke liye)
  {
    $lookup: {
      from: "products",
      localField: "searchedProducts.product",
      foreignField: "_id",
      as: "productDetails"
    }
  },
  { $unwind: "$productDetails" },

  // user-wise group
  {
    $group: {
      _id: "$_id",
      userName: { $first: "$username" },
      products: {
        $push: {
          productId: "$productDetails._id",
          productName: "$productDetails.productName",
          count: "$searchedProducts.count"
        }
      }
    }
  },

   {
    $project: {
      userName: 1,
      products: {
        $sortArray: {
          input: "$products",
          sortBy: { count: -1 }
        }
      }
    }
  },

  { $limit: safelimit }
]);



    if (!searchProducts || searchProducts.length === 0) {
      return []
    }

    return {
    success: true,
    message: "Most searched products got successfully.",
    data: searchProducts
    };
}

export const userMostSearchKeywordService = async(limit) => {

  const safelimit = Number(limit);

  if (!safelimit) {
    throw new ApiError(404, "limit is required")
  }

  const keyword = await User.aggregate([
  { $unwind: "$searchedKeywords" },
  { $sort: { "searchedKeywords.count": -1 } },
  {
    $group: {
      _id: "$_id",
      userName: { $first: "$username" },
      keywords: {
        $push: {
          keyword: "$searchedKeywords.keyword",
          count: "$searchedKeywords.count"
        }
      }
    }
  },
  { $limit : safelimit}
]);

  if (!keyword || keyword.length === 0) {
    return []
  }

  return {
    success: true,
    message: "Most searched keyword got successfully.",
    data: keyword
    };

}