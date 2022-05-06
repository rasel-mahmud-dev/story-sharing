import React from 'react';
import api, {getApi} from "../../../apis";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faHeart, faMinus} from "@fortawesome/free-solid-svg-icons";
import {faStar} from "@fortawesome/pro-solid-svg-icons";


const PortfolioPosts = (props) => {
	
	const [portfolioPosts, setPortfolioPosts] = React.useState({
		allPosts: null,
		topPosts: null
	})
	
	
	React.useEffect(()=>{
		getApi().post("/api/admin/portfolio-posts", {}).then(res=>{
			setPortfolioPosts(s=>{
				return {...s,  allPosts: res.data}
			})

		}).catch(ex=>{
			console.log(ex)
		})
		getApi().post("/api/admin/portfolio-top-posts", {}).then(res=>{
			setPortfolioPosts(s=>{
				return {...s,  topPosts: res.data}
			})
		}).catch(ex=>{
			console.log(ex)
		})
	}, [])
	
	function addTopPost(post) {
		getApi().post("/api/admin/add-portfolio-top-post", {post_id: post._id}).then(r => {
			console.log(r)
			alert("/api/admin/add-portfolio-top-post ok")
		}).catch(err => {
			console.log(err)
		})
	}
	
	function addAllPost(post) {
		getApi().post("/api/admin/add-portfolio-all-post", {post_id: post._id}).then(r => {
			console.log(r)
			alert("/api/admin/add-portfolio-all-post ok")
		}).catch(err => {
			console.log(err)
		})
	}
	
	function removeTopPost(post){
		getApi().post("/api/admin/remove-portfolio-top-post", {post_id: post._id}).then(r=>{
			console.log(r)
			alert("/api/admin/remove-portfolio-top-post ok",)
		}).catch(err=>{
			console.log(err)
		})
	}
	function removeAllPost(post){
		getApi().post("/api/admin/remove-portfolio-all-post", {post_id: post._id}).then(r=>{
			console.log(r)
			alert("/api/admin/remove-portfolio-all-post ok",)
		}).catch(err=>{
			console.log(err)
		})
	}
	
	return (
		<div>
			<h1>PortFolio All Posts</h1>
				{  portfolioPosts.allPosts && portfolioPosts.allPosts.map((all, i)=>(
					<div className="flex justify-between hover:bg-gray-200" key={i}>
						<h4>{all.title}</h4>
						
						<div className="flex text-base">
							<button onClick={()=>removeAllPost(all)}>
								<FontAwesomeIcon icon={faMinus} />
							</button>
							<button onClick={()=>addTopPost(all)} className="ml-2">
								<FontAwesomeIcon icon={faHeart} />
							</button>
						</div>
						
					</div>
				)) }
			
			<h1>PortFolio Top Posts</h1>
			{  portfolioPosts.topPosts && portfolioPosts.topPosts.map((all, i)=>(
				<div className="flex justify-between hover:bg-gray-200" key={i}>
					<h2 className="text-base">{all.title}</h2>
				<div className="flex text-base">
					<button onClick={()=>removeTopPost(all)}>
						<FontAwesomeIcon icon={faMinus} />
					</button>
					
					<button onClick={()=>addAllPost(all)}   className="ml-2 font-bold">
						A
					</button>
				</div>
				</div>
			)) }
		
		
		</div>
	);
};

export default PortfolioPosts;