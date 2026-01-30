import mongoose from 'mongoose';
import {findSingleDataAggregate, mostSearchedproduct, updateSingleData} from '../dal/dal.js'
import {Product} from '../models/products.model.js'

export const findSingleProduct = async(query) => {
    if(!query) return {success:false,message:"Condition is required",data:null};
    const getSearchedProduct = await findSingleDataAggregate(Product,query);
    if(getSearchedProduct == []) return {success:false,message:"Unable to get the product",data:null};
    const condition = {
        _id: new mongoose.Types.ObjectId(getSearchedProduct[0]?._id)
    }
    const updateBody = {
            $inc:{
                searchCount: 1
            }
    }
    const updatedSearchedProductCount = await updateSingleData(Product,condition,updateBody);
    return {success:true,message:"Product searched successfully!!",data:updatedSearchedProductCount}   
}


export const mostSearchedProducts = async (limit) => {

    if(!limit)return {success:false,message:"limit is require", data:null}
    const products = await mostSearchedproduct(limit);

    if (!products || products.length === 0) {
        return [];
    }

    return {success:true, message:"Most search products got sucessfully.", data:products};
};