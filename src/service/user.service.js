import {create,findSingleData} from '../dal/dal.js';
import {User} from '../models/user.model.js'

export const createUser = async(payload) => {
    const createUser = await create(User,payload);
    if(!createUser) return {success:false,message: 'User not created',data:null}
    return {success:true, message:'User created successfully',data:createUser};
}

export const findUser = async(condition) => {
    const getExistingUser = await findSingleData(User,condition);
    if(getExistingUser) return {success:true,message:"User already exists",data:null};
    return {success:false,message:'No user exist with this detail',data:getExistingUser}
}