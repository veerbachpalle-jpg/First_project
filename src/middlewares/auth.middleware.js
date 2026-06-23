import { asyncHandler } from "../utils/Asynchandler.js";
import { ApiError} from "../utils/Apierrors.js"
import jwt from"jsonwebtoken"
import { User } from "../models/user.model.js";

export const verifyJWT = asyncHandler(async(req,res,next)=>{
  // req.cookies?.accessToken || 
  // req.header("Authorization)?.replace("Bearer ","");
  try {
    const token = req.cookies?.accesstoken ||
    req.header("Authorization")?.replace("Bearer ", "")?.trim()
  
    if(!token){
      throw new ApiError(401,"Unauthorized request")
    }
    const decodedtoken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
    console.log("decodedtoken",decodedtoken)
    const user = await User.findById(decodedtoken?._id).select("-password -refreshToken")
    console.log(user)
  
    if(!user){
  
      throw new ApiError(401,"Invalid Access Token")
    }
    req.user = user;
    next()
  } catch (error) {
    throw new ApiError(401,error?.message ||"invalid Access token")
    
  }


})