import response from "../response";
import errorConsole from "../logger/errorConsole";


import Like from "../models/Like";
import {ObjectId} from "mongodb";

export const addLike = async (req, res, next)=>{
  
  const { user_id, post_id } = req.body
  
  if(req.user_id !== user_id){
    return response(res, 404, {message: "Unauthorized"})
  }
  
  let client;
  try {
    let b: ObjectId =  new ObjectId(user_id)
    const like: any = await Like.findOne({post_id: new ObjectId(post_id)})
    if(like){
      let isUpdated = await Like.update({_id: new ObjectId(like._id)}, {
        $addToSet: {
          // @ts-ignore
          likes: b
        }
      })
      if(isUpdated){
        return response(res, 201, {like: {
            ...like,
            _id: like._id,
            post_id,
            user_id: user_id
        }})
      }
      return
    }
  
    // post a new like
    
    let newLike: any = new Like({
      post_id: new ObjectId(post_id),
      likes: [ new ObjectId(user_id) ]
    })

    newLike = await newLike.save()
    return response(res, 201, {like: {
      _id: newLike._id,
      post_id,
      user_id: user_id
    }})
    
    // let { post_id, text, user_id, username, avatar } = req.body
    // client = await redisConnect()
    //
    // if(post_id && text && user_id && username) {
    //
    //   // let comment = db.get('comments').find({ post_id: post_id, user_id: req.user_id }).value()
    //   let newComment = {
    //     id: shortid.generate(),
    //     post_id,
    //     text,
    //     user_id,
    //     username,
    //     avatar,
    //     created_at: new Date(),
    //     reply: null
    //   }
    //
    //
    //   let isCommentAdded = await client.HSET('comments', newComment.id, JSON.stringify(newComment))
    //   if(isCommentAdded){
    //     response(res, 201, {newComment})
    //   } else {
    //     return response(res, 404, {message: "Incomplete Comment Data"})
    //   }
    //
    // } else {
    //   return response(res, 404, {message: "Incomplete Comment Data"})
    // }
    
    
  } catch (ex){
    errorConsole(ex)
    response(res, 500, "Internal server error")
  } finally {
    client?.quit()
  }
}


export const removeLike = async (req, res, next)=>{
  
  let { like_id, post_id, user_id } = req.body

  if(req.user_id !== user_id){
    return response(res, 404, {message: "Unauthorized"})
  }
  
  let client;
  try {

    // const like: any = await Like.findOne({
    //   post_id: new ObjectId(post_id),
    //   _id: new ObjectId(like_id),
    // })
    //
    // console.log(like)
  
    let deleted = await Like.update({post_id: new ObjectId(post_id)}, {
      $pull: {
        // @ts-ignore
        likes: new ObjectId(user_id)
      }
    })

    if(deleted){
      return response(res, 201, {message: "like removed"})
    }
  
  } catch (ex){
    
    errorConsole(ex)
    response(res, 500, "Internal server error")
    
  } finally {
    client?.quit()
  }
}
