import mongoose, {Schema} from 'mongoose';

import bcrypt from 'bcryptjs';
import {ObjectKeys} from "../types";

export interface UserType {
  _id?: string
  facebookId?: string;
  googleId?: string;
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  createdAt?: string;
  updatedAt?: string;
  avatar: string;
  cover?: string;
  role?: string
}

const schema: ObjectKeys<UserType> = {
  first_name: {
    type: String,
    required: [true, 'first_name required']
  },
  last_name: {
    type: String,
  },
  username:  {
    type: String,
  },
  email: {
    type: String,
    index: true,
    // validate: {
    //   validator: async function(v) {
    //   }
    // },
    required: [true, 'User Email required']
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    message: '{VALUE} is not supported'
  },
  password: { type: String },
  avatar: String,
  cover: String
}


const userSchema = new Schema(schema, {timestamps: true});


const filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/

userSchema.path('email').validate(async function(value) {
  
  if(filter.test(value)){
    let User = mongoose.model("User")
    let u = await User.findOne({email: value})
    
    if(u){
      throw new Error("This user already exist")
    } else {
      return true
    }
    
  } else {
    throw new Error("Bad email format")
  }
});

userSchema.pre('save', function(next) {
  const salt = bcrypt.genSaltSync(10);
  this.password = bcrypt.hashSync(this.password, salt)
  next()
});

mongoose.model("User", userSchema)

