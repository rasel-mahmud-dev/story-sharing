import response from "../response";
import errorConsole from "../logger/errorConsole";
import slugify from "slugify";
import {ObjectId} from "mongodb";
import path from "path";
import {writeFile, rm} from "fs/promises";
import fs from "fs";
import { marked } from 'marked';


import saveLog from "../logger/saveLog";
import uploadMarkdownFile from "../utilities/uploadMarkdownFile";
import * as mongoose from "mongoose";
import {Request, Response} from "express";
import {RequestWithAuth} from "../types";


const User = mongoose.model("User")
const Post = mongoose.model("Post")
const Hits = mongoose.model("Hits")


const shortid = require("shortid")

export const getP = (req: Request, res: Response)=>{
  try{
    res.send("test")
  } catch (ex){
    res.send("test err")
  } finally {

  }
}

export const getPosts = async (req: Request, res: Response) =>{
  
  const { author_id  } = req.query
  
  
  try {
  
    let posts = await Post.aggregate([
      { $match: author_id ?  { author_id: new ObjectId(author_id) }  : {} },
      { $lookup: {
          from: "users",
          localField: "author_id",
          foreignField: "_id",
          as: "author"
        }},
      { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
      { $project: { content: 0, author: { password: 0, created_at: 0, updated_at: 0, description: 0} } }
    ])
  
    res.json({posts: posts})
    
  } catch (ex){
    res.send(ex.message)
  } finally {
  
  }
}

export const filterPosts = async (req: Request, res: Response) =>{
  const  { filter }: {
    filter: {tags?: string[], text?: string, summary?: string}
  } = req.body

  try {

    let regExp = new RegExp(filter.text, "i")
    
    let posts = await Post.aggregate([
      {
        $match: {
          $or: [
            {title: {$in: [regExp]}},
            {summary: {$in: [regExp]}},
            {tags: filter.tags ? {$in:  filter.tags} : [] }
          ]
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: "author_id",
          foreignField: "_id",
          as: "author"
        }
      },
      { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
      { $project: {
        content: 0,
        author: {
          password: 0,
          created_at: 0,
          updated_at: 0,
          description: 0,
          last_name: 0,
          _id: 0,
        }

      } }
    ])

    res.send(posts)

  } catch (ex){
    // res.send([])
  }
}

export const getTopHitsPosts = async (req: Request, res: Response) =>{

  try {
    let p = await Post.aggregate([
      // { $match: { author_id: new ObjectId(author_id)}},
      { $lookup: {
          from: "users",
          localField: "author_id",
          foreignField: "_id",
          as: "author"
        }},
      { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
      { $project: {
          tags: 0,
          author: {
            _id: 0,
            password: 0,
            created_at: 0,
            updated_at: 0,
            description: 0,
            email: 0
          }
        } },
      { $lookup: {
          from: "hits",
          localField: "_id",
          foreignField: "post_id",
          as: "hits"
        }},
      { $unwind: { path: "$hits", preserveNullAndEmptyArrays: true } },
      { $project: {
          tags: 0,
          content: 0,
          hits: {
            post_id: 0
          }
        } },
      { $sort: {
          'hits.hits': -1
        } },
      { $limit: 10 }
    ])
    response(res, 200, {  posts: p })

  } catch (ex){
    errorConsole(ex)
    saveLog(ex.message ? ex.message : "internal error")
    response(res, 500, ex.message)
  }
}

export const getPost = async (req: Request, res: Response) =>{
  let { slug, post_id } = req.params
  try {
    let posts: any = [];
    if(!post_id) {
      return response(res, 404, "post not found")
    }
    
    posts =  await Post.aggregate([
      { $match: {_id: new ObjectId(post_id)}},
      { $lookup: {
          from: "users",
          localField: "author_id",
          foreignField: "_id",
          as: "author"
        }},
      { $unwind: { path: "$author", preserveNullAndEmptyArrays: true } },
      { $lookup: {
          from: "hits",
          localField: "_id",
          foreignField: "postId",
          as: "hits"
        }},
      { $unwind: { path: "$hits", preserveNullAndEmptyArrays: true } },
      { $lookup: {
          from: "likes",
          localField: "_id",
          foreignField: "post_id",
          as: "like"
      }},
      { $unwind: { path: "$like", preserveNullAndEmptyArrays: true } },
      { $project: { content: 0 } }
    ])
    
    await increasePostVisitorCount(post_id)
      .then(s=>{})
      .catch(ex=>{})
 
    
    if (posts.length > 0) {
      response(res, 200, {
        post: {
          ...posts[0]
        }
      })
    } else {
      
      saveLog("post not found with id: " + post_id)
      response(res, 404, "post not found")
    }

  } catch (ex){
    errorConsole(ex)
    saveLog(ex.message ? ex.message : "internal error")
    response(res, 500, ex.message)
  } finally {
  
  }

}

export const addPost = async (req: RequestWithAuth, res: Response) =>{
  
  let { title, cover = "",  mdContent, tags, summary = "" } = req.body
  
  
  if(!mdContent){
    return response(res, 400, {message: "post not create because markdown content are empty"})
  }
  
  try {
    let slug = slugify(title, {
      replacement: "-",
      strict: true,
      lower: true,
      trim: true
    })

    if (!slug) {
      slug = shortid.generate()
    }

    let mdFilePath = `markdown/${slug}.md`
    // let isUploaded = await updateFile(mdContent, mdFilePath)

    //! not able to create md file in server. cause netlify free read only filesystem
    //! so we store markdown content in out database
    
    // mdFilePath = await uploadMarkdownFile(mdFilePath, mdContent)
    
    // if(!mdFilePath){
    //   saveLog("markdown file create fail " + mdFilePath)
    //   return  response(res, 409, { message: "markdown file create fail" })
    // }
    
 
    let newPost: any = {
      author_id: new ObjectId(req.user_id),
      slug,
      title,
      cover,
      tags: tags,
      summary,
      content: mdContent,
      path: "",
    }

    let n = new Post({
      ...newPost,
    })
    
    let r: any = await n.save()
    if(!r){
      response(res, 409, "post create fail")
      return
    }
 
    // populated author...
    let user: any = await User.findOne({_id: new ObjectId(req.user_id)}).select("-password -role")
     r._doc.author = user
     response(res, 200, {post: r._doc})

  } catch (ex){
    errorConsole(ex)
    saveLog(ex.message ? ex.message : "post create fail")
    response(res, 409, "post create fail")

  } finally {
  
  }

}


export const updatePost = async (req: RequestWithAuth, res: Response) =>{

  let user_id = req.user_id

  let { _id, title, cover, summary, mdContent, tags } = req.body

  let client;

  try {

    let doc: any  = await Post.findOne({_id: new ObjectId(_id)})
  
    let post = doc._doc

    if(post) {
      if (title) {
        post.title = title
      }
      if(summary){
        post.summary = summary
      }
      if (tags) {
        post.tags = tags
      }
      if (cover) {
        post.cover = cover
      }
      if (mdContent) {
        post.content = mdContent
      }
      if (!post.createAt) {
        post.createAt = new Date()
      }
      post.updatedAt = new Date()
      
      // if(post.path) {
      //   post.path = ""
      // }
   
      try {
        let isUpdated = await Post.updateOne(
          {_id: new ObjectId(post._id)},
          {$set: post}
        )

        if (isUpdated) {
          response(res, 200, {post: post})
        } else {
          response(res, 500, "post update fail 1")
          saveLog("Internal Error. Please Try Again", req.url, req.method)
        }

        // if (mdContent) {
        //     await writeFile(post.path, mdContent)
        //     let isUpdated = await Post.update(
        //       {_id: new ObjectId(post._id)},
        //       {$set: post}
        //     )
        //
        //     if (isUpdated) {
        //       response(res, 200, {post: post})
        //     } else {
        //       response(res, 500, "post update fail 1")
        //       saveLog("Internal Error. Please Try Again", req.url, req.method)
        //     }
        //
        // } else {
        //   response(res, 400, "markdown content required")
        //   saveLog("markdown content required", req.url, req.method)
        // }

      } catch (ex){
        response(res, 500, "post update fail")
        saveLog(ex.message ? ex.message : "Internal Error. Please Try Again", req.url, req.method)
      }


    } else {
      response(res, 404, "post Not found")
    }


  } catch (ex){
    errorConsole(ex)
    saveLog(ex.message ? ex.message : "Internal Error. Please Try Again", req.url, req.method)
    response(res, 500, "Internal Error. Please Try Again")

  } finally {
    client?.close()
  }
}



/**...............Implementation.............*/
function increasePostVisitorCount(post_id: string){

  return new Promise(async (resolve, reject)=>{
    try{
      let hit: any =  await Hits.findOne({postId: new ObjectId(post_id)}, {})
      if(hit){
        let doc = await Hits.update({_id: hit._id}, {
          $inc: { count:  1 }
        })
        resolve(doc)
      } else {
        let newHit = new Hits({
          postId: new ObjectId(post_id), count: 1
        })

        let doc = await newHit.save()
        resolve(doc)
      }
      
    } catch (ex){
      resolve(false)
    }
  })
  
  // let postHit = await client.HGET("post_hits", post.id)
  // if(postHit){
  //
  //   if(Number(postHit)) {
  //     let increase =  Number(postHit) + 1
  //     let isAdded = await client.HSET("post_hits", post.id, increase.toString())
  //     if(isAdded){
  //       // console.log("increase post visit")
  //     }
  //   } else {
  //     let isAdded = await client.HSET("post_hits", post.id, "1")
  //     if(isAdded){
  //       // console.log("increase post visit")
  //     }
  //   }
  //
  // } else {
  //   // create new one
  //   let isAdded = await client.HSET("post_hits", post.id, "1")
  //   if(isAdded){
  //     // console.log("increase post visit")
  //
  //   }
  // }
  
  //
  // let postHit = await client.HGET("post_hits", post.id)
  // if(postHit){
  //
  //   if(Number(postHit)) {
  //     let increase =  Number(postHit) + 1
  //     let isAdded = await client.HSET("post_hits", post.id, increase.toString())
  //     if(isAdded){
  //       // console.log("increase post visit")
  //     }
  //   } else {
  //     let isAdded = await client.HSET("post_hits", post.id, "1")
  //     if(isAdded){
  //       // console.log("increase post visit")
  //     }
  //   }
  //
  // } else {
  //   // create new one
  //   let isAdded = await client.HSET("post_hits", post.id, "1")
  //   if(isAdded){
  //     // console.log("increase post visit")
  //   }
  // }
}



export const getFileContent = async (req: Request, res: Response)=>{
  // try{
  //   let mdContent = await downloadFile(req.body.path)
  //   res.send(mdContent)
  // } catch (ex){
  //   res.send(ex)
  // }
}

export const getPostContent = async (req: Request, res: Response) =>{
  let { filePath, post_id } = req.body
  
  
  let p;
  
  if(filePath){
    p = path.resolve(process.cwd() + `/${filePath}`)
  }
  
  try {
      marked.setOptions({
      highlight: function(code, lang) {
        const hljs = require('highlight.js');
        const language = hljs.getLanguage(lang) ? lang : 'plaintext';
        return hljs.highlight(code, { language }).value;
      },
    })
    
  
    if(p) {
      const stream = fs.createReadStream(p)
      res.writeHead(200, { 'Content-Type': 'text/plain' });

      stream.on("data", (data)=>{
        const html = marked.parse(data.toString());
        // const result = md.render(data.toString());
        res.write(html)
        // res.send(result);
      })

      stream.on("end", ()=>{
        res.end()
      })

      stream.on("error", (e)=>{
        console.log(e)
      })
    } else {
      const post: any = await  Post.findById(post_id).select("content")
      if(post) {
        const html = marked.parse(post.content);
        res.write(html)
        res.end()
      } else {
        res.write("")
        res.end()
      }
    }
  

  } catch (ex){
    errorConsole(ex)
    saveLog(ex.message ? ex.message : "Internal error")
    response(res, 500, ex.message)
  }
  finally {
  
  }
}

export const getRawMarkdownContent = async (req: Request, res: Response) =>{

  try {

    const {filePath, post_id } = req.body
    
    
    
    if(filePath){
      let p = path.resolve(process.cwd() + `/${filePath}`)
      const stream = fs.createReadStream(p)
      res.writeHead(200, { 'Content-Type': 'text/plain' });
  
      stream.on("data", (data)=>{
        res.write(data)
      })
  
      stream.on("end", ()=>{
        res.end()
      })
  
      stream.on("error", (e)=>{
        saveLog("getRawMarkdownContent stream error " + e.message ? e.message: "")
      })
    } else{
  
      const post: any = await  Post.findById(post_id).select("content")
      if(post) {
        res.write(post.content)
        res.end()
      } else {
        res.write("")
        res.end()
      }
    }
    
   
  
  
  } catch (ex){
    errorConsole(ex)
    response(res, 404, {mdContent: ""})
  }

}

async function deleteMarkdownFile(filePath){
  try {
    await rm(filePath)
    console.log("markdown file deleted...")
  } catch (ex){
    console.log("markdown not found...")
    errorConsole(ex)
  }
}

function deletePostHandler(req: Request, res: Response){
  return new Promise(async (resolve, reject)=>{
    try {
      let doc = await Post.deleteOne({_id: new ObjectId(req.body._id)})
      if (doc) {
        // let mdFilePath = path.resolve(process.cwd() + "/" + req.body.path)
        response(res, 201, {id: req.body._id})
        // await deleteMarkdownFile(mdFilePath)
      } else {
        response(res, 404, "Post not found")
      }
    } catch (ex){
      response(res, 500, "Post Delete fail")
    }
  })
}


export const deletePost = async (req: RequestWithAuth, res: Response) =>{
  let { adminId } = req.body
  try{
    if(adminId){
      let admin = await User.findOne({_id: new ObjectId(adminId), role: "admin"})
      if(admin) {
        await deletePostHandler(req, res)
        // await deleteAdminPostIntoCache("admin_posts", req.body._id)
      }
    } else {
      
      await deletePostHandler(req, res)
      
      // let admin = await User.findOne({_id: new ObjectId(req.user_id), role: "admin"})
    }
   
  } catch (ex){
    response(res, 500, "Post Delete fail")
  } finally {
  
  }
}

export const handleToggleLike = async (req: Request, res: Response)=>{
  const {post_id, user_id} = req.body

  let client;
  try{
    response(res, 500, "Please try again")
    // client = await redisConnect()
    // let postStr = await client.HGET("posts", post_id)
    // if(postStr){
    //   let post = JSON.parse(postStr)
    //   if(post.likes) {
    //     let idx = post.likes && post.likes.indexOf(user_id)
    //     if (idx === -1) {
    //       post.likes && post.likes.push(user_id)
    //     } else {
    //       post.likes && post.likes.splice(idx, 1)
    //     }
    //   } else {
    //     post.likes = [user_id]
    //   }
    //
    //   let doc = await client.HSET("posts", post_id, JSON.stringify(post))
    //   if(doc === 0 || doc) {
    //     response(res, 201, {message: "Like Action Success", post: post})
    //   } else {
    //     response(res, 500, "Post Action fail")
    //   }
    // }

  } catch (ex){
    response(res, 500, "Post Delete fail")

  } finally {
    client?.quit()
  }
}


