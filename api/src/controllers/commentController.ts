import response from "../response";
import errorConsole from "../logger/errorConsole";
const shortid = require("shortid")

import {redisConnect} from "../database";
import Comment from "../models/Comment";
import {ObjectId} from "mongodb";
import User from "../models/User";


export const findComments = async (req, res, next)=>{
	
	if(req.user_id !== req.body.user_id){
		return response(res, 404, {message: "Unauthorized"})
	}
	let client;
	try {
		
		let { post_id,  user_id } = req.body
		
		
		const comments = await Comment.aggregate([
			{ $match: { post_id: new ObjectId(post_id) }},
			{ $lookup: {
					from: "users",
					localField: "user_id",
					foreignField: "_id",
					as: "user"
			}},
			{ $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
			{ $project: { user: { password: 0, email: 0, description: 0, role: 0, cover: 0, created_at: 0, updated_at: 0 } } }
		])
		
		response(res, 200, {comments: comments})
		
		// client = await redisConnect()
		
		// if(post_id && text && user_id && username) {
		//
		// 	// let comment = db.get('comments').find({ post_id: post_id, user_id: req.user_id }).value()
		// 	let newComment = {
		// 		id: shortid.generate(),
		// 		post_id,
		// 		text,
		// 		user_id,
		// 		username,
		// 		avatar,
		// 		created_at: new Date(),
		// 		reply: null
		// 	}
		//
		//
		// 	let isCommentAdded = await client.HSET('comments', newComment.id, JSON.stringify(newComment))
		// 	if(isCommentAdded){
		// 		response(res, 201, {newComment})
		// 	} else {
		// 		return response(res, 404, {message: "Incomplete Comment Data"})
		// 	}
		//
		// } else {
		// 	return response(res, 404, {message: "Incomplete Comment Data"})
		// }
		
		
	} catch (ex){
		errorConsole(ex)
		response(res, 500, "Internal server error")
	} finally {
		client?.quit()
	}
}


export const createComment = async (req, res, next)=>{
	
	if(req.user_id !== req.body.user_id){
		return response(res, 404, {message: "Unauthorized"})
	}
	let client;
	try {
		
		let { post_id, text, user_id } = req.body
		
		let newComment: any = new Comment({
			post_id: new ObjectId(post_id),
			user_id: new ObjectId(user_id),
			text: text,
			created_at: new Date(),
			parent_id: null
		})
		
		newComment = await newComment.save()
		let user = await User.findOne(
			{_id: new ObjectId(newComment.user_id)},
			{ projection: { first_name: 1, avatar: 1, username: 1}
			})
		response(res, 201, {...newComment, user: user})
		
		
	} catch (ex){
		errorConsole(ex)
		response(res, 500, "Internal server error")
	} finally {
		client?.quit()
	}
}


export const deleteComment = async (req, res, next)=>{
	
	let { comment_id, post_id, user_id } = req.body
	
	if(req.user_id !== user_id){
		return response(res, 404, {message: "Unauthorized"})
	}
	
	try {
		let deleted = await Comment.removeOne({_id: new ObjectId(comment_id), post_id: new ObjectId(post_id), user_id: new ObjectId(user_id)})
		if(deleted){
			response(res, 201, { comment_id: comment_id })
		}
		
	} catch (ex){
		errorConsole(ex)
		response(res, 500, "Internal server error")
		
	} finally {
	
	}
}
