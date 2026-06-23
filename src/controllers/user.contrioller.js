import { ApiError } from "../utils/Apierrors.js";
import { asyncHandler } from "../utils/Asynchandler.js";
import { User } from "../models/user.model.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshTokens = async(userId)=>{
  
  try{
    const user = await User.findById(userId)
    const accessToken = await user.generateAccesstokens()
    const refreshToken = await user.generateRefreshtokens()
    // console.log(accessToken)
    // console.log("Token",refreshToken)
    user.refreshToken = refreshToken
// console.log(user);
// console.log(user.schema.paths);
// console.log(user.toObject());    
  await user.save({validateBeforeSave: false})

    return {accessToken,refreshToken}
  }
  catch(error){
    // 
    console.log(error)
    throw error
  }
}
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
//  });

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

const loginUser = asyncHandler(async (req,res)=>{
  const {email,username,password} = req.body

  if(!(username || email)){
    throw new ApiError(400,"username or email is required ")
  }

  const user = await User.findOne({
    $or : [{username},{email}]
  })
  if(!user){
    throw new ApiError(404,"User not found")
  }
  const isPasswordValid = await user.CheckPassword(password)
  if(!isPasswordValid){
    throw new ApiError(401,"Inavalid User Credentials")
  }
  const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id)
  

  const loggedInUser =await User.findById(user._id).select("-password -refreshToken")

  const options = {
    httpOnly : true,
    secure:true
  }

  return res.
  status(200)
  .cookie("accesstoken",accessToken)
  .cookie("refreshToken",refreshToken)
  .json(
    new ApiResponse(
      200,{
        user:loggedInUser,accessToken,refreshToken},
        "User logged In Successfuuly"
      
    )
  )
})

const logoutUser = asyncHandler( async(req,res)=>{
    User.findByIdAndUpdate(
      req.user._id,
       { $set :{
          refreshToken:undefined
        }},{
          new:true
        }
      
      
    )
    const options = {
    httpOnly : true,
    secure:true
  }
  return res 
  .status(200)
  .clearCookie("accessToken",options)
  .clearCookie("refreshToken",options)
  .json(
    new ApiResponse(200,"User Logged out Successfully")
  )
})

const refreshAccessToken = asyncHandler(async (req,res)=>{
  const incomingRefreshToken = req.cookies.refreshToken||
  req.body.refreshToken

  if(!incomingRefreshToken){
    throw new ApiError(401,"Unauthorized request")
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,process.env.REFRESH_TOKEN_SECRET
    )
  
    const user = User.findById(decodedToken?._id)
    if(!user){
      throw new ApiError(401,"Invalid refresh token")
    }
  
    if(incomingRefreshToken!== user?.refreshToken){
      throw new ApiError(401,"Refresh token is expired or new")
    }
  
    const options ={
      httpOnly :true,
      secure :true
    }
  
    const {accessToken ,newrefreshToken} = await generateAccessAndRefreshTokens(user._id)
  
    return res.status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("Refreshtoken",newrefreshToken,options)
    .json(
      new ApiResponse(
        200,
        {accessToken,refreshToken:newrefreshToken},
          "Access token refreshed"
      )
    )
  
  } catch (error) {
    throw new ApiError(401,error?.message)
    
  }

})



export { registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken
 }