import React, {useEffect, Suspense} from "react";
import {Link, Outlet, Route, useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux"
import { loginUser } from "src/store/actions/authAction";

import "./Login.scss"
// import ReactLazyPreload from "../../utils/ReactLazyPreload";

import api from "../../apis";
import TakeUserInputStep from "./TakeUserInputStep";
import validateEmail from "../../utils/validateEmail";
import LoginStateContext from "./loginStateContext";
import ProgressBar from "react-topbar-progress-indicator";
// const ForgetPassword = ReactLazyPreload(()=>import("src/pages/auth/ForgetPassword"));
// const SetNewPassword = ReactLazyPreload(()=>import("src/pages/auth/SetNewPassword"));
//



const LoginWithEmail = (props) => {
	
	const dispatch = useDispatch()
	// const history = useHistory()
	const navigate = useNavigate()
	
	const context = React.useContext(LoginStateContext)

	const [message, setMessage] = React.useState("")
	const [buttonState, setButtonState] = React.useState({
		"continue": false
	})
	
	const [fetchLoading, setFetchLoading] = React.useState(false)
	
	const [userData, setUserData] = React.useState({
		email: "rasel2@gmail.com",
		password: "123",
	})
	
	
	function handlePreviousStep(){
		if(message){
			setMessage("")
		}
		if(stepNumber > 0) {
			setStepNumber(stepNumber - 1)
		}
	}
	
	const [stepNumber, setStepNumber] = React.useState(0)
	
	const stepData = [
		{
			step: 0,
			name: "email",
			label: "Your E-mail",
			type: "email",
			btnLabel: "Continue",
			handleNextStep: ()=>{
				setMessage("")
				return new Promise(async (r, s)=>{
					try {
						let isValidMail = validateEmail(userData.email)
						if(userData.email){
							if(!isValidMail){
								setMessage("Bad Mail format")
								return
							}
						}
						setFetchLoading(true)
						let response = await api.get(`/api/auth/user/${userData.email}`)
						if (response.status === 200){
							setUserData({
								...userData,
								avatar: response.data.user.avatar
							})
							setFetchLoading(false)
							setStepNumber(1)
							
							context.action({email: userData.email})   // pass email if your visit forgot password page
							
						} else {
							setFetchLoading(false)
							setMessage(response.data.message)
						}
						
					} catch (ex){
						setFetchLoading(false)
						setMessage(ex.response ? ex.response.data.message : "Network fail")
						// if(ex.response.status === 404){
						// 	r(true) /// this email not registered
						// } else {
						// 	s(ex.message)
						// }
					}
				})
			},
		},
		{
			step: 1,
			name: "password",
			label: "Your Password",
			type: "password",
			btnLabel: "Login",
			handlePreviousStep,
			renderUserInfo: ()=>(
				<div className="flex align-center justify-center">
					<img src={userData.avatar} alt="user" className="w-6 rounded-full flex"/>
					<h4 className="ml-1 text-sm font-medium dark_subtitle">{userData.email}</h4>
				</div>
			),
			renderBottomInfo:()=>(
				<div className="flex justify-center">
					<span className="text-center cursor-pointer text-blue-400">
	 				<Link className="text-center" to="/auth/join/reset-password">Forget password ?</Link>
	 			</span>
				</div>
			),
			handleNextStep: ()=>{
				setMessage("")
				return new Promise(async (r, s)=>{
					try {
						setFetchLoading(true)
						loginUser(userData, dispatch, (err) => {
							if (err) {
								setFetchLoading(false)
								setMessage(err)
							} else {
								setFetchLoading(false)
								navigate("/")
							}
						})
					
					} catch (ex){
						setFetchLoading(false)
						setMessage(ex.response ? ex.response.data.message : "Network fail")
						// if(ex.response.status === 404){
						// 	r(true) /// this email not registered
						// } else {
						// 	s(ex.message)
						// }
					}
				})
			},
		}
	]
	
	
	function handleChange(e) {
		if(!buttonState.continue){
			setButtonState({...buttonState, continue: true})
		}
		setUserData({
			...userData,
			[e.target.name]: e.target.value.trim()
		})
		if(e.target.name === "email"){
			context.action({email: e.target.value})
		}
	}
	
	function handleSubmit(e) {
		e.preventDefault()
		setMessage("")
		let complete = true;
		for (const userDataKey in userData) {
			if (!userData[userDataKey]) {
				complete = false
			}
		}
		if (complete) {
			if(userData.email === "rasel.mahmud.dev@gmail.com"){
				// alert("rasel.mahmud.dev@gmail.com")
			} else {
				loginUser(userData, dispatch, (err) => {
					if (err) {
						setMessage(err)
					} else {
						history.push("/")
					}
				})
			}
		} else {
			setButtonState({...buttonState, continue: false})
			setMessage("Password required.")
		}
	}


	return (
		<div>
			<div className="dark:bg-dark ">
				
				<div className="mt-8">
					<div className="mx-auto my-4" style={{maxWidth: "400px"}}>
						<h1 className="text-center mb-4 title text-3xl dark_title">Sign in with email</h1>
						<p className="text-center dark_subtitle">Enter the email address associated with your account,
							and we’ll send a magic link to your inbox.</p>
						
						{/*{step === 1 ? takeEmail() : takePassword()}*/}
						
						<TakeUserInputStep
							buttonState={buttonState}
							stepNumber={stepNumber}
							// handleNextStep={handleNextStep}
							// handlePreviousStep={handlePreviousStep}
							handleChange={handleChange}
							userData={userData}
							fetchLoading={fetchLoading}
							message={message}
							stepData={stepData[stepNumber]}
						/>
						
			
							<Link to="/auth/join"
										className="flex max-w-max rounded-full py-2 btn mx-auto px-5 mt-5 bg-gray-10 dark:text-gray-300 dark:bg-dark-500"
							>All sign in options</Link>
					
					</div>
					
					<div>
						<Suspense fallback={<ProgressBar/>}>
							<Outlet />
						</Suspense>
					</div>
					
					
					{/*{renderNestedRoutes()}*/}
				</div>
			
			</div>
		</div>
	);
};

export default LoginWithEmail;