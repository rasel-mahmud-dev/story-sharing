
import mongoose from "mongoose";

export type HitsType = {
  _id?: string
  postId: string
  count: number
}

  
  const schemaObj: {[property in keyof HitsType]: any} = {
  postId: { index: true, type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  count: Number
}
  
  mongoose.model("Hits", new mongoose.Schema(schemaObj, {timestamps: true}))
