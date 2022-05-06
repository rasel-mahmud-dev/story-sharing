import { parseToken} from "../jwt/index";

 function getAuthID(req, res, next){
  let token = req.headers["token"]
  
  if(!token){
    res.status(409).json({message: "You are unauthorized"})
    return
  }
  
  parseToken(token).then(u=>{
    req.user_id = u.id
    req.user_email = u.email
    next()
  }).catch(err=>{
    console.log(err.message)
    res.status(409).json({message: "You are unauthorized"})
    return
  })
}


export default getAuthID