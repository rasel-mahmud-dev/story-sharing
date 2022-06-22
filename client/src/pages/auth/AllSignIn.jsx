import React, {Suspense} from 'react';
import {Link, Route} from "react-router-dom";

import "./Login.scss"

import {backend} from "../../apis";


const AllSignInHome = ()=>{
	return (
		<div>
			<h1 className="mt-8 text-center md:text-5xl font-bold text-3xl dark_title">Welcome back.</h1>
			
			<div className="flex flex-col justify-center align-center mx-auto my-6" style={{maxWidth: "600px"}}>
				
				<a href={`${backend}/api/auth/social/login/google`} className="sign-in-btn  ">
					<svg xmlns="http://www.w3.org/2000/svg" width="16.783" height="17.127" viewBox="0 0 16.783 17.127">
						<path id="Icon_ionic-logo-google" data-name="Icon ionic-logo-google" d="M20.341,10.626l-.086-.367h-7.96v3.373H17.05a4.761,4.761,0,0,1-4.657,3.583A5.565,5.565,0,0,1,8.646,15.72a5.359,5.359,0,0,1-1.6-3.78A5.527,5.527,0,0,1,8.617,8.163,5.328,5.328,0,0,1,12.34,6.705a4.853,4.853,0,0,1,3.167,1.235L17.9,5.556a8.466,8.466,0,0,0-5.64-2.174h0a8.713,8.713,0,0,0-6.17,2.512,8.7,8.7,0,0,0-2.435,6.049A8.61,8.61,0,0,0,6,17.894a8.924,8.924,0,0,0,6.438,2.615,7.937,7.937,0,0,0,5.784-2.434,8.554,8.554,0,0,0,2.221-5.922A9.871,9.871,0,0,0,20.341,10.626Z" transform="translate(-3.656 -3.382)" fill="#ed3131"/>
					</svg>
					<h4 className="ml-2"> Sign in with Google</h4>
				</a>
				<a className="sign-in-btn"
					 href={`${backend}/api/auth/social/login/facebook`}>
					<svg xmlns="http://www.w3.org/2000/svg" width="18.526" height="18.414" viewBox="0 0 18.526 18.414">
						<path id="Icon_awesome-facebook" data-name="Icon awesome-facebook" d="M19.089,9.826A9.263,9.263,0,1,0,8.378,18.977V12.5H6.025V9.826H8.378V7.785a3.268,3.268,0,0,1,3.5-3.6,14.256,14.256,0,0,1,2.074.181V6.64H12.782a1.339,1.339,0,0,0-1.509,1.447V9.826h2.569L13.431,12.5H11.273v6.473A9.266,9.266,0,0,0,19.089,9.826Z" transform="translate(-0.563 -0.563)" fill="#4457ff"/>
					</svg>
					<h4 className="ml-2 ">Sign in with Facebook</h4>
				</a>
				<Link to="/auth/join/email" className="sign-in-btn">
					<svg
						xmlns="http://www.w3.org/2000/svg" width="17.507" height="13.892"
						viewBox="0 0 17.507 13.892">
						<g id="Icon_feather-mail" data-name="Icon feather-mail" transform="translate(-2.304 -5.5)">
							<path id="Path_1" data-name="Path 1"
								d="M4.611,6H17.5a1.616,1.616,0,0,1,1.611,1.611V17.28A1.616,1.616,0,0,1,17.5,18.891H4.611A1.616,1.616,0,0,1,3,17.28V7.611A1.616,1.616,0,0,1,4.611,6Z"
								fill="none" stroke="#000"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1"/>
							<path id="Path_2" data-name="Path 2" d="M19.114,9l-8.057,5.64L3,9"
								transform="translate(0 -1.389)"
								fill="none" stroke="#000"
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="1"/>
						</g>
					</svg>
					<h4 className="ml-2">Sign in with email</h4>
				</Link>
				
				<div className="mt-8 flex flex-col align-center">
					<h4 className="text-sm font-400 dark:text-gray-300 flex flex-col align-center sm:block ">
						<span className="cursor-pointer p-px ml-2">Not have a account ? </span>
						<Link to="/auth/join/new" className="text-blue-400">Create a account new account</Link>
					</h4>
				</div>
			
			</div>
		</div>
	)
}

const AllSignIn = () => {
	
	const [tryingEmail, setTryingEmail]  = React.useState("")
	
	
	return (
		<div>
			<div className="container-1200 min-h-viewport">
					<AllSignInHome />
					{/*{renderNestedRoutes()}*/}
				{/*</LoginStateContext.Provider>*/}
				
			</div>
		</div>
	);
};

export default AllSignIn;
