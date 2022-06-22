import mongoose from "mongoose";


type LikeType = {
  _id?: string
  postId: string
  userId: string
}

const schemaObj: {[property in keyof LikeType]: any} = {
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  postId: { index: true, type: mongoose.Schema.Types.ObjectId, ref: "Post" },
}

mongoose.model("Like", new mongoose.Schema(schemaObj, {timestamps: true}))
