import mongoose from "mongoose";

import { ObjectKeys} from "../types";

export interface PostType {
  _id?: string
  title: string
  author_id: string
  summary: string
  slug: string
  cover?: string
  path: string
  tags: string[]
  createdAt?: Date
  updatedAt?: Date
  content: string
}


const postSchemaObj: ObjectKeys<PostType> = {
    title: String,
    author_id: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    summary: String,
    slug: String,
    cover: String,
    path: String,
    tags: [String],
    content: String
  }
  

mongoose.model("Post", new mongoose.Schema(postSchemaObj, {timestamps: true}))
