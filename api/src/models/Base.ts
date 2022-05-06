import errorConsole from "../logger/errorConsole";
import {mongoConnect} from "../database";
import {AggregateOptions, Document, Filter, FindOptions, UpdateFilter} from "mongodb";


class Base {
  static tableName: string;
  tableName: string;
  databaseSaveFields: any
  _id?: string
  
  validationBeforeSave: () => any
  
  constructor(tableName: string) {
    // when call with new keyword extend classes...
    this.tableName = tableName
  }
  
  save(noValidate?: boolean){
    return new Promise(async (resolve, reject)=>{
      let client;
  
      try{
        let { tableName, databaseSaveFields, _id, ...other} = this
        let { c: Collection,  client: cc} = await mongoConnect(tableName)
        client = cc
  
        // let err = await this.validationBeforeSave()
        // if (err) {
        //   return reject({type: "VALIDATION_ERROR", errors: err})
        // }
        
        if(noValidate){
          let newInserted = await Collection.insertOne(other)
          // @ts-ignore
          other._id = newInserted.insertedId
          resolve(other)
        } else {
          if (this.validationBeforeSave) {
            let err = await this.validationBeforeSave()
    
            if (err) {
              return reject({type: "VALIDATION_ERROR", errors: err})
            }
    
            let newInserted = await Collection.insertOne(other)
            // @ts-ignore
            other._id = newInserted.insertedId
            resolve(other)
    
          } else {
            let newInserted = await Collection.insertOne(other)
            // @ts-ignore
            other._id = newInserted.insertedId
            resolve(other)
          }
        }
      } catch (ex) {
        errorConsole(ex)
        reject(ex)
      
      } finally {
        client?.close()
      }
    })
  }
  
  
  static getCollection(){
    return new Promise(async (resolve, reject)=>{
      try{
        let tableName = this.tableName
        let {c, client } = await mongoConnect(tableName)
        resolve({Collection: c, client})
        
      } catch (ex){
        reject(ex)
        errorConsole(ex)
      }
    })
  }
  
  // static getCollection(collectionName){
  //   return new Promise(async (resolve, reject)=>{
  //   try {
  //
  //     // let {c, client} = await dbConnect(collectionName ? collectionName : Base.collectionName)
  //     // resolve({collection: c, client: client})
  //
  //     } catch (ex){
  //       reject({collection: undefined, client: undefined})
  //     }
  //   })
  // }
  
  // static async dbConnect(collectionName){
//   return new Promise(async (resolve, reject)=>{
//     try {
//       let { c, client} = await dbConnect(collectionName)
//       resolve({collection: c, client: client})
//     } catch (ex){
//       reject(ex)
//     }
//   })
// }

//   static insertInto(values){
//   return new Promise<mongoDB.InsertOneResult>(async (resolve, reject)=>{
//     let client;
//     try {
//
//       let {collection, client: cc} = await this.dbConnect(this.collectionName)
//       client = cc
//       if(values) {
//         let {_id, ...other} = values
//         let cursor = await collection?.insertOne({
//           ...other,
//           created_at: new Date(),
//           updated_at: new Date()
//         })
//
//         resolve(cursor)
//       }
//       // console.log(cursor, other)
//       client?.close()
//
//     } catch (ex){
//       client?.close()
//       reject(new Error(ex.message))
//     } finally {
//       client?.close()
//     }
//   })
// }
  
  static update(filter: Filter<Document>, update: UpdateFilter<Document>){
    return new Promise(async (resolve, reject)=> {
      let client;
      try {
        let tableName = this.tableName
        let {c: collection, client: cc } = await mongoConnect(tableName)
        client = cc
        
        let cursor = await collection?.updateOne(filter, update)
        if(cursor.modifiedCount > 0){
          resolve(true)
        } else {
          resolve(false)
        }
      } catch (ex){
        resolve(false)
      } finally {
        client?.close()
      }
    })
  }

// static deleteById(id: string){
//
//   return new Promise<mongoDB.DeleteResult>(async (resolve, reject)=> {
//     if(id){
//       let client;
//       try {
//         let {collection, client: cc} = await Base.dbConnect(this.collectionName)
//         client = cc
//         let doc = await collection.deleteOne({_id: new ObjectId(id)})
//         resolve(doc)
//       } catch (ex) {
//         reject(new Error(ex.message))
//       } finally {
//         client?.close()
//       }
//     } else {
//       reject(new Error("please provide id"))
//     }
//   })
//
// }
  
  static findOne(filter: Filter<Document>, options?: FindOptions) {
    return new Promise(async (resolve, reject) => {
      let client
      try{
        let tableName = this.tableName
        let {c: collection, client: cc } = await mongoConnect(tableName)
        client = cc;
        let data = await collection.findOne(filter, options)
        if(data){
          resolve(data)
        } else {
          resolve(null)
        }
      } catch (ex){
        reject(ex)
        errorConsole(ex)
      } finally {
        client?.close()
      }
    })
  }
  
  static removeOne(filter: Filter<Document>){
    return new Promise(async (resolve, reject) => {
      let client;
      try{
        let {c: Collection, client: cc} = await mongoConnect(this.tableName)
        client = cc
        
        let doc = await Collection.deleteOne(filter)
        if(doc.deletedCount){
          resolve(true)
        }else {
          resolve(false)
        }
        
      } catch (ex){
        errorConsole(ex)
        reject(ex)
      } finally {
        client?.close()
      }
    })
  }
  
  static async find(query?:Filter<Document>, options?: FindOptions){
    return new Promise(async (resolve, reject)=>{
      let client;
      try {
        let tableName = this.tableName
        let { c: User, client: cc } = await mongoConnect(tableName)
        client = cc;
        let cursor = User.find(query ? query : {}, options ? options : {})
        
        let users = []
        await cursor.forEach(usr=>{
          users.push(usr)
        })
        resolve(users)
        resolve(users)
      } catch (ex){
        errorConsole(ex)
        reject(ex)
      }
      finally{
        client?.close()
      }
    })
  }
  
  static aggregate(pipeline: Document[], options?: AggregateOptions){
    return new Promise(async (resolve, reject)=>{
      let client;
      try {
        let { c: collection, client: cc } = await mongoConnect(this.tableName)
        client = cc
        let cursor = collection?.aggregate(pipeline, options)
        
        let products = []
        await cursor.forEach(p=>{
          products.push(p)
        })
        resolve(products)
        client?.close()
        
      } catch (ex){
        reject(new Error(ex))
      }
      finally {
        client?.close()
      }
    })
  }
  
}

export default  Base