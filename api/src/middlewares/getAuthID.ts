import { parseToken} from "../jwt";
import {NextFunction,  Response} from "express";
import {RequestWithAuth} from "../types";

 function getAuthID(req: RequestWithAuth, res: Response, next: NextFunction){
  let token = req.headers["token"]
  
  if(!token){
    res.status(409).json({message: "You are unauthorized"})
    return
  }
  
  parseToken(token).then(u=>{
    req.user_id = u.userId
    req.user_role = u.role
    next()
  }).catch(err=>{
    console.log(err.message)
    res.status(409).json({message: "You are unauthorized"})
    return
  })
}


export default getAuthID