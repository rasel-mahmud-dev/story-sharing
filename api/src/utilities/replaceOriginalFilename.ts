import fs from "fs";


function replaceOriginalFilename(files, fieldName: string){
  return new Promise<{newPath: string, name: string}>((resolve, reject)=>{
    if (files && files[fieldName]) {
      let tempDir = files[fieldName].filepath.replace(files[fieldName].newFilename, '')
      let newPath = tempDir + files[fieldName].originalFilename
      fs.rename(files[fieldName].filepath, newPath, async (err) => {
        if (!err) {
          resolve({newPath, name: files[fieldName].originalFilename})
        } else {
          reject("file rename fail")
        }
      })
    }
  })
}

// linux ===> /tmp/postcss-8-plugin-migration.md
// win ===> C/users/[usrename]/appdata/Rooming/tmp/postcss-8-plugin-migration.md

export default replaceOriginalFilename