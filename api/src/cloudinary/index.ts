import saveLog from "../logger/saveLog";

const { v2: cloudinary} = require("cloudinary");


export const cloudinaryHandler = ()=>{
  cloudinary.config({
    cloud_name: process.env.cloud_name,
    api_key: process.env.api_key,
    api_secret: process.env.api_secret
  });
  
  return cloudinary
}



export const uploadImage = (imagePath: string, dir?: string)=>{
  return new Promise<{secure_url: string}>(async (resolve, reject)=>{
    try{
      let s = await cloudinaryHandler().uploader.upload(
        imagePath,
        {
          use_filename: true,
          unique_filename: false,
          folder: dir ? dir : "",
          overwrite: false
        })
      resolve(s)
    } catch (ex){
   
      if(ex.message){
        if(typeof ex.message === "string"){
          saveLog(ex.message)
        }
      }
      if(ex.error){
        if(typeof ex.error === "string"){
          saveLog(ex.error)
        } else {
          saveLog(ex.error?.message)
        }
      }
      reject(ex)
    }
  })
  
}


export default cloudinaryHandler