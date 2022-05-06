import React, {useEffect, Suspense} from "react";
import {Link, useHistory, Switch, Route} from "react-router-dom";
import {useDispatch} from "react-redux"
import { loginUser } from "src/store/actions/authAction";
import {CSSTransition} from "react-transition-group";
import "./Login.scss"
import ReactLazyPreload from "../../utils/ReactLazyPreload";
import ProgressBar from "react-topbar-progress-indicator";

const ForgetPassword = ReactLazyPreload(()=>import("src/pages/auth/ForgetPassword"));
const SetNewPassword = ReactLazyPreload(()=>import("src/pages/auth/SetNewPassword"));

import {FontAwesomeIcon} from  "@fortawesome/react-fontawesome"
import {faEye} from "@fortawesome/pro-light-svg-icons";
import api from "../../apis";
import TakeUserInputStep from "./TakeUserInputStep";
import validateEmail from "../../utils/validateEmail";


const SignUp = (props) => {
	
	const dispatch = useDispatch()
	const history = useHistory()
	
	const [message, setMessage] = React.useState("")
	const [buttonState, setButtonState] = React.useState({
		"continue": false
	})
	const [userData, setUserData] = React.useState({
		firstName: "",
		lastName: "",
		email: "",
		password: "",
		confirmPassword: "",
	})
	const [fetchLoading, setFetchLoading] = React.useState(false)
	
	const [stepNumber, setStepNumber] = React.useState(0)
	
	const stepData = [
		{
			step: 0,
			name: "firstName",
			label: "First Name",
			type: "text",
			btnLabel: "Continue",
			handleNextStep: ()=>{
				setStepNumber(stepNumber + 1)
				setMessage("")
			},
		},
		{
			step: 1,
			name: "lastName",
			label: "Last Name",
			type: "text",
			btnLabel: "Continue",
			handlePreviousStep,
			handleNextStep: ()=>{
				setStepNumber(stepNumber + 1)
				setMessage("")
			},
		},
		{
			step: 2,
			// asyncValidator:  ()=>{
			// 	return new Promise(async (r, s)=>{
			// 			try {
			// 				let response = await api.get(`/api/auth/user/${userData.email}`)
			// 				if (response.status === 200) {
			// 					r(false)
			// 				} else {
			// 					r(true) /// this email not registered
			// 				}
			// 			} catch (ex){
			// 				if(ex.response.status === 404){
			// 					r(true) /// this email not registered
			// 				} else {
			// 					s(ex.message)
			// 				}
			// 			}
			// 	})
			// },
			name: "email",
			label: "Email",
			type: "email",
			btnLabel: "Continue",
			handlePreviousStep,
			handleNextStep: async ()=>{
				setMessage("")
				
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
					if (response.status === 200) {
						
						setMessage("User already registered")
						setFetchLoading(false)
					} else {
						 /// this email not registered
						setStepNumber(stepNumber + 1)
						setFetchLoading(false)
					}
					
				} catch (ex){
					/// this email not registered
					setStepNumber(stepNumber + 1)
					setFetchLoading(false)
				}
			},
		}
	]
	
	
	function handleChange(e) {
		// if(!buttonState.continue){
		// 	setButtonState({
		// 		...buttonState,
		// 		continue: true
		// 	})
		// }
		
		if(!e.target.value.trim()){
			if(!buttonState.continue){
				setButtonState({
					...buttonState,
					continue: false
				})
			}
		}
		setUserData({
			...userData,
			[e.target.name]: e.target.value
		})
	}
	
	function handleSubmit(e) {
		e.preventDefault()
		
		setMessage("")
		
		if (userData.password) {
			if (userData.password !== userData.confirmPassword){
				setMessage("Password not match")
			} else {
				setMessage("")
				
				let complete = true;
				for (const userDataKey in userData) {
					if (!userData[userDataKey]) {
						complete = false
					}
				}
				
				if (complete) {
	
						api.post("/api/auth/register", {
							first_name: userData.firstName,
							last_name: userData.lastName,
							email: userData.email,
							password: userData.password,
						}).then(response => {
							if(response.status === 201){
								dispatch({
									type: "LOGIN",
									payload: response.data
								})
								history.push("/")
							} else {}
							setMessage(response.data.message)
						})
							.catch(ex=>{
								if(ex.response){
									setMessage(ex.response.data.message)
								} else {
									setMessage(ex.message, " please try again")
								}
							})
					
				} else {
					setMessage("Required all field.")
				}
				
				
			}
		
		} else {
			setMessage("Password required.")
		}
	}

	
	function renderNestedRoutes(){
		return (
			<div className="px-3">
				<Switch>
					<Suspense fallback={<ProgressBar/>}>
						<Route exact={true} path="/auth/login">{loginComponentRender()}</Route>
						<Route
							path="/auth/login/reset-password"
							render={()=><ForgetPassword {...props} email={userData.email} />}
						/>
						<Route
							path="/auth/login/new-password/:token"
							render={()=><SetNewPassword {...props} email={userData.email} />}
						/>
					</Suspense>
				</Switch>
			</div>
		)
	}
	
	function loginComponentRender(){
		return (
			<div className="bg-white px-6 py-4 rounded-5 max-w-xl mx-auto">
				<h1 className="text-2xl font-400 text-gray-light-7 text-center mb-5">Login in your Account.</h1>
				
				<CSSTransition unmountOnExit={true} in={message} timeout={500} classNames="my-node" >
					<div className="error-alert">
						<h4>{message}</h4>
					</div>
				</CSSTransition>
				
				<form onSubmit={handleSubmit} className="py-5">
					<div className=" flex mb-2 flex-col md:flex-row">
						<label
							className="font-medium min-w-100px block text-sm font-400 text-gray-dark-4"
							htmlFor="">Email</label>
						<input
							onChange={handleChange}
							value={userData.email}
							placeholder="Enter Your Email."
							className="input-elem" type="text" name="email"/>
					</div>
					<div className="mb-2 flex flex-col md:flex-row ">
						<label className="font-medium min-w-100px block text-sm font-400 text-gray-dark-4 "
									 htmlFor="">Password</label>
						<input
							onChange={handleChange}
							value={userData.password}
							placeholder="Enter Your Password."
							className="w-full input-elem"
							type="text" name="password"
						/>
					</div>
					<div className="mt-4 mb-2 flex flex-col md:flex-row">
						<div>
							<h4 className="text-sm font-400">Not have a account?
								<span className="cursor-pointer text-blue-400 p-px ml-0.5 ">
                  <Link to="/auth/registration">Create a account new account</Link>
                </span>
							</h4>
							
							<span className="cursor-pointer text-blue-400 p-px">
                  <Link to="/auth/login/reset-password">Forget password ?</Link>
                </span>
						
						</div>
					</div>
					<div>
						<button className="btn">Login</button>
					</div>
				</form>
			</div>
		)
	}
	

	
	async function handleNextStep(e){
		let step = stepData[stepNumber]
		if(userData[step.name]){
			if(step.name === "email"){
				if(validateEmail(userData.email)){
					setMessage("")
					if(step.asyncValidator){
						try{
							let isValid = await step.asyncValidator()
							// check uniq email
							if(isValid){
								setStepNumber(stepNumber + 1)
							} else {
								setMessage("User already exists")
							}
						} catch (ex){
							setMessage(ex)
						}
					}
			
				} else{
					setMessage("Bad email format")
				}
				return
			}
			setStepNumber(stepNumber + 1)
			setMessage("")
			
		} else {
			setMessage(step.label + " Required.")
		}
	}
	function handlePreviousStep(){
		if(message){
			setMessage("")
		}
		if(stepNumber > 0) {
			setStepNumber(stepNumber - 1)
		}
	}
	
	// const takeUserName = ()=>{
	//
	// 	function handleNextStep(){
	// 		if(userData.email){
	// 			let isValid = validateEmail(userData.email)
	// 			if (isValid) {
	// 				setStep(2)
	// 				setMessage("")
	// 			} else {
	// 				setMessage("Bad email format")
	// 			}
	//
	// 		} else {
	// 			setMessage("Please put your email")
	// 		}
	// 	}
	//
	// 	return (
	// 		<form className="flex justify-center flex-col mt-10 mb-4 flex-1">
	//
	// 			<div className="flex flex-col flex-1 px-10">
	// 				<label htmlFor="" className="text-center mb-2 text-base title">Your email</label>
	// 				<CSSTransition unmountOnExit={true} in={message} timeout={500} classNames="my-node" >
	// 					<label htmlFor="" className="error-label text-center mb-2 text-base title">{message}</label>
	// 				</CSSTransition>
	// 				<input onChange={handleChange} name="email"  value={userData.email} type="email" className="material_input w-full text-center" />
	// 			</div>
	//
	// 			<button type="button" onClick={handleNextStep} className="rounded-full  py-2 px-10 btn mt-4 w-min mx-auto bg-gray-10">Continue</button>
	// 		</form>
	// 	)
	// }
	//
	// const takePassword = ()=>{
	// 	return (
	// 		<form className="flex justify-center flex-col mt-10 mb-4 flex-1" onSubmit={handleSubmit}>
	// 			<div className="flex flex-col flex-1 px-10">
	//
	//
	// 				<span className="text-center font-medium mb-4">{userData.email}</span>
	//
	//
	// 				<label htmlFor="" className="text-center mb-2 text-base title">Your Password</label>
	// 				<CSSTransition unmountOnExit={true} in={message} timeout={500} classNames="my-node" >
	// 					<label htmlFor="" className="error-label text-center mb-2 text-base title">{message}</label>
	// 				</CSSTransition>
	// 				<input onChange={handleChange} value={userData.password} name="password" type="password" className="material_input w-full text-center" />
	// 			</div>
	//
	// 			<span className="mt-5 text-center cursor-pointer text-blue-400 p-px">
	// 				<Link className="text-center" to="/auth/login/reset-password">Forget password ?</Link>
	// 			</span>
	//
	// 			<div className="mt-4 flex justify-center">
	// 				<button type="button"  onClick={()=>setStep(1)} className="rounded-full py-2 btn w-min mx-1 px-5 bg-gray-10">Back</button>
	// 				<button type="submit" className="rounded-full py-2 btn w-min mx-1 px-5  bg-gray-10">Login</button>
	// 			</div>
	// 		</form>
	// 	)
	// }
	//
	
	
	function finalStep(){
		
		function toggleShowPassword(e){
			if(e.target.parentNode && e.target.parentNode.children[0]){
				let inp = e.target.parentNode.children[0]
				if(inp.nodeName === "INPUT") {
					if(inp.type === "text") {
						inp.type = "password"
					} else{
						inp.type = "text"
					}
				}
			}
		}
		
		return (
			<div>
				<form className="flex justify-center flex-col mt-10 mb-4 flex-1" onSubmit={handleSubmit}>
					<div className="flex flex-col flex-1 px-10 justify-center">
						<h1 className="mt-6 mb-2 dark_subtitle">Account Overview</h1>
						
						<CSSTransition unmountOnExit={true} in={message} timeout={500} classNames="my-node" >
							<label htmlFor="" className="error-label text-center mb-2 text-base title">{message}</label>
						</CSSTransition>
						
						
						{ Object.keys(userData).slice(0, 3).map(key=>(
							<div>
								<li className="flex align-center">
									<h4 className="title font-medium mr-8 min-w-100px dark_subtitle">{key}: </h4>
									<span className="dark_gray">{userData[key]}</span>
								</li>
							</div>
						)) }
						
						<div className="mt-8">
							<h3 className="mb-4 dark_subtitle">Set up password</h3>
							{/*<label htmlFor="" className="text-center mb-2 text-base title">Password</label>*/}
							
							<div className="flex flex-col flex-1 sm:flex-row">
								<label htmlFor="" className="text-sm title mr-2 min-w-100px  dark_subtitle">Password</label>
								<div className="flex box-input dark:bg-dark-600">
									<input onChange={handleChange} name="password"  value={userData.password}
												 type="password" className="w-full text-center dark_subtitle" />
									<span className="icon flex dark_subtitle" onClick={toggleShowPassword}>
										<FontAwesomeIcon onClick={toggleShowPassword}  className="pointer-events-none" icon={faEye} />
									</span>
								</div>
							</div>
							
							<div className="flex flex-col flex-1 sm:flex-row mt-2">
								<label htmlFor="" className="text-sm title mr-2 whitespace-nowrap min-w-100px  dark_subtitle">Re-Password</label>
								<div className="flex box-input  dark:bg-dark-600">
									<input
										onChange={handleChange}
												 name="confirmPassword"
										value={userData.confirmPassword}
										type="password"
										className="w-full text-center dark_subtitle"
									/>
									<span className="icon flex dark_subtitle" onClick={toggleShowPassword}>
										<FontAwesomeIcon className="pointer-events-none" icon={faEye} />
									</span>
								</div>
							</div>
						</div>
						
						
						{/*<CSSTransition unmountOnExit={true} in={message} timeout={500} classNames="my-node" >*/}
						{/*	<label htmlFor="" className="error-label text-center mb-2 text-base title">{message}</label>*/}
						{/*</CSSTransition>*/}
						{/*<input onChange={handleChange} name={name}  value={userData[name]} type={type} className="material_input w-full text-center" />*/}
					</div>
					
					<div className="mt-4 flex justify-center">
						<button type="button"
										onClick={handlePreviousStep}
										className="rounded-full py-2 btn w-min mx-1 px-5 bg-gray-10 dark:bg-dark-600 dark_subtitle"
						>Back</button>
						<button type="submit" className="rounded-full py-2 btn w-min mx-1 px-5  bg-gray-10 dark:bg-dark-600 dark_subtitle">Create</button>
					</div>
					
				</form>
			</div>
		)
	}
	
	
	return (
		<div>
			
			<div className="">
				
				<div className="mt-8">
					<div className="mx-auto my-4" style={{maxWidth: "400px"}}>
						<h1 className="text-center mb-4 title text-3xl dark_title">Create a account</h1>
						<p className="text-center dark_gray">Enter the email address associated with your account,
							and we’ll send a magic link to your inbox.</p>
						
						
						{ stepNumber <= 2 ? (
							<TakeUserInputStep
								buttonState={buttonState}
								stepNumber={stepNumber}
								handleNextStep={handleNextStep}
								handlePreviousStep={handlePreviousStep}
								handleChange={handleChange}
								userData={userData}
								fetchLoading={fetchLoading}
								message={message}
								stepData={stepData[stepNumber]}
							/>
						) :
							finalStep()
						}
						
						<Link to="/auth/join" className="flex max-w-max rounded-full py-2 btn mx-auto px-5 mt-10 bg-gray-10 dark:bg-dark-600 dark_subtitle">All sign in options</Link>
					
					</div>
					
					{/*{renderNestedRoutes()}*/}
				</div>
			
			</div>
		</div>
	);
};

export default SignUp;