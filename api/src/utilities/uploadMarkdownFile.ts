import path from "path";
import {writeFile} from "fs/promises";
import errorConsole from "../logger/errorConsole";

function uploadMarkdownFile(mdFilePath: string, mdContent: string){
  return new Promise<string | null>(async (s, e)=>{
    try {
      let p = path.resolve(process.cwd() + "/"+ mdFilePath)
      await writeFile(p, JSON.stringify(mdContent))
      s(mdFilePath)
    } catch (ex){
      errorConsole(ex)
      s(null)
    }
  })
}

export default uploadMarkdownFile