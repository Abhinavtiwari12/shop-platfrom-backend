import { model } from "mongoose";
import { Product } from "../models/products.model.js";

export const create = async(model,data) => {
    return await model.create(data)
}

export const findSingleData = async(model,cond) => {
    return await model.findOne(cond)
}

export const findById = async (model, id) => {
    return await model.findById(id);
}

export const findSingleDataAggregate = async(model,query) => {
    return await model.aggregate(query);
}

// export const updateSingleData = async(model,condition,body) => {
//     return await model.findOneAndUpdate(condition,body,{new:true});
// }

export const updateSingleData = async(model,condition,body) => {
    await model.updateMany(condition,body);
    const updatedData = await model.find(condition);
    return {success:true,message:"Product searched successfully!!",data:updatedData}  
}

export const findMany = async (model,condition,sort = {},limit = {}) => {
  return await model.find(condition).sort(sort).limit(limit);
};