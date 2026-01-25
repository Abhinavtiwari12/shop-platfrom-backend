import { asyncHandler } from '../utils/asyncHandeler';
import { ApiResponse } from '../utils/apiResponse';
import { ApiError } from '../utils/apiError';
import { User } from '../models/user.model';



const registerUser = asyncHandler( async (req, res) => {

    const {fullname, username, email, password} = req.body

    if(
        [fullname, username, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "All field are require.")
    }

    const existedUser = await User.findOne( {
        $or: [{username},{email}]
    } )

    if (!existedUser) {
        throw new ApiError(409, "username or email already exixted try another")
    }

    const user = await User.create({
        fullname,
        email,
        password,
        username: username.toLowerCase()

    })

    const createdUser = User.findById(user._id).select(" -password -refreshToken ")

    if (!createdUser) {
        throw new ApiError(500, "somthing went wrong ")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered successfully.")
    )

})

