const bcryptjs  = require("bcryptjs")

export const createHash = (password)=>{
  return new Promise<{err: string, hash}>(async (resolve, reject)=>{
    try {
      let salt = await bcryptjs.genSalt(10);
      let hashedPass = await bcryptjs.hash(password, salt)
      resolve({err: null, hash: hashedPass})
    } catch (ex){
      resolve({err: ex.message, hash: ""})
    }
  })
}

export const hashCompare = (password, hashPassword)=>{
  return new Promise<{err: string, hash}>(async (resolve, reject)=> {
    try {
      let m = await bcryptjs.compare(password, hashPassword)
      resolve(m)
    } catch (ex) {
      resolve(null)
    }
  })
}