import {useDispatch, useSelector} from "react-redux";
import React from "react";
import {deletePost, fetchPosts} from "../../store/actions/postAction";
import {getApi} from "../../apis";
import {Link, NavLink} from "react-router-dom";
import Writters from "./writters/Writters";

function DashboardHome(props){
	const postState = useSelector(state=>state.postState)
	
	const dispatch = useDispatch()
	
	React.useEffect(()=>{
		if(postState.posts && postState.posts.length === 0){
			fetchPosts(dispatch)
		}
	}, [])

	function handlePostDelete(id) {
		dispatch(deletePost(id))
	}
	
	function downloadBackup(){
		getApi().get("/api/backup", {responseType: "blob"}).then(r=>{
			const url = window.URL.createObjectURL(new Blob([r.data]));
			const link = document.createElement('a');
			link.href = url;
			link.setAttribute('download', 'backup.zip'); //or any other extension
			document.body.appendChild(link);
			link.click();
			link.remove()
		})
	}
	
	return (
		<div className="container px-4">
			<h1 className="my-2 dark_title">Admin Dashboard</h1>
			<Writters _id={props.authId} />
		</div>
	)
}

export  default DashboardHome