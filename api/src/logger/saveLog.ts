import {appendFile} from "fs/promises";
import fs from "fs";
import path from "path";

function saveLog(message: string, url?: string, method?: string )  {
  let date = new Date()
  let isPM  = "AM"
  let t= date.getHours()
  if (t > 11) {
    isPM = "PM"
  }

  
  let formatMessage = `-----------------------------------------------------------------------------------------------
      ${url} - ${method} - ${date.toLocaleTimeString()}
      ${message}
-----------------------------------------------------------------------------------------------\n \n`
  
  let dir = path.join(__dirname, "..", "logs")
  let s = fs.existsSync(dir)
  if(!s) {
    fs.mkdirSync(dir)
  }
  let filePath = path.resolve(dir  + "/"+ date.toISOString().slice(0, 10) + ".log")
  console.log(formatMessage)
  appendFile(filePath, formatMessage).then(r => {})
    .catch(ex=>{
    console.log(ex)
  })
}
  
  
  export default saveLog
  