import Base from"./Base";
import Joi from "joi";

class Hits extends Base{
  
  static tableName = "hits"
  
  _id?: string
  post_id: string
  hits: string
  
  constructor({ _id="", post_id, hits }) {
    super(Hits.tableName)
    this.post_id = post_id;
    this.hits = hits;
    this._id = ""
  }
  
  // @ts-ignore
  validationBeforeSave() {
    let { tableName, ...otherValue } = this
    return new Promise((resolve, reject)=>{
      let user = Joi.object({
        _id: Joi.optional(),
        post_id: Joi.any().required(),
        hits: Joi.number().required()
      })
      let isError = user.validate(
        otherValue,
        {abortEarly: false}
      )
      if(isError.error){
        let r = {}
        for (const detail of isError.error.details) {
          r[detail.path[0]] = detail.message
        }
        resolve(r)
      } else {
        resolve(null)
      }
    })
  }
  
  //? overwrite in Base class save method...
  // save() {
  //   console.log("hello")
  // }
}

export default Hits