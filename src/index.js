import dotenv from "dotenv"
import mongoose from "mongoose";
import express from "express"
import connect_db from "./db/index.js";

dotenv.config({
    path: './.env'
});

import app from "./app.js"
connect_db().then(
  app.listen(process.env.PORT||8000,()=>{
    console.log(`app is listening at port ${process.env.PORT}`);
  })
).catch((err)=>{
  console.log("Mongo DB connection failed!! ",err);
})










/*
const app = express()

(async()=>{
  try{
     await mongoose.connect('${process.env.MONGO_DB_URI}/{DB_NAME}')
     app.on("error",(error)=>{
      console.log("error",error);
      throw error
     })
     app.listen(process.env.PORT,()=>{
      console.log(`App is listening on port ${process.env.PORT}`);
     }
     )
  }
  catch(error)
  {
    console.log("Error: ",error)
    throw error
  }
})()
*/
