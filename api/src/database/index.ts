import errorConsole from "../logger/errorConsole";

const { createClient } = require('redis');
import {MongoClient, Db, Collection, ServerApiVersion, ObjectId} from 'mongodb';
import Post from "../models/Post";
import saveLog from "../logger/saveLog";


export function redisConnect(isCloud = false){
  return new Promise( async (resolve, reject)=>{

    let client;

    if(process.env.NODE_ENV === "development"){
      if(isCloud) {
        client = await createClient( {
          url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_ENDPOINT}:${process.env.REDIS_PORT}`
          // url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_ENDPOINT}:${process.env.REDIS_PORT}`
        });
      } else {
        client = await createClient();
      }
    } else {
      client = await createClient( {
        url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_ENDPOINT}:${process.env.REDIS_PORT}`
        // url: `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_ENDPOINT}:${process.env.REDIS_PORT}`
      });
    }

    await client.on('error', (err) =>{
      reject(new Error("Redis Client Connection error"))
    });
    
    await client.connect();
    console.log("redis connected...")
    resolve(client)
  })
}

export function dbSync(connection: {
  from: string,
  dbName: string,
  to: string,
  clearRedisKey: string[],
  collections: string[]
}){

  return new Promise(async (resolve, reject)=>{
    const clientFrom = new MongoClient(connection.from, {
      // @ts-ignore
      useNewUrlParser: true, useUnifiedTopology: true,
      // serverApi: ServerApiVersion.v1
    });
  
    await clientFrom.connect();
  
    let fetchData = {}
    
    connection.collections.forEach( (colName, index)=>{
      (async function (){
        try{
          let fromDB = await clientFrom.db(connection.dbName)
          let fromCOl = await fromDB.collection(colName)
          let data: any = await findAll(fromCOl)
          fetchData[colName] = data.map(d=>{
            let { ...other } = d
            return other
          })
          
        
            const clientTo = new MongoClient(connection.to, {
              // @ts-ignore
              useNewUrlParser: true, useUnifiedTopology: true,
              // serverApi: ServerApiVersion.v1
            });
            
            await clientTo.connect();
            
            let toDB = await clientTo.db(connection.dbName)
            let toCOl = await toDB.collection(colName)
            await toCOl.deleteMany({})
            let r = await toCOl.insertMany(fetchData[colName])
            console.log(r)
  
          if( (index+ 1) === connection.collections.length ) {
            try {
              const redisClient = await redisConnect()
              const redisClientCloud = await redisConnect(true)
  
              connection.clearRedisKey.forEach((redisKey, o) => {
                (async function () {
                  // @ts-ignore
                  let result = await redisClient.del(redisKey)
                  // @ts-ignore
                  result = await redisClientCloud.del(redisKey)
                  console.log(result)
      
                  if ((o + 1) === connection.clearRedisKey.length) {
                    
                    // @ts-ignore
                    await redisClient.quit()
                    // @ts-ignore
                    await redisClientCloud.quit()
                  }
                }())
              })
            } catch (ex){
              console.log(ex.message)
            }
           
          }
  
        } catch(ex){
          console.log(ex)
        }
      }())
    })
  })
  
}

function findAll(collection){
  return new Promise(async (resolve, reject)=>{
    try{
      let cursor = await collection.find()
      let data = []
      await cursor.forEach(c=>{
        data.push(c)
      })
      resolve(data)
    } catch (ex){
    
    } finally {
    
    }
  })
}


// local to cloud
// dbSync({
//   to: `mongodb+srv://rasel:${process.env.MONGODB_PASS}@cluster0.4ywhd.mongodb.net/dev-story?retryWrites=true&w=majority`,
//   from: "mongodb://127.0.0.1:27017",
//   dbName: "dev-story",
//   collections: ["posts", "users", "hits"],
//   clearRedisKey: ["posts", "admin_posts", "users_posts"],
// }).then(r=>{
//   console.log(r)
// })


////// cloud to local
// dbSync({
//  from: `mongodb+srv://rasel:${process.env.MONGODB_PASS}@cluster0.4ywhd.mongodb.net/dev-story?retryWrites=true&w=majority`,
//   to: "mongodb://127.0.0.1:27017",
//   dbName: "dev-story",
//   collections: ["posts", "users", "hits"]
// }).then(r=>{
//   console.log(r)
// })


async function mongoDBToRedis(options){
  let keys = ["posts"]
  let redisClient;
  let client;
  try {
    let redisClient = await redisConnect()
    // let {c: PostCollection, client} = await mongoConnect("posts")
    let p: any = await Post.aggregate([
    
      {  $lookup: {
        from: "users",
        localField: "author_id",
        foreignField: "_id",
        as: "author"
      }},
      
      { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
      { $match: {
          $and: [
            {'author.role': {$eq: 'admin'}}
          ]
        }
      },
      { $project: { author: { password: 0, created_at: 0, updated_at: 0, description: 0} } }
    ])
  
    
    keys.forEach((key)=>{
  
      (async function (){
        // @ts-ignore
        let doc = await redisClient.del("posts")
           p.forEach((post)=>{
             (async function (){
               // @ts-ignore
               let doc = await redisClient.hSet(key, post._id.toString(), JSON.stringify(post))
               console.log(key + "inserted " + doc)
             }())
          })
      }())
    })
    
  } catch (ex){
  
  } finally {
    redisClient?.quit()
  }
}



// mongoDBToRedis()


export function mongoConnect(collectionName?: string){
  
  const uri = process.env.NODE_ENV === "development"
    ? "mongodb://127.0.0.1:27017"
    : `mongodb+srv://rasel:${process.env.MONGODB_PASS}@cluster0.4ywhd.mongodb.net/dev-story?retryWrites=true&w=majority`;
  
  // const uri = "mongodb://192.168.43.170:27017";
  // mongod --bind_ip 0.0.0.0
 
  const client = new MongoClient(uri, {
    // maxPoolSize: 1,
    // @ts-ignore
    useNewUrlParser: true, useUnifiedTopology: true,
    // serverApi: ServerApiVersion.v1
  });
  
  return new Promise<{c?: Collection, client: MongoClient, db: Db}>(async (resolve, reject)=>{
      try {
        // Connect the client to the server
        await client.connect();
        
        // let db = await client.db("bddeckddbzs7dio")
        let db = await client.db("dev-story")
        // perform actions on the collection object
        console.log("Connected successfully to server");
        
        if(collectionName){
            let c = await db.collection(collectionName)
            resolve({c: c, client, db: db})
          } else {
            resolve({db: db, client})
          }
      } catch (ex){
        errorConsole(ex)
        reject(ex)
      } finally {
        // await client.close();
      }
    
    // if(collectionName){
    //   let c = await db.collection(collectionName)
    //   resolve({c: c, client})
    // } else {
    //   resolve({db: db, client})
    // }
    
      // client.close();
  })
}
