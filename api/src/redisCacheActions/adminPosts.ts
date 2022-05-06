import {redisConnect} from "../database";


/** cache posts for my portfolio */
export function pushAdminPostsIntoCache(key:string = "admin_posts", author_id, posts: object[] ){
  return new Promise(async (resolve)=>{
    let client;
    try {
      
      client = await redisConnect()
      // @ts-ignore
      let doc = await client.del(key)
      posts.forEach((post, index)=> {
        (async function () {
          // @ts-ignore
          let doc = await client.hSet(key, post._id.toString(), JSON.stringify(post))
          console.log(key + "inserted " + doc)
          if (posts.length === (index + 1)) {
            resolve(true)
          }
        }())
      })
      
    } catch (ex){
      resolve(null)
      
    } finally {
      await client?.quit()
    }
  })
}



/** cache a single post when admin create a new post */
// for my portfolio
export function setAdminPostsIntoCache(key:string = "admin_posts", author_id, post: object ){
  return new Promise(async (resolve)=>{
    let client;
    try {
      
      client = await redisConnect()
      // @ts-ignore
      let doc = await client.hSet(key, post._id.toString(), JSON.stringify(post))
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
export function deleteAdminPostIntoCache(key:string = "admin_posts", post_id){
  return new Promise<boolean>(async (resolve)=>{
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



