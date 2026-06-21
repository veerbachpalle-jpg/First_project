import { ApiError } from "../utils/Apierrors.js";
import { asyncHandler } from "../utils/Asynchandler.js";
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req ,res) => {
  const {fullname, email, username, password } = req.body;
  console.log("email ", email)
  if (
    [fullname, email, username, password].some((field) =>
      field.trim == "")) {
    throw ApiError(400, "ALL FIELDS ARE COMPULSORY")
  }

  const existedError = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (existedError) {
    throw new ApiError(409, "user with same username or email exists")
  }

  const avatarLocalpath = req.files?.avatar[0]?.path;
  const coverlocalpath = req.files?.coverimage[0]?.path;

  if (!avatarLocalpath) {
    throw ApiError(400, "Avatar is compulsory")
  }

  const avatar = await uploadOnCloudinary(avatarLocalpath)
  const coverimage = await uploadOnCloudinary(coverlocalpath)

  if (!avatar) {
    throw ApiError(400, "Avatar is compulsory")
  }

  User.create({
    fullname,
    avatar: avatar.url,
    coverimage: coverimage?.url || "",
    email,
    password,
    username: username.toLowercase()

  })
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  )

  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user")
  }

  return res.status(200).json(
    new ApiResponse(200, createdUser, "User registered sucessfully")
  )
})
export { registerUser }