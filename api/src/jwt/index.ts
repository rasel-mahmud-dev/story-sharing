const jwt = require('jsonwebtoken')

export const createToken = (userId: string, role= "user", expiresIn?:string)=> {
  return jwt.sign({
      userId,
      role,
    },
    process.env.SECRET, {expiresIn: "7d"}
  )
}


export const parseToken = (token)=> {
   return new Promise<{userId: string, role: string}>(async (resolve, reject)=>{
     try {
       if(token) {
         let d = await jwt.verify(token, process.env.SECRET)
         resolve(d)
       } else {
        reject(new Error("Token not found"))
       }
     } catch (ex){
       reject(ex)
     }
   })
}

