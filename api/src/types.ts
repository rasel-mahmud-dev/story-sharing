import {Request} from "express";


export type ObjectKeys<Type> = {
  [Property in keyof Type]: any;
};

export interface RequestWithAuth extends Request{
  user_id: any
  user_role?: any
}