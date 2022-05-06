
import {readdir, stat} from "fs/promises"

import path from "path";

const AdmZip = require("adm-zip");

function createZip() {
	
	return new Promise(async (resolve, reject)=>{
		
		// creating archives
		const zip = new AdmZip();
		
		try{
			let dir = path.join(__dirname, "../../", "dist/markdown")
			let s = await stat(dir)
			if(s && s.isDirectory()) {
				let files = await readdir(dir)
				files.forEach((f, index) => {
					
					(async function (){
						
						try{
							let fileStats = await stat(path.join(dir, f))
							if(fileStats.isFile()) {
								zip.addLocalFile(path.join(dir, f));
								
								if(index + 1 >= files.length){
									// all file added
									// let path = "files.zip"
									// zip.writeZip(path);
					
									// send zip as buffer data
									resolve(zip.toBufferPromise())
									
								}
							}
						} catch (ex){
							reject("Archive create fail")
						}
						
					}())
				})
			}
		} catch (ex){
			reject("Archive create fail")
		}
	})
}

export default createZip