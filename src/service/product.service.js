import mongoose from 'mongoose';
import {findDataAndAggregate, findMany, updateData} from '../dal/dal.js'
import {Product} from '../models/products.model.js'

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