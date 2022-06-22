import response from "../response";
import errorConsole from "../logger/errorConsole";

import {ObjectId} from "mongodb";
import mongoose from "mongoose";

const Like = mongoose.model("Like")


export const getLikes = async (req, res, next)=>{
  const { post_id } = req.body
  try {
    const likes: any = await Like.find({postId: new ObjectId(post_id)})
    res.send(likes)
    
  } catch (ex){
    errorConsole(ex)
    response(res, 500, "Internal server error")
  } finally {
  
  }
}

export const addLike = async (req, res, next)=>{
  
  const { user_id, post_id } = req.body
  
  if(req.user_id !== user_id){
    return response(res, 404, {message: "Unauthorized"})
  }
  
  let client;
  try {
    // let b: ObjectId =  new ObjectId(user_id)
    // const like: any = await Like.findOne({post_id: new ObjectId(post_id)})
    
    // if(like){
    //   let isUpdated = await Like.updateOne({_id: new ObjectId(like._id)}, {
    //     $addToSet: {
    //       // @ts-ignore
    //       likes: b
    //     }
    //   })
    //   if(isUpdated){
    //     return response(res, 201, {like: {
    //         ...like,
    //         _id: like._id,
    //         post_id,
    //         user_id: user_id
    //     }})
    //   }
    //   return
    // }
  
    // post a new like
    let newLike: any = new Like({
      postId: new ObjectId(post_id),
      userId: new ObjectId(user_id)
    })
    newLike = await newLike.save()
    return response(res, 201, newLike)
    
  } catch (ex){
    errorConsole(ex)
    response(res, 500, "Internal server error")
  } finally {
  }
}


export const removeLike = async (req, res, next)=>{
  
  let { like_id,  user_id } = req.body

  if(req.user_id !== user_id){
    return response(res, 404, {message: "Unauthorized"})
  }
  
  try {
    let deleted = await Like.remove({  _id: new ObjectId(like_id), userId: new ObjectId(user_id)})
    if(deleted){
      return response(res, 201, {message: "like removed"})
    }
  
  } catch (ex){
    errorConsole(ex)
    response(res, 500, "Internal server error")
  } finally {
  
  }
}
