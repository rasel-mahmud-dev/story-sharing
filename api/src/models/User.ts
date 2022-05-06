
import Base from"./Base";
import Joi from "joi";

interface a{
  name: string
}




class User extends Base{
  
  static tableName = "users"
  
  // isSaveOnValidate: boolean
  
  _id?: string;
  facebookId?: string;
  googleId?: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
  avatar: string;
  role?: string
  
  constructor({ _id = "", role= "user", facebookId=null,  googleId=null, first_name, last_name, email, username, password, created_at, updated_at, avatar }) {
    super("users")
    this._id = "",
    this.facebookId = facebookId,
    this.googleId = googleId,
    this.first_name = first_name
    this.last_name = last_name
    this.email = email
    this.password = password
    this.created_at = created_at
    this.username = username
    this.updated_at = updated_at
    this.avatar = avatar
    this.role = role
    
    // this.isSaveOnValidate = validate
  }
  
  
  // @ts-ignore
  validationBeforeSave() {
    return new Promise<any>(async (resolve, reject)=>{
      let { tableName, _id,  ...otherValue } = this
      let user = Joi.object({
        first_name: Joi.string().required(),
        username: Joi.string().required(),
        last_name: Joi.optional(),
        facebookId: Joi.optional(),
        googleId: Joi.optional(),
        email: Joi.string().email().required(),
        created_at: Joi.date().required(),
        avatar: Joi.optional(),
        role: Joi.string().required(),
        updated_at: Joi.date().required(),
        password: Joi.string().required()
      })
  
      let isError = user.validate(otherValue,{abortEarly: false})
      
      if(isError.error){
        let r = {}
        for (const detail of isError.error.details) {
          r[detail.path[0]] = detail.message
        }
        resolve(r)
      } else {
        resolve(false)
      }
    })
  }
  
  
  //? overwrite in Base class save method...
  // save() {
  //   console.log("hello")
  // }
}

export default User