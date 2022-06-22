import response from "../response";
import {createToken, parseToken} from "../jwt";
import errorConsole from "../logger/errorConsole";

import express, { Request, Response } from 'express';
import getAppCookies from "../utilities/getAppCookies";
import fs from "fs";
import formidable from 'formidable';
import {uploadImage} from "../cloudinary";

import replaceOriginalFilename from "../utilities/replaceOriginalFilename";
import {createHash, hashCompare} from "../hash";
import sendMail from "../utilities/sendMail";

import {ObjectId} from "mongodb";
import saveLog from "../logger/saveLog";
import mongoose from "mongoose";


const User = mongoose.model("User")

export const createNewUser = async (req: Request, res: Response)=> {
  let client;
  
  try {
    let {first_name, last_name, email, password } = req.body
    const {err, hash} = await createHash(password)
    
    let user: any = await User.findOne({email: email}, {})
    if (user) {
      response(res, 409, {message: "User Already exists"})
      return
    } else {
      let newUser: any = new User({
        avatar: "",
        first_name,
        last_name,
        username: first_name +  last_name ? last_name : "",
        email,
        password: hash
      })
  
      newUser = await newUser.save()
      if (newUser) {
        let token = await createToken(newUser._id, newUser.email)
        response(res, 201, {
          token: token,
          ...newUser
        })
      } else {
        response(res, 500, "Please Try Again")
      }
    }
    
  } catch (ex){
    console.log(ex)
    errorConsole(ex)
    response(res, 500, {
      message: "Please Try Again",
      m:ex.message
    })
  
  } finally {
    client?.quit()
  }
}

export const loginUser = async (req: Request, res: Response)=>{
  let client;
  try {
    let { email, password } = req.body
    if(!(email && password)) {
      return response(res, 409, "Missing credential")
    }
    let {token, user} = await loginUserHandler(email, password)
    response(res, 201, {token: token, ...user})
    
  } catch (ex){
    errorConsole(ex)
    response(res, 500, ex.message ? ex.message : "Internal Error")
  } finally {
    client?.close()
  }
}

function loginUserHandler(email: string, password: string){
  return new Promise<{token: string, user: object}>(async (s, e)=>{
    
    try {
      let user: any = await User.findOne({email: email})
      
      if(user){
        let match = await hashCompare(password, user.password)
        if(!match)  return e(new Error("Password not match"))
      
        let token = await createToken(user._id, user.email, user.role ?  user.role : "user")
        delete user._doc.password
        s({user: user._doc, token})
      } else{
        e(new Error("login fail"))
      }
    
    } catch (ex){
      errorConsole(ex)
      e(ex)
    } finally {
    
    }
  })
}

export const loginViaToken = async (req: Request, res: Response)=>{
  let client;
  try {
    let token = req.headers["token"]
   
    if(!token) return response(res, 404, "token not found")
    let { userId, role } =  await parseToken(token)
    let user: any = await User.findOne({_id: new ObjectId(userId)}).select("-password")

    if(user){
      response(res, 201, user)
    } else {
        response(res, 404, {message: "User not found"})
    }
  } catch (ex){
    saveLog(ex.message ? ex.message : "Server Error")
    return response(res, 500, "Server error. try again")
  } finally {
    client?.close()
  }
}

export const getUser = async (req: Request, res: Response)=> {
  const { id }  = req.params
  try {
    let user = await User.findOne({_id: new ObjectId(id)}).select("-password")
    response(res, 200, {user})
    
  } catch (ex){
  
  } finally {
  }
}

export const getUsers = async (req: Request, res: Response)=> {
  const {adminId} = req.body
  let client;
  try {
    let isAdmin = await User.findOne({_id: new ObjectId(adminId), role: "admin"})
    if (isAdmin) {
      const users = await User.find({}, { projection: { password: 0 }})
      response(res, 200, { users: users })
    } else {
      response(res,  409, { message: "Access denied" })
    }
  } catch (ex){
    errorConsole(ex)
    response(res,  500, { message: "Internal error" })
  } finally {
    client?.close()
  }
}

export const getUserEmail = async (req: Request, res: Response)=> {
  const { email} = req.params
  let client;
  
  try {
    let user = await User.findOne({email: email})
    if(user) {
      // setTimeout(()=>{
        response(res, 200, {user: { avatar: user.avatar }})
 
    } else {
      response(res, 404, "This email not yet registered")
    }
  } catch (ex){
    errorConsole(ex)
    response(res, 500, "")
  } finally {
    client?.close()
  }
}

async function setDayVisitor(client, ID){
  let now = new Date()
  
  return new Promise<number>(async (s, r)=>{
    try{
      let day_visitor = await client.GET("day_visitor")
  
      if(day_visitor) {
        let mv = {...JSON.parse(day_visitor)}
        // first check change date or not...
        let isChangeDay = now.getDate() > Number(mv.day)
    
        if(!isChangeDay) {
          ///
          if (mv.ids.indexOf(ID) === -1) {
            mv.ids.push(ID)
          }
        } else {
          /// reset new date
          mv = {
            day: now.getDate(),
            ids: [ ID ],
          }
        }
        let insert = await client.SET("day_visitor", JSON.stringify(mv))
        if(insert){
          s(mv.ids.length)
        }
      } else {
    
        await client.SET("day_visitor", JSON.stringify({
          day: now.getDate(),
          ids: [ ID ],
        }))
        s(1)
      }
    } catch (ex){
      r(0)
    }
  })
  
}

export const cookieAdd = async (req: Request, res: Response)=> {
  
   let randomID = Math.ceil(Date.now() / 1000)
   let client;
   try {
     client = await redisConnect()
     
     let app_visitor_count = await client.sCard("app_visitor")
     let day_visitor_count = 0
     
     if (getAppCookies(req).browser_uuid) {
       // response(res, 200, {message: "cookie already exists"})
  
       day_visitor_count = await setDayVisitor(client, getAppCookies(req).browser_uuid)
       
       response(res, 201, {
         message: "cookie send",
         day_visitor: day_visitor_count,
         total_visitor: app_visitor_count,
       })
  
     } else {
       
       // increase total visitor....
       let isSet = await client.sAdd("app_visitor", randomID.toString())
       if (isSet){
         res.cookie('browser_uuid', randomID, {
           maxAge: ((1000 * 3600) * 24) * 30, // 30days
           httpOnly: true,
           // domain: 'rsl-blog-server-1.herokuapp.com',
           // domain: 'http://localhost:5500',
    
           sameSite: 'none',
           // Forces to use https in production
           secure: true
         });
  
         day_visitor_count = await setDayVisitor(client, randomID.toString())
  
         response(res, 201, {
           message: "cookie send",
           day_visitor: day_visitor_count,
           total_visitor: app_visitor_count + 1,
         })
       }
     }
   } catch (ex){
     saveLog(ex.message ? ex.message : "Server Error")
     return response(res, 500, "Server error. try again")
   } finally {
      client?.quit()
   }
   
   
 }
 
export const updateProfile = async (req: Request, res: Response)=>{
  
   try {
     
     let user: any = User.findOne({_id: new ObjectId(req.user_id)}, {})
     
     if(user) {
       const {username, first_name, about_you, last_name, email, oldPassword, newPassword} = req.body
  
       if (oldPassword && newPassword) {
         let match = await hashCompare(oldPassword, user.password)
         if (!match) {
           return response(res, 409, {message: "current password doesn't match"})
         }
    
         let {err, hash} = await createHash(newPassword)
         user.password = hash
         if (err) {
           return response(res, 500, {message: err})
         }
       }
  
       if(about_you){
         user.description = about_you
       }
       if (username) {
         user.username = username
       }
       if (first_name) {
         user.first_name = first_name
       }
       if (last_name) {
         user.last_name = last_name
       }
       if (email) {
         user.email = email
       }
  
       let doc  = await User.update({_id: new ObjectId(req.user_id)},
         {
           $set: user
         }
       )
       if(doc) {
         return response(res, 201, {
           user: {
             ...user,
             password: newPassword
           },
           message: "Operation completed"
         })
       } else {
         return response(res, 409, {
           message: "Operation fail"
         })
       }
     }
     
   } catch (ex){
     return response(res, 500, {
       message: "Operation fail"
     })
   } finally {
   
   }
 }
 
export const uploadProfilePhoto = (req: Request, res: Response)=>{
  
   const form = formidable({multiples: false})
   form.parse(req, async (err, fields, files)=> {
    
     if (err) {
       console.log(err)
       return
     }
  
     let {newPath, name} = await replaceOriginalFilename(files, "avatar")
     let client;
     try{
       client = await redisConnect()
       let cloudImage = await uploadImage(newPath)
       if (cloudImage.secure_url) {
         let user: any = await  User.findOne({_id: new ObjectId(req.user_id)}, {})
         let isUpdated = await User.update({_id: user._id}, {$set: {avatar: cloudImage.secure_url}})
         if(isUpdated){
           fs.rm(newPath, () => {})
           response(res, 201,{message: "profile photo has been changed", avatar: cloudImage.secure_url})
         } else {
           response(res, 500, "avatar upload fail")
         }
       } else {
         fs.rm(newPath, () => {})
         response(res, 500, "avatar upload fail")
       }
    
     } catch (ex){
       errorConsole(ex)
       response(res, 500, "avatar photo upload fail")
    
     } finally {
       await client?.quit()
     }
   })
   
}

export const uploadProfileCoverPhoto = (req: Request, res: Response)=>{
   const form = formidable({multiples: true})
   
   form.parse(req, async (err, fields, files)=> {
  
     if (err) {
       response(res,500, "cover photo upload fail")
       return
     }
  
     if(files && files.cover) {
  
       let tempDir = files.cover.filepath.replace(files.cover.newFilename, '')
       let newPath = tempDir + files.cover.originalFilename
       fs.rename(files.cover.filepath, newPath, async (err) => {
         if (!err) {
           try {
             let user: any = await  User.findOne({_id: new ObjectId(req.user_id)}, {})
             if(user) {
               let cloudImage = await uploadImage(newPath)
               if (cloudImage.secure_url) {
                 let isUpdated = await User.update({_id: user._id}, {$set: {cover: cloudImage.secure_url}})
                  if(isUpdated) {
                    fs.rm(newPath, () => {})
                    response(res, 201, {message: "cover photo has been changed", cover: cloudImage.secure_url})
                  } else {
                    fs.rm(newPath, () => {})
                    response(res,500, "cover photo upload fail")
                  }
                 
               }
             }  else {
               fs.rm(newPath, () => {})
               response(res,500, "cover photo upload fail")
             }
           
           } catch (err) {
             errorConsole(err)
             response(res,500, "cover  photo upload fail")
           } finally {
           
           }
             
         }
       })
     }
   })
}

export const uploadMarkdownImage = (req: Request, res: Response)=>{
   const form = formidable({multiples: false})
   
   form.parse(req, async (err, fields, files)=> {
  
     if (err) {
       console.log(err)
       return
     }
     
     
     if(files && files.photo) {
  
       let tempDir = files.photo.filepath.replace(files.photo.newFilename, '')
       let newPath = tempDir + files.photo.originalFilename
       fs.rename(files.photo.filepath, newPath, async (err) => {
         if (!err) {
           uploadImage(newPath).then(image => {
             if (image.secure_url) {
                fs.rm(newPath, () => {  })
                response(res, 201, {message: "markdown image upload complete", path: image.secure_url})
             } else {
               fs.rm(newPath, () => {  })
               response(res, 500,"markdown image upload fail")
             }
           })
             .catch(ex=>{
               response(res, 500,"markdown image upload fail")
             })
         }
       })
     }
   })
}

export const getAuthPassword = async (req: Request, res: Response)=>{
  
  if(req.body.user_id !== req.query.user_id){
    return  response(res, 409, { message: "You are unauthorized" })
  }
  let client;
  try{
    client = await redisConnect()
    let userStr = client.HGET("users", req.body.user_id)
    let user = JSON.parse(userStr)
    
    // response(res, 201, other)
    response(res, 200, user.password)
    
  } catch (ex){
    errorConsole(ex)
    return response(res, 500, ex.message)
  } finally {
    client?.quit()
  }
}

export const sendPasswordResetMail = async (req: Request, res: Response)=>{
  let client;
  const expiredTime = '30min'
  try{
    const {to} = req.body
    // send a link and a secret code with expire date...
    let user: any = await User.findOne({email: to}, {})
    if(!user){
      response(res, 404, "This email not registered yet")
      return
    }
    let token = createToken(user._id, user.email, expiredTime)
    let info: any = await sendMail({
      to: to,
      from: process.env.ADMIN_EMAIL,
      subject: "Change Password",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8"/>
          <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <style type="text/css">
                  .bg{
                    font-family: Roboto,serif;
                    box-sizing: border-box;
                    width: 100%;
                    height: max-content;
                    background-image: linear-gradient(0deg, rgba(255, 70, 117, 0.92), rgba(255, 58, 241, 0.69));
                  }
                  .panel{
                    background: rgba(255, 255, 255, 0.73);
                  }
                  
                </style>
              </head>
              <body>
          
              <div class="bg" style="padding: 50px">
                <h1 style="text-align: center; color: white; margin: 0px 0; margin-bottom: 10px; font-weight: 600">Change Password DEV-STORY application</h1>
                <div style="background: rgba(230,230,230,0.439); padding: 60px; max-width: 60%; margin: auto; border-radius: 4px ">
                  <h2 style="text-align: start; color: white; margin: 20px 0; font-weight: 500">Hey ${user.first_name}</h2>
                  <p style="text-align: start; color: white; margin: 0px 0; font-weight: 400">Someone (hopefully you) ! has requested to change your old password.
                    Please click the link below to change your password now</p>
                    <button style="width: max-content; padding:5px 10px; color: white; outline: none; border:none; background: rgba(255,255,255,0.36); border-radius: 4px; margin-top: 40px ">
                    <a href="${process.env.NODE_ENV === "development" ? "http://localhost:5500" : "https://rsl-my-blog.netlify.app" }/#/auth/join/new-password/${token}">CHANGE MY PASSWORD </a>
                    </button>
                
                  <p style="text-align: start; color: white; margin: 20px 0; font-weight: 500">Please note that your password will not change unless you click the link above and
                    create a new one.</p>
                  <p style="text-align: start; color: white; margin: 20px 0; font-weight: 500">This link will expire in 30 minutes. If your link has expired, you can always</p>
                
                  <div>
                    <p>Sincerely,</p>
                    <h4>Rasel Mahmud</h4>
                  </div>
                  
                </div>
              </div>
            </body>
        </html>
      `
    })

    // if(info.messageId){
    //   response(res, 201, {message: "Email has been send"})
    // } else {
    //   response(res, 500, "internal error")
    // }
    
  } catch (ex){
    errorConsole(ex)
    if(ex.message === "jwt expired"){
      response(res, 409, "session timeout")
    } else {
      
      response(res, 500, ex.message)
    }
  } finally {
  
  }
}

export const checkPasswordResetSessionTimeout = async (req: Request, res: Response)=> {
  let { token } = req.body
  
  try {
    let s = await parseToken(token)
    // console.log(s)
    response(res, 200, "")
  } catch (ex){
    errorConsole(ex)
    if(ex.message === "jwt expired"){
      response(res, 500, "password reset session expired")
    }
  }
}

export const changePassword = async (req: Request, res: Response)=>{
  let client;
  try{
    const { token, password }  = req.body

    // send a link and a secret code with expire date....
    // 1st check token validity.
    // 2. if token valid then reset password
    
    let { email, id } =  await parseToken(token)
    let user: any = await User.findOne({email: email}, {})
    
    if(user){
      let {hash, err} = await createHash(password)
      if(!hash){
        errorConsole(err)
        response(res, 500, "Password reset fail. Try again")
      }
      let isUpdated = await User.update(
        {email: email},
        {$set: {password: hash}}
      )
      if(isUpdated) {
        let {password, ...other} = user
        response(res, 201, {token: token, ...other})
      } else {
        response(res, 500, "Password reset fail. Try again")
      }

    } else {
      response(res, 500, "Account not found")
    }
    
    
  } catch (ex){
    errorConsole(ex)
    response(res, 500, ex.message ? ex.message : "Internal Error")
    
  } finally {
    client?.quit()
  }
}







