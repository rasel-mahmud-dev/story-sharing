import formidable from 'formidable';
import {cp, readFile} from "fs/promises";
import replaceOriginalFilename from "../utilities/replaceOriginalFilename";
import {getDBFileList} from "./filesController";
import path from "path";
import response from "../response";
import {readdir, stat, rm} from "fs/promises";
import saveLog from "../logger/saveLog";
import {redisConnect} from "../database";
import Post, {PostWithAuthorType} from "../models/Post";
import {ObjectId} from "mongodb";




export const getHomePage  = (req, res)=>{
  res.status(200).json({message: "ok"})
}

export const adminLogin  = async (req, res)=>{
  if(req.body.secret){
    if (req.body.secret.trim() === process.env.ADMIN_SECRET){
      let files =  await getDBFileList()
      if(files) {
        res.render("pages/admin-homepage", {
          message: "Welcome Mr. Rasel Mahmud",
          markdown: files
        })
      }
    } else {
      res.render("pages/index", {message: "You are not Admin"})
    }
    
    
  } else {
    res.render("pages/index", {message: "You are not Admin"})
  }
}

export const uploadDatabaseFile  = async (req, res)=>{
  const form = formidable({multiples: true})
  form.parse(req, async (err, fields, files)=> {
  

    if (err) {
      let files : any =  await getDBFileList()
      if(files) {
        res.render("pages/admin-homepage", {
          message: "Welcome Mr. Rasel Mahmud",
          markdown: files
        })
      }
    }
    
    try {
      if(fields.dirType === "markdown"){
       
        let {newPath, name} = await replaceOriginalFilename(files, "markdown")
      
        let dir = path.resolve("src/markdown")
        let uploadedPath = path.join(dir + "/" + name)
        await cp(newPath, uploadedPath,{force: true})
        let dataFiles =  await getDBFileList()
        if(dataFiles) {
          res.render("pages/admin-homepage", {
            message: "Welcome Mr. Rasel Mahmud",
            markdown: dataFiles
          })
        }
        // response(res, 201, {
        //   message: "Markdown File upload Success",
        //   uploadedPath: uploadedPath
        // })
        
      }
      
    } catch (ex){
      
      console.log(ex)
      
      let files =  await getDBFileList()
      if(files) {
        res.render("pages/admin-homepage", {
          message: "Welcome Mr. Rasel Mahmud",
          markdown: files
        })
      }
      // response(res, 500, {
      //   message: "File upload fail" + ex.message
      // })
    }
    
    
  })
  // res.render("pages/admin-homepage", {message: "You are not Admin", database: [], markdown: []})
}

interface LogType{
  name: string,
  path: string,
  size: number
}

export const getServerLogs  = async (req, res)=>{

  try {
    let p = path.join(__dirname, "..", "logs")
    let logs = await readdir(p)
    let llogs: LogType[] = []
    
    if(logs && logs.length > 0){
      logs.forEach((l, i)=>{
        (async function (){
  
          try {
            let s = await stat(p + "/" + l)
            llogs.push({name: l, path: p + "/" + l, size: s.size})
            if((i+1) === logs.length){
              response(res, 200, llogs)
            }
          } catch (ex){
          
          }
        }())
      })
    }

  } catch (ex){
    saveLog(ex.message ? ex.message : "Server error")
    response(res, 404, {logs: []})
  }
}

export const getServerLog  = async (req, res)=>{

  try {
    let p = path.join(__dirname, "..", "logs/" + req.body.fileName)
    let text = await readFile(p)
    res.send(text)
    // const stream = fs.createReadStream(p)
    // res.writeHead(200, { 'Content-Type': 'text/plain' });
    //
    // console.log(p)
    //
    // stream.on("data", (data)=>{
    //   res.write(data)
    // })
    //
    // stream.on("end", ()=>{
    //   res.end()
    // })
    //
    // stream.on("error", (e)=>{
    //   saveLog("Log can't read stream error " + e.message ? e.message: "")
    // })

  } catch (ex){
    saveLog(ex.message ? ex.message : "Server error", req.url, req.method)
    response(res, 404, "Server Error")
  }
}



export const deleteServerLog  = async (req, res)=>{

  try {
    let p = path.join(__dirname, "..", "logs/" + req.body.fileName)
    await rm(p)
    
    response(res, 201, "deleted")
    
    // const stream = fs.createReadStream(p)
    // res.writeHead(200, { 'Content-Type': 'text/plain' });
    //
    // console.log(p)
    //
    // stream.on("data", (data)=>{
    //   res.write(data)
    // })
    //
    // stream.on("end", ()=>{
    //   res.end()
    // })
    //
    // stream.on("error", (e)=>{
    //   saveLog("Log can't read stream error " + e.message ? e.message: "")
    // })

  } catch (ex){
    saveLog(ex.message ? ex.message : "Server error", req.url, req.method)
    response(res, 500, "Server Error")
  }
}


export const getPortfolioPosts = async (req, res)=>{
  let client;
  try {
    client = await redisConnect()
    let p = await client.hGetAll("all_admin_posts")
    let allAdminPosts = []
    if(p){
      for (let pKey in p) {
        try {
          allAdminPosts.push(JSON.parse(p[pKey]))
        } catch (ex){
        
        }
      }
    }
    response(res, 200, allAdminPosts)
    
  } catch (ex){
    console.log(ex)
  } finally {
    await client?.quit()
  }
}


export const getPortfolioTopPosts = async (req, res)=>{
  let client;
  try {
    client = await redisConnect()
    let p = await client.hGetAll("top_admin_posts")
    let allAdminPosts = []
    if(p){
      for (let pKey in p) {
        try {
          allAdminPosts.push(JSON.parse(p[pKey]))
        } catch (ex){
        
        }
      }
    }
    response(res, 200, allAdminPosts)
    
  } catch (ex){
    console.log(ex)
  } finally {
    await client?.quit()
  }
}


export const addPortfolioTopPosts = async (req, res)=>{
  
  const {post_id} = req.body

  try {


    let p: any = await Post.aggregate([
      { $match:   { author_id: new ObjectId(req.user_id), _id: new ObjectId(post_id)  }},
      { $lookup: {
          from: "users",
          localField: "author_id",
          foreignField: "_id",
          as: "author"
        }},
      { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
      { $project: { author: { password: 0, created_at: 0, updated_at: 0, description: 0} } }
    ])
  
    if(p && p?.length > 0 && p[0]){
      let client;
      try {
        client = await redisConnect()
        let doc = await client.hSet("top_admin_posts", post_id, JSON.stringify(p[0]))
        response(res, 201, {})
      } catch (ex){
        saveLog(ex.message + " add-portfolio-top-post, Post not found post id " + post_id, req.url, req.method)
        response(res, 500, {})
        return
      } finally {
        await client?.quit()
      }
    } else {
      saveLog("add-portfolio-top-post, Post not found post id " + post_id)
      response(res, 500, {})
      return
    }
    
    
    // let p = await client.hSet("top_admin_posts", JSON.stringify())
    // response(res, 200, {})
    
  } catch (ex){
    saveLog(ex.message + " add-portfolio-top-post, Post not found post id " + post_id, req.url, req.method)
    response(res, 500, {})
  } finally {
  
  }
}

export const removePortfolioTopPosts = async (req, res)=>{
  let client;
  let {post_id}  = req.body
  try {
    client = await redisConnect()
    let p = await client.hDel("top_admin_posts", post_id)
    if(p) {
      response(res, 201)
    }
  } catch (ex){
    console.log(ex)
  } finally {
    await client?.quit()
  }
}


export const addPortfolioAllPosts = async (req, res)=>{
  const {post_id} = req.body
  try {
    let p: any = await Post.aggregate([
      { $match:   { author_id: new ObjectId(req.user_id), _id: new ObjectId(post_id)  }},
      { $lookup: {
          from: "users",
          localField: "author_id",
          foreignField: "_id",
          as: "author"
        }},
      { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
      { $project: { author: { password: 0, created_at: 0, updated_at: 0, description: 0} } }
    ])
    
    if(p && p?.length > 0 && p[0]){
      let client;
      try {
        client = await redisConnect()
        let doc = await client.hSet("all_admin_posts", post_id, JSON.stringify(p[0]))
        console.log(doc)
        response(res, 201, {})
      } catch (ex){
        saveLog(ex.message + " add-portfolio-all-post, Post not found post id " + post_id, req.url, req.method)
        response(res, 500, {})
        return
      } finally {
        await client?.quit()
      }
    } else {
      saveLog("add-portfolio-all-post, Post not found post id " + post_id,  req.url, req.method)
      response(res, 500, {})
      return
    }
    
    
    // let p = await client.hSet("top_admin_posts", JSON.stringify())
    // response(res, 200, {})
    
  } catch (ex){
    saveLog(ex.message + " add-portfolio-all-post, Post not found post id " + post_id,  req.url, req.method)
    response(res, 500, {})
  } finally {
  
  }
}
export const removePortfolioAllPosts = async (req, res)=>{
  let client;
  let {post_id}  = req.body
  try {
    client = await redisConnect()
    let p = await client.hDel("all_admin_posts", post_id)
    if(p) {
      response(res, 201)
    }
  } catch (ex){
    saveLog(ex.message, req.url, req.method)
    console.log(ex)
  } finally {
    await client?.quit()
  }
}