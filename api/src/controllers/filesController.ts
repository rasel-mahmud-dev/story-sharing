import response from "../response";
import fs from "fs";
import formidable from 'formidable';
import path from "path";
import {cp, readdir, stat, writeFile} from "fs/promises";
import replaceOriginalFilename from "../utilities/replaceOriginalFilename";
import errorConsole from "../logger/errorConsole";
import { Request, Response } from  "express"
// const archiver = require('archiver');


// export const makeDataBackup  = async (req, res)=>{
//
//   const archive = archiver('zip', {
//     zlib: {level: 9} // Sets the compression level.
//   });
//
//   archive.on('error', function (err) {
//     errorConsole(err)
//     res.end()
//   });
//
//   // pipe to response data to the file
//   archive.pipe(res);
//   const markdownDir = process.cwd() + "/markdown"
//
//   archive.directory(markdownDir, "markdown");
//
//   await archive.finalize()
//   // after finalize archive
//   // end streaming...
//    res.end()
// }

export const getFileContent = async (req, res)=>{
  let filePath = req.query.path
  try {
    if (filePath) {
      let a = await stat(filePath)
      if(a) {
        // const content = await readFile(filePath)
        let stream = fs.createReadStream(path.resolve(filePath))
        stream.pipe(res)
        stream.on("error", ()=>{
          response(res, 404, {
            message: "stream error on " + filePath
          })
        })
        
      } else {
        response(res, 404, {
          message: "file not found with path " + filePath
        })
      }
    } else {
      response(res, 404, {
        message: "file not found with path " + filePath
      })
    }
  } catch (ex){
    response(res, 404, {
      message: ex.message
    })
  }
  
  // for (const file of mdFiles) {
  //   let a = await stat(MDDirpath() + "/" +  file)
  //   mdFilesD.push({
  //     dir: a.isDirectory(),
  //     modifyTime: a.mtime,
  //     name: file,
  //     path: MDDirpath() + "/" +  file,
  //     size: a.size
  //   })
  // }
  //
  
  
}

export const saveFileContent = async (req, res)=>{
  try {
  
    let info = await stat(req.body.path)
    if (info) {
      await writeFile(req.body.path, JSON.stringify(req.body.data, undefined, 2))
      response(res, 201, {message: "this file are updated"})
    }
  } catch (ex){
    response(res, 500, ex.message)
  }
}

export const getDBFileList = async () =>{
  return new Promise<any[]>(async (resolve, reject)=>{
    try{
      let mdDir = path.resolve(process.cwd(), "markdown")
      
      
      let files = await readdir(mdDir)
      
      let a = []
      
   
      files.forEach((file, index)=>{
        (async function () {
          let info = await stat(mdDir + "/" + file)
          let fileInfo = {
              dir: false,
              name: file,
              path: "markdown/" + file,
              size: info.size,
              modifyTime: info.mtime
            }
            a.push(fileInfo)
          if((index + 1) === files.length){
            resolve(a)
          }
        }())
      })
      
      //
      // let files = await getFiles(mdDir)
      // if(files){
      //   let updatedFiles: any[] = files.map(file=>{
      //     return {
      //       dir: file['.tag'] !== "file",
      //       name: file.name,
      //       path: file.path_lower.slice(1),
      //       size: file.size,
      //       modifyTime: file.client_modified
      //     }
      //   })
      //   resolve(updatedFiles)
      // }
      
    } catch(ex){
      errorConsole(ex)
      resolve([])
    }
    
  })
  
}

export const getMarkDownFileList = async (req, res)=>{
  let files =  await getDBFileList()
  if(files){
    response(res, 201, files)
  }
}


export const  uploadFile = async (req, res)=>{
  const form = formidable({multiples: true})
  form.parse(req, async (err, fields, files)=> {
  
    if (err) {
      return response(res, 500, {
        message: "File upload fail. " + err.message
      })
    }
  
    try {
      if(fields.dirType === "markdown"){
        let {newPath, name} = await replaceOriginalFilename(files, "markdown")
        let uploadedPath = path.resolve(process.cwd() + "/markdown/" +  name)
        await cp(newPath, uploadedPath,{force: true})
        let info  = await stat(uploadedPath)
        
        let fileInfo = {
          dir: false,
          name: name,
          path: "markdown/" + name,
          size: info.size,
          modifyTime: info.mtime
        }
       
        response(res, 201, {
          ...fileInfo,
          message: "Markdown File upload Success",
          uploadedPath: uploadedPath
        })
  
      }
      
      
    } catch (ex){
      response(res, 500, {
        message: "File upload fail" + ex.message
      })
    }
    
  })
}


export const deletedFile = async (req, res)=>{

  let filePath = req.body.path
    
    try {
      // let file = await deleteFile(filePath)
      let file = false
      if(file){
        return response(res, 201, "file deleted")
      } else {
        return response(res, 500, "file are not deleted")
      }
    } catch (ex){
      errorConsole(ex)
      response(res, 500, {
        message: "File upload fail" + ex.message
      })
    }
    
}

export async function syncMarkdownFileToDrive(res: Response, req: Request){
  try {
    let mdDir = path.resolve(process.cwd(), "markdown")
    let files = await readdir(mdDir)
    
    
    
    let upload = 0
    // listFiles()
    // files.forEach((file, index)=>{
    //   (async function (){
    //     const r = await uploadFileDrive(mdDir + "/" + file, file)
    //     if(r) {
    //       upload++
    //     }
    //     if((index + 1) === files.length){
    //       console.log(upload)
    //     }
    //   }())
    // })
    
    
  } catch (ex){
    console.log(ex)
    // errorConsole(ex)
  }
}