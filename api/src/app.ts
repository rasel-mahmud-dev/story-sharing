

import logLine from "./console"
import mongoose from "mongoose";

const PORT = process.env.PORT || 8080
const HOST = process.env.HOST


const mainApp = async (app)=>{
  
  if(process.env.NODE_ENV === "development") {
    logLine()
    app.listen(PORT, HOST, () => {
      console.log(`Running on http://${HOST}:${PORT}`);
    });
  }
  
  
  import("./models");
  
  const routes = await import("./routers")
  if(routes.default){
    routes.default(app)
  }
  
  let CONNECTION_URI = process.env.NODE_ENV === "development" ? "mongodb://127.0.0.1:27017/dev-story" : process.env.MONGODB_URI
  
  mongoose.connect(CONNECTION_URI).then(r => {
    console.log("database connected")
  }).then(err=>{
    console.log(err)
  })
  
  
  
}


module.exports  = mainApp
export default mainApp


// 'use strict';
// import express from 'express';
// import cors from  "cors"
//
// import logLine from "./console"
//
//
// const bodyParser = require('body-parser');
//

//
// require('dotenv').config()
//
// import {mongoConnect} from "./database";
// import saveLog from "./logger/saveLog";
// import errorConsole from "./logger/errorConsole";
//
//
// logLine()
//
// import("./passport/oauth")
// import("./passport/facebook")
//
//
// // App
// const app = express();
// app.use(express.json())
//
// app.use(bodyParser.urlencoded({extended: false}))
//
// const whitelist = [process.env.FRONTEND, "https://rasel-mahmud-dev.github.io", process.env.FRONTEND2]
// const corsOptions = {
//   credentials: true,
//   origin: function (origin, callback) {
//     console.log(origin)
//     if (whitelist.indexOf(origin) !== -1 || !origin) {
//       callback(null, true)
//     } else {
//       if(process.env.NODE_ENV === "development"){
//         callback(null, true) // anyone can access this apis when is development mode
//       } else {
//         callback(null, false) // anyone can access this apis
//         // callback(new Error('Not allowed by CORS'))
//       }
//     }
//   }
// }
// app.use(cors(corsOptions))
//
// if(process.env.NODE_ENV === "development") {
//   const routes = require("../src/routers")
//   routes(app)
// } else {
//   const routes = require("./routers")
//   routes(app)
// }
//
//
// app.get('/', (req, res) => {
//   res.send("Hi There!!")
// });
//
// // app.get('/api/posts', (req, res) => {
// //   res.send([{name: "Rasel"}]);
// // });
// //
// //
// // app.post('/file', async (req, res) => {
// //
// //   let { content, filenName } = req.body
// //
// //   let data = "Hello this is file"
// //   let p = path.resolve(process.cwd() + `/markdown/${filenName}`)
// //   try{
// //     let file  = await writeFile(p, JSON.stringify(content))
// //     res.json({message: "new file created.", filenName: p});
// //
// //   } catch(ex){
// //     res.json({message: ex.message});
// //   }
// // });
// //
// // app.get('/file/:filename', async (req, res) => {
// //   console.log("sdf")
// //   let p = path.resolve(process.cwd() + `/markdown/${req.params.filename}`)
// //
// //   try{
// //     let content  = await readFile(p, "utf-8")
// //     res.send(content);
// //
// //   } catch(ex){
// //     res.json({message: ex.message});
// //   }
// // });
//
// // app.post('/api/markdown/content', async (req, res) => {
// //
// //   const { filePath  } = req.body
// //
// //   let p = path.resolve(process.cwd() + `/${filePath}`)
// //
// //   try{
// //     let content  = await readFile(p, "utf-8")
// //
// //     // node.js, "classic" way:
// //     const md = new MarkdownIt({
// //       highlight: function (str, lang) {
// //         if (lang && hljs.getLanguage(lang)) {
// //           try {
// //             return hljs.highlight(str, { language: lang }).value;
// //           } catch (__) {}
// //         }
// //
// //         return ''; // use external default escaping
// //       }
// //     });
// //     const result = md.render(content);
// //
// //     res.send(result);
// //
// //   } catch(ex){
// //     res.json({message: ex.message});
// //   }
// // });
//
// app.get("/send", (req, res)=>{
//
// })
//
//
// mongoConnect().then(async res=>{
//   await res.client.close()
// }).catch(err=>{
//   saveLog("mongodb connection fail.")
//   errorConsole("mongodb connection fail.")
// })
//
// app.listen(PORT, HOST, ()=>{
//   console.log(`Running on http://${HOST}:${PORT}`);
// });
