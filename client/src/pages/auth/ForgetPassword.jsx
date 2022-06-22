import React from 'react';
import {Link} from "react-router-dom";
import {getApi} from "../../apis";
import validateEmail from "../../utils/validateEmail";
import LoginStateContext from "./loginStateContext";
import Loader from "../../components/UI/Loader";

const ResetPasswordForm = (props)=>{
	
	const context = React.useContext(LoginStateContext)
	
	const [ sendMailState,  setSendMailState ] = React.useState({
		status: "", // 500 for error. 200 for success,
		message: ""
	})
	
	
	const [httpProgress, setHttpProgress] = React.useState(false)
	const [email, setEmail] = React.useState("")
	
	React.useEffect(()=>{
		if(context.state.email){
			setEmail(context.state.email)
		}
	}, [])
	
	
	function handleSubmit(e){
		e.preventDefault()
		
		setSendMailState({
			status: 0,
			message: ""
		})
		
		if(email && email.trim()){
			let isMail = validateEmail(email.trim())
			if(isMail){
				setHttpProgress(true)
				getApi().post("/api/auth/send/mail", {to: email}).then(r =>{
					if(r.status === 201){
						setSendMailState({
							status: 200,
							message: r.data.message
						})
						setHttpProgress(false)
					}
				}).catch(ex=>{
					setSendMailState({
						status: 400,
						message: ex.response.data.message
					})
					setHttpProgress(false)
				})
			} else {
				setSendMailState({
					status: 400,
					message: "Invalid Email"
				})
				setHttpProgress(false)
			}
		} else {
			setSendMailState({
				status: 400,
				message: "Email is required"
			})
			setHttpProgress(false)
		}
	}
	
	function inputField(){
		return (
			<form className="flex justify-center flex-col  mb-4 mt-6 flex-1" onSubmit={handleSubmit}>
				<div className="flex flex-col flex-1 px-10">
				
					{/*<CSSTransition unmountOnExit={true} in={message} timeout={500} classNames="my-node" >*/}
					{/*	<label htmlFor="" className="error-label text-center mb-2 text-base title">{message}</label>*/}
					{/*</CSSTransition>*/}
					
					<input
						className="material_input w-full text-center dark_subtitle"
						onChange={(e) => setEmail(e.target.value)}
						value={email}
						placeholder="Enter Your Email."
						type="text"
						name="email"/>
					
				</div>
				
				<div className="flex justify-center mt-6">
					<button className="btn bg-gray-10 rounded-full px-4 py-1.5 dark:text-dark-0  dark_subtitle dark:bg-dark-600 text-gray-dark-4">Send a mail</button>
					<Link
						to="/auth/join/email"
						type="button"
						className="ml-2 btn bg-gray-10 rounded-full px-4 py-1.5 dark_subtitle dark:bg-dark-600 dark:text-dark-0 text-gray-dark-4">
						Back to login</Link>
				</div>
				
				
				
				{/*{fetchLoading ? (*/}
				{/*	<div className="flex justify-center flex-col my-4 ">*/}
				{/*		<div className="mx-auto">*/}
				{/*			<Loader />*/}
				{/*		</div>*/}
				{/*		<h4 className="text-sm font-medium text-primary text-center">Please wait...</h4>*/}
				{/*	</div>*/}
				{/*) :  (*/}
				{/*	<div className="mt-4 flex justify-center">*/}
				{/*		{ stepNumber > 0 &&*/}
				{/*		<button type="button" onClick={stepData.handlePreviousStep} className="rounded-full py-2 btn w-min mx-1 px-5 bg-gray-10 dark:bg-dark-600 dark_subtitle">Back</button>*/}
				{/*		}*/}
				{/*		<button type="submit"*/}
				{/*						className={["rounded-full py-2 btn w-min" +*/}
				{/*						" mx-1 px-5 bg-gray-10 " +*/}
				{/*						"dark:bg-dark-600 " +*/}
				{/*						"dark_subtitle", isDisableNext && "disable_btn"].join(" ")}>{btnLabel}*/}
				{/*		</button>*/}
				{/*	</div>*/}
				{/*)}*/}
				
				{/*<button type="button" onClick={handleNextStep} className="rounded-full  py-2 px-10 btn mt-4 w-min mx-auto bg-gray-10">{btnLabel}</button>*/}
			</form>
		)
		
	}
	
	return (
		<div>
			<h2 className="font-medium mb-4 dark_title">Reset Password</h2>
			
			<h4 className="min-w-100px block text-base font-400 text-dark-600 dark_subtitle">We will send you a mail. that can be reset your password</h4>
			
			{ sendMailState.status !== 200 ? 	(
				<div className="mt-4">
					{sendMailState && sendMailState.message && <div className="bg-gray-9 dark:bg-dark-400 p-2 min-h-20">
						<p className="text-red-400 text-center">{sendMailState.message}</p>
					</div>}
					{ httpProgress ? (
						<div className="flex items-center my-8">
							<Loader />
							<h3 className="text-sm dark_subtitle title">Sending a password reset request mail...</h3>
						</div>
					) : inputField()}
				</div>
			) : (
					<div className="mt-2">
						<p className="text-gray-500">Mail has been send. Please check your mail <a className="text-blue-600 mr-1" target="_blank" href="https://mail.google.com/mail">{email}</a>
						in between 30 minutes.
						</p>
					</div>
				)
			}
		</div>
	)
}


const ForgetPassword = (props) => {
	return (
		<div className="container-1000 mx-auto">
			
			<div className="px-6 py-4 mt-4 rounded-5 max-w-xl mx-auto">
			<ResetPasswordForm {...props} />
		</div>
		</div>
	);
};

export default ForgetPassword;