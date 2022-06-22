import mongoose from "mongoose";


type CommentType = {
  _id?: string
  postId: string
  userId: string
  text: string
  createdAt?: Date
  parentId: string | null
  reply: null,
  likes: string[]
}

const schemaObj: {[property in keyof CommentType]: any} = {
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  postId: { index: true, type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  text: String,
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Comment" },
  reply: [],
  likes: [String]
}

mongoose.model("Comment", new mongoose.Schema(schemaObj, {timestamps: true}))