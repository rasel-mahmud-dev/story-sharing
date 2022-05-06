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
		if(context.tryingEmail){
			setEmail(context.tryingEmail)
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
		return <form onSubmit={handleSubmit} className="py-5">
			<div className=" flex mb-2 flex-col">
				<label
					className="font-medium min-w-100px block mb-1 text-sm font-400 dark:text-dark-0 text-gray-dark-4 required"
					htmlFor="">Your Email</label>
				<input
					onChange={(e) => setEmail(e.target.value)}
					value={email}
					placeholder="Enter Your Email."
					className="input-elem dark:bg-dark-600 dark_subtitle" type="text" name="email"/>
			</div>
			
			<div>
				<button className="btn dark:text-dark-0  dark_subtitle dark:bg-dark-600 text-gray-dark-4">Send a mail</button>
				<Link to="/auth/join/email" type="button" className="ml-2 btn  dark_subtitle dark:bg-dark-600 dark:text-dark-0 text-gray-dark-4">Back to login</Link>
			</div>
		</form>
	}
	
	return (
		<div>
			<h2 className="font-medium mb-4 dark_title">Reset Password</h2>
			
			<h4 className="min-w-100px block text-base font-400 text-dark-600 dark_subtitle">We will send you a mail. that can be reset your password</h4>
			
			{ sendMailState.status !== 200 ? 	(
				<div>
					{sendMailState && sendMailState.message && <div className="bg-gray-9 dark:bg-dark-400 p-2 min-h-40">
						<p className="text-red-400">{sendMailState.message}</p>
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