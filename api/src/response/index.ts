


function response(res, status: number = 200, data?: string | object){
  let resp: any = {}
  if(typeof data === "string"){
    resp = { message: data }
  } else {
    resp = data
  }
  res.status(status).json(resp)
}


export default response