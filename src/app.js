import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import fs from "fs"


fs.mkdirSync("./public/temp", { recursive: true })

const app = express()

app.use(cors({
  origin: process.env.CORS_ORIGIN === "*" ? true : process.env.CORS_ORIGIN,
  credentials: true
}))

app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.static("public"))
app.use(cookieParser())

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});


import userrouter from "./routes/user.routes.js"

app.use("/users",userrouter)

import { errorHandler } from "./middlewares/error.middleware.js"
app.use(errorHandler)

export default  app