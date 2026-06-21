import { asyncHandler } from "../utils/Asynchandler.js";

const registerUser = asyncHandler( async (requestAnimationFrame,res)=>{
   res.status(200).json({message:"ok"

  })
})

export {registerUser}