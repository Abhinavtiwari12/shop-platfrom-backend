import { model } from "mongoose"

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

export const updateSingleData = async(model,condition,body) => {
    return await model.findOneAndUpdate(condition,body,{new:true});
}
