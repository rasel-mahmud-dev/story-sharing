import React, {useEffect, Suspense} from "react";
import {Link, useHistory, Switch, Route} from "react-router-dom";
import {useDispatch} from "react-redux"
import { loginUser } from "src/store/actions/authAction";
import {CSSTransition} from "react-transition-group";
import "./Login.scss"
import ReactLazyPreload from "../../utils/ReactLazyPreload";
import ProgressBar from "react-topbar-progress-indicator";
import api from "../../apis";
import TakeUserInputStep from "./TakeUserInputStep";
import validateEmail from "../../utils/validateEmail";
import LoginStateContext from "./loginStateContext";
const ForgetPassword = ReactLazyPreload(()=>import("src/pages/auth/ForgetPassword"));
const SetNewPassword = ReactLazyPreload(()=>import("src/pages/auth/SetNewPassword"));




const LoginWithEmail = (props) => {
	
	const dispatch = useDispatch()
	const history = useHistory()
	
	const context = React.useContext(LoginStateContext)

	const [message, setMessage] = React.useState("")
	const [buttonState, setButtonState] = React.useState({
		"continue": false
	})
	
	const [fetchLoading, setFetchLoading] = React.useState(false)
	
	const [userData, setUserData] = React.useState({
		email: "",
		password: "",
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
							context.setTryingEmail(userData.email) // pass email if your visit forgot password page
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
								history.push("/")
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
							<h4 className="text-sm font-400">Not have a account? asd
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
	

	// const takeEmail = ()=>{
	//
	// 	async function handleNextStep(e){
	// 		if(e.preventDefault) {
	// 			e.preventDefault()
	// 		}
	// 		setButtonState({...buttonState, continue: true})
	// 		if(userData.email){
	// 			let isValid = validateEmail(userData.email)
	// 			if (isValid) {
	//
	// 				setMessage("")
	//
	// 				// check email register or not using api call
	// 				try {
	// 					let response = await api.get(`/api/auth/user/${userData.email}`)
	// 					if (response.status === 200){
	// 						setUserData({
	// 							...userData,
	// 							avatar: response.data.user.avatar
	// 						})
	// 						setStep(2)
	// 					} else {
	// 						setMessage(response.data.message)
	// 					}
	// 				} catch (ex){
	// 					setMessage(ex.response ? ex.response.data.message : "Network fail")
	// 				}
	//
	// 			} else {
	// 				setButtonState({...buttonState, continue: false})
	// 				setMessage("Bad email format")
	// 			}
	//
	// 		} else {
	// 			setButtonState({continue: false})
	// 			setMessage("Please put your email")
	// 		}
	// 	}
	//
	// 	return (
	// 		<form className="flex justify-center flex-col mt-10 mb-4 flex-1" onSubmit={handleNextStep}>
	//
	// 			<div className="flex flex-col flex-1 px-10">
	// 				<label htmlFor="" className="text-center mb-2 text-base title dark_title">Your email</label>
	// 				<CSSTransition unmountOnExit={true} in={message} timeout={500} classNames="my-node" >
	// 					<label htmlFor="" className="error-label text-center mb-2 text-base title">{message}</label>
	// 				</CSSTransition>
	// 				<input
	// 					onChange={handleChange} name="email"  value={userData.email} type="email"
	// 							 className="material_input w-full text-center dark_subtitle" />
	// 			</div>
	//
	// 			<button type="submit"
	// 							className={["rounded-full  py-2 px-10 btn mt-4 w-min mx-auto bg-gray-10 dark:text-gray-300 dark:bg-dark-500",  !buttonState.continue  && "disable_btn"].join(" ")}
	// 			>Continue</button>
	//
	// 			<h4 className="text-sm font-400 mt-4 dark:text-gray-300 flex flex-col align-center sm:block ">
	// 				<span className="cursor-pointer p-px ml-2">Not have a account ? </span>
	// 				<Link to="/auth/join/new" className="text-blue-400">Create a account new account</Link>
	// 			</h4>
	//
	// 		</form>
	// 	)
	// }
	// const takePassword = ()=>{
	// 	return (
	// 		<form className="flex justify-center flex-col mt-10 mb-4 flex-1" onSubmit={handleSubmit}>
	// 			<div className="flex flex-col flex-1 px-10">
	//
	// 				<div className="mx-auto mb-4 flex align-center justify-center">
	// 					{ userData.avatar ? (
	// 							<img src={userData.avatar} alt="avatar" className="mr-2 w-5 rounded-full flex" />
	// 					) : (
	// 							<FontAwesomeIcon icon={faUserCircle} className="mr-1" />
	// 								) }
	// 					<span className="text-center font-medium dark_subtitle">{userData.email}</span>
	// 				</div>
	//
	//
	// 				<label htmlFor="" className="text-center mb-2 text-base title dark_subtitle">Your Password</label>
	// 				<CSSTransition unmountOnExit={true} in={message} timeout={500} classNames="my-node" >
	// 					<label htmlFor="" className="error-label text-center mb-2 text-base title">{message}</label>
	// 				</CSSTransition>
	// 				<input
	// 					onChange={handleChange} value={userData.password} name="password" type="password"
	// 							 className="material_input w-full text-center dark_subtitle" />
	// 			</div>
	//
	// 			<span className="mt-5 text-center cursor-pointer text-blue-400 p-px">
	// 				<Link className="text-center " to="/auth/login/reset-password">Forget password ?</Link>
	// 			</span>
	//
	// 			<div className="mt-4 flex justify-center">
	// 				<button type="button"  onClick={()=>setStep(1)} className="rounded-full py-2 btn w-min mx-1 px-5 bg-gray-10 dark:text-gray-300 dark:bg-dark-500">Back</button>
	// 				<button type="submit"
	// 								className={["rounded-full  px-10 btn  w-min  bg-gray-10 dark:text-gray-300 dark:bg-dark-500", !buttonState.continue && "disable_btn"].join(" ")}
	// 				>Login</button>
	// 			</div>
	// 		</form>
	// 	)
	// }
	//
	
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
					
					{/*{renderNestedRoutes()}*/}
				</div>
			
			</div>
		</div>
	);
};

export default LoginWithEmail;