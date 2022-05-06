import React, { useState} from 'react';
import {useHistory, useParams} from "react-router-dom";
import qs from "query-string"
import {useDispatch} from "react-redux";
const AuthService = () => {
	
	const params = useParams()
	const history = useHistory()
	const dispatch = useDispatch()
	
	const queryString = qs.parse(history.location.search)
	
		React.useEffect( function (){
			
			if(queryString._id){
				dispatch({
					type: "LOGIN",
					payload: queryString
				})
				history.push("/")
			}
			
			(async function (){
				try{
					// let {data} = await api.get(`/api/auth/callback/${params.authServiceName}${history.location.search}`)
					// console.log(data)
					// console.log(data)
					// loginHandler(data, dispatch, (user)=>{
					// 	if(user && user._id){
					// 		history.push("/")
					// 	} else {
					// 		history.push("/auth/login?redirect=home")
					//
					// 	}
					// })
				} catch(ex){
					// history.push("/auth/login?redirect=home")
					
				}
			}())
			
			// setSize({width: window.innerWidth, height: window.innerHeight})
			// setOrientation(window.orientation)
			// // Listen for orientation changes
			// window.addEventListener("orientationchange", function() {
			//   // Announce the new orientation number
			//   setOrientation(window.orientation)
			// }, false);
			
			// window.addEventListener('resize', (e)=>{
			//   setSize({width: window.innerWidth, height: window.innerHeight})
			// })
		}, [queryString && queryString._id])
		
		
		
		return (
			<div className="container-1200 mx-4">
				
				<h1>hi</h1>
				
			</div>
		)
	};

export default AuthService;