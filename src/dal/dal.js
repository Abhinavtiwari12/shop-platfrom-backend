export const create = async(model,data) => {
    return await model.create(data)
}

export const findSingleData = async(model,cond) => {
    return await model.findOne(cond)
}