import {redisConnect} from "../database";


/** cache posts for my portfolio */
export function pushAdminPostsIntoRedisCache(key:string = "admin_posts", author_id, posts: object[] ){
  return new Promise(async (resolve)=>{
    let client;
    try {
      
      client = await redisConnect()
      // @ts-ignore
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

