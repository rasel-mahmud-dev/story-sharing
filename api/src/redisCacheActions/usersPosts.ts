import {redisConnect} from "../database";


export function pullUserPostsFromCache(key: string, author_id){
  return new Promise(async (resolve)=>{
    let client;
    try {
      /** Get all posts from redis-server   */
      client = await redisConnect()
      // @ts-ignore
      let posts: any = await client.hGet(key, author_id.toString())
      resolve(null)
      // if(posts && (Object.keys(posts).length === 0)){
      //   return resolve(null)
      // } else if(!posts){
      //   return resolve(null)
      // }
      //
      // let postArr = []
      // for (let postsKey in posts) {
      //   postArr.push(JSON.parse(posts[postsKey]))
      // }
      // resolve(postArr)
    } catch (ex){
      resolve(null)
    } finally {
      await client?.quit()
    }
  })
}



export function setUsersPostsIntoCache(key: string, author_id, post: object){
  return new Promise(async (resolve)=>{
    let client;
    try {
      /** Get all posts from redis-server   */
      client = await redisConnect()
      // @ts-ignore
      
      
      
      // let posts: any = await client.hGet(key, author_id.toString())
      // resolve(null)
      // if(posts && (Object.keys(posts).length === 0)){
      //   return resolve(null)
      // } else if(!posts){
      //   return resolve(null)
      // }
      //
      // let postArr = []
      // for (let postsKey in posts) {
      //   postArr.push(JSON.parse(posts[postsKey]))
      // }
      // resolve(postArr)
    } catch (ex){
      resolve(null)
    } finally {
      await client?.quit()
    }
  })
}




export function pushUserPostsIntoCache(key: string, author_id, posts: object[]){
  return new Promise(async (resolve)=>{
    let client;
    try {
      
      client = await redisConnect()
      // @ts-ignore
      await client.hDel(key, author_id)
      let doc = await client.hSet(key, author_id.toString(), JSON.stringify(posts))
      if(doc){
        resolve(true)
      }
    } catch (ex){
      resolve(null)
    } finally {
      await client?.quit()
    }
  })
}






/** delete a single hash member from redis database when admin delete his post */
// for my portfolio
export function deleteUsersPostIntoCache(key:string = "users_posts", post_id){
  return new Promise(async (resolve)=>{
    let client;
    try {
      
      client = await redisConnect()
      // @ts-ignore
      let doc = await client.hDel(key, post_id.toString())
      if(doc){
        resolve(true)
      }
    } catch (ex){
      resolve(null)
    } finally {
      await client?.quit()
    }
  })
}



