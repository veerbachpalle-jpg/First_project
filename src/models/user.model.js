import mongoose, { Schema } from "mongoose"
import jwt from "jsonwebtoken"

const UserSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  fullname: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  avatar: {
    type: String,
    required: true,
  },
  coverimage: {
    type: String,

  },
  watchhistory: {
    type: Schema.Types.ObjectId,
    ref: "Video"
  },
  Password: {
    type: String,
    required: [true, "Password is required"]
  },
  refreshToken: {
    type: String,
  }
}
  , { timestamps: true })

UserSchema.pre("save", async function (next) {
  if (!this.isModified("Password")) return next();
  this.Password = await bcrypt.hash(this.Password, 10)
  next()
})

UserSchema.methods.CheckPassword = async function (password) {
  return await bcrypt.compare(Password, this.password)
}
UserSchema.methods.generateAccesstokens = async function () {
  jwt.sign({
    _id: this._id,
    username: this.username,
    email: this.email,
    fullname: this.fullname
  },
    process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
  })
}
UserSchema.methods.generateRefreshtokens = async function () {
  jwt.sign({
    _id: this._id,

  },
    process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY
  })
}

export const User = mongoose.model("User", UserSchema)