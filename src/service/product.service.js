import mongoose from 'mongoose';
import {findSingleDataAggregate, updateSingleData} from '../dal/dal.js'
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