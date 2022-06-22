import response from "../response";
import errorConsole from "../logger/errorConsole";

import { Response} from "express";

import {ObjectId} from "mongodb";
import mongoose from "mongoose";
import {RequestWithAuth} from "../types";

const Comment = mongoose.model("Comment")
const User = mongoose.model("User")




export const findComments = async (req: RequestWithAuth, res: Response)=>{
	
	
	try {
		
		let { post_id  } = req.body
		
		const comments = await Comment.aggregate([
			{ $match: { postId: new ObjectId(post_id) }},
			{
				$lookup: {
					from: "users",
					localField: "userId",
					foreignField: "_id",
					as: "user"
				}
			},
			{ $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
			{ $project: { user: { password: 0, email: 0, description: 0, role: 0, cover: 0, createdAt: 0, updatedAt: 0 } } }
		])
		
		response(res, 200, {comments: comments})
		
		
	} catch (ex){
		errorConsole(ex)
		response(res, 500, "Internal server error")
	} finally {
	
	}
}

export const createComment = async  (req: RequestWithAuth, res: Response)=>{

	if(req.user_id !== req.body.user_id){
		return response(res, 404, {message: "Unauthorized"})
	}

	try {
		let { post_id, text, user_id } = req.body
		let newComment: any = new Comment({
			postId: new ObjectId(post_id),
			userId: new ObjectId(user_id),
			text: text,
			parentId: new ObjectId("000000000000000000000000"),
		})
		
		newComment = await newComment.save()
		let user = await User.findOne({_id: new ObjectId(newComment.userId)}).select("username avatar email")
		response(res, 201, {...newComment._doc, user: user})
		
	} catch (ex){
		errorConsole(ex)
		response(res, 500, "Internal server error")
		
	} finally {

	}
}

export const addCommentReaction = async  (req: RequestWithAuth, res: Response)=>{
	
	const { comment_id } = req.body
	
	if(!req.user_id){
		return response(res, 404, {message: "Unauthorized"})
	}
	
	try {
		
		let doc = await Comment.findByIdAndUpdate({_id: comment_id}, {
			$push: {
				likes: [req.user_id]
			}
		})
		
		if(doc){
			response(res, 201, {comment_id: comment_id})
		} else {
			response(res, 500, "Internal server error")
		}
		
	} catch (ex){
		errorConsole(ex)
		response(res, 500, "Internal server error")
	} finally {
	}
}

export const removeCommentReaction = async  (req: RequestWithAuth, res: Response)=>{
	
	const { comment_id } = req.body
	
	if(!req.user_id){
		return response(res, 404, {message: "Unauthorized"})
	}
	
	try {
		
		let doc = await Comment.findByIdAndUpdate({_id: comment_id}, {
			$pull: {
				likes: req.user_id
			}
		})
		
		if(doc){
			response(res, 201, {comment_id: comment_id})
		} else {
			response(res, 500, "Internal server error")
		}
		
	} catch (ex){
		errorConsole(ex)
		response(res, 500, "Internal server error")
	} finally {
	}
}

export const deleteComment = async  (req: RequestWithAuth, res: Response)=>{
	
	let { comment_id, post_id, user_id } = req.body
	
	if(req.user_id !== user_id){
		return response(res, 404, {message: "Unauthorized"})
	}
	
	try {
		let deleted = await Comment.deleteOne({_id: new ObjectId(comment_id), post_id: new ObjectId(post_id), user_id: new ObjectId(user_id)})
		if(deleted){
			response(res, 201, { comment_id: comment_id })
		}
		
	} catch (ex){
		errorConsole(ex)
		response(res, 500, "Internal server error")
		
	} finally {
	
	}
}


