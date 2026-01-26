import { asyncHandler } from '../utils/asyncHandeler.js';
import { ApiResponse } from '../utils/apiResponse.js';
import { ApiError } from '../utils/apiError.js';
import { User } from '../models/user.model.js';
import {createUser,findUser } from '../service/user.service.js';



const registerUser = asyncHandler( async (req, res) => {

    const {fullname, username, email, password} = req.body

    if(
        [fullname, username, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All field are require.")
    }

    const checkExistingUserCond = {
        email,
        username,
    }
    const existedUser = await findUser(checkExistingUserCond)

    if (existedUser.success) {
        throw new ApiError(409, existedUser.message)
    }

    const userPayload = {
        fullname,
        email,
        password,
        username: username.toLowerCase()

    }

    // const createdUser = User.findById(user._id).select(" -password -refreshToken ")
    const createdUser = await createUser(userPayload)

    if (!createdUser.success) {
        throw new ApiError(500, createUser.message)
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser.data, createdUser.message)
    )

})

export { registerUser }