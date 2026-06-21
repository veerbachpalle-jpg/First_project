import { ApiError } from "../utils/Apierrors.js";
import { asyncHandler } from "../utils/Asynchandler.js";
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req ,res) => {
  const {fullname, email, username, password } = req.body;
  // console.log("email ", email)
  if (
    [fullname, email, username, password].some((field) =>
      field?.trim() == "")) {
    throw new ApiError(400, "ALL FIELDS ARE COMPULSORY")
  }

  const existedError = await User.findOne({
    $or: [{ username }, { email }]
  })

  if (existedError) {
    throw new ApiError(409, "user with same username or email exists")
  }
  // console.log("BODY:", req.body);
// console.log("FILES:", req.files);

  const avatarLocalpath = req.files?.avatar?.[0]?.path;
  const coverlocalpath = req.files?.coverimage?.[0]?.path;

  if (!avatarLocalpath) {
    throw new ApiError(400, "Avatar is compulsory")
  }
  console.log("avatarLocalpath =", avatarLocalpath);

const avatar = await uploadOnCloudinary(avatarLocalpath);

console.log("avatar =", avatar);

  // const avatar = await uploadOnCloudinary(avatarLocalpath)
  const coverimage = await uploadOnCloudinary(coverlocalpath)

  if (!avatar) {
    throw new ApiError(400, "Avatar is compulsory")
  }
//   // console.log({
//   fullname,
//   email,
//   username,
//   password,
//   avatar: avatar?.url,
//   coverimage: coverimage?.url,
// });

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverimage: coverimage?.url || "",
    email,
    password,
    username: username.toLowerCase()

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