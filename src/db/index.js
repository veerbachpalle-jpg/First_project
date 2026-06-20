import mongoose from "mongoose"
import { DB_NAME } from "../constants.js"

const connect_db = async()=>{
    try{
      const connection_instance = await mongoose.connect(`${process.env.MONGO_DB_URI}/${DB_NAME}`)
      console.log(`Mongo DB connect to host ${connection_instance}` )
    }
    catch(error){
      console.log("Error in connecting to mongo Db ",error);
      process.exit(1);
    }
}
export default connect_db