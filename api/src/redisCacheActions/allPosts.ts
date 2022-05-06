import {redisConnect} from "../database";
import errorConsole from "../logger/errorConsole";
import {PostType, PostWithAuthorType} from "../models/Post";
import saveLog from "../logger/saveLog";

export function pullPostsFromCache(key: string = "posts"){
  
  return new Promise<PostWithAuthorType[] | null>(async (resolve, reject)=>{
    let client;
    try {
      /** Get all posts from redis-server   */
      client = await redisConnect()
      
      // @ts-ignore
      let posts: PostWithAuthorType = await client.hGetAll(key)
      
      if(posts && (Object.keys(posts).length === 0)){
        return resolve(null)
      } else if(!posts){
        return resolve(null)
      }
      
      let postArr : PostWithAuthorType[] = []
      for (let postsKey in posts) {
        postArr.push(JSON.parse(posts[postsKey]))
      }
      resolve(postArr)
    } catch (ex){
      saveLog(ex.message ? ex.message : "redis connection error")
      resolve(null)
    } finally {
      await client?.quit()
    }
  })
}



export function pushPostsIntoCache(key: string = "posts", posts: {}[]){
  return new Promise(async (resolve, reject)=>{
    let client;
    try {
      /** Get all posts from redis-server   */
      client = await redisConnect()
      // @ts-ignore
      let doc = await client.del(key)
      posts.forEach((post, index)=>{
        (async function (){
          // @ts-ignore
          let doc = await client.hSet(key, post._id.toString(), JSON.stringify(post))
          console.log(key + "inserted " + doc)
          if(posts.length === (index + 1)){
            resolve(true)
          }
        }())
      })
      
    } catch (ex){
      saveLog(ex.message ? ex.message : "redis connection error")
      resolve(null)
    } finally {
      client?.quit()
    }
  })
}

