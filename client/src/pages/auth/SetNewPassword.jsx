import React from "react";
import {getApi} from "../../apis";
import {Link, useParams} from "react-router-dom";
import {useDispatch} from "react-redux"


let id;

const SetNewPassword = (props)=>{
	const { email: tryingEmail } = props
	
	const params = useParams()
	const dispatch = useDispatch()
	
	const [ actionState,  setActionState ] = React.useState({
		status: "", // 500 for error. 200 for success,
		message: ""
	})
	
	const [passwordData, setPasswordData] = React.useState({
		password: "",
		rePassword: ""
	})
	
	const [isSession, setSession] = React.useState(false)
	
	React.useEffect(()=>{
		if(params.token){
			getApi().post("/api/auth/password-reset-session-check", {token: params.token}).then(doc=>{
				if(doc.status === 200){
					setSession(true)
				}
			}).catch(ex=>{
				setSession(false)
			})
		}
	}, [params.token])
	
	function handleSubmit(e){
		e.preventDefault()
		
		setActionState({
			status: 0,
			message: ""
		})
		
		if(passwordData.password && passwordData.rePassword){
			if(passwordData.password !== passwordData.rePassword){
				setActionState({
					status: 400,
					message: "Password doesn't match"
				})
				return
			}
			
			if(!params.token){
				setActionState({
					status: 400,
					message: "Please Re send Mail. Because this session are corrupted"
				})
			}
			
			getApi().post("/api/auth/password-reset-session-check", {token: params.token}).then(doc=>{
				if(doc.status === 200){
					getApi().post("/api/auth/reset-password", {
						token: params.token,
						password: passwordData.password
					}).then(r => {
						
						if(r.status === 201){
							id && clearTimeout(id)
							setActionState({
								status: 200,
								message: "Your password change success"
							})
							
							id = setTimeout(()=>{
								dispatch({
									type: "LOGIN",
									payload: r.data
								})
							}, 1000)
							
						}
					}).catch(ex=>{
						setActionState({
							status: 400,
							message: "Password reset session is finished"
						})
					})
				}
			}).catch(ex=>{
				setSession(false)
			})

		} else {
			setActionState({
				status: 400,
				message: "Please fill up both field"
			})
		}
	}
	
	function onChange(e){
		setPasswordData({
			...passwordData,
			[e.target.name]: e.target.value
		})
	}
	
	return (
		<div className="container-1000 mx-auto">
			
			<div className="px-6 py-4 mt-4 rounded-5 max-w-xl mx-auto">
			
			{isSession ? (
					<div>
						<h2 className="font-bold mb-1 text-center text-xl dark_title  ">Set New Password</h2>
						
						
							{ actionState.message && (
								<div className={["p-3 bg-opacity-50", actionState.status <= "200" ? "bg-primary": "bg-red-400 "  ].join(" ")}>
								<p>{actionState.message}</p>
						</div>
							) }
						
						
						<form onSubmit={handleSubmit} className="py-5">
							
						
							<div className=" flex mb-2 flex-col">
								<label
									className="mb-1 font-medium dark:text-dark-0 min-w-100px block text-sm font-400 text-gray-dark-4 required"
									htmlFor="">New Password</label>
								<input
									onChange={onChange}
									value={passwordData.password}
									placeholder="Enter new password."
									className="input-elem dark:bg-dark-600 dark:text-gray-300"
									type="text"
									name="password"
								/>
							</div>
							<div className=" flex mb-3 flex-col mt-3">
								<label
									className="mb-1 font-medium min-w-100px block text-sm font-400 text-gray-dark-4 dark:text-dark-0 required"
									htmlFor="">Re New Password</label>
								<input
									onChange={onChange}
									value={passwordData.rePassword}
									placeholder="Enter new password."
									className="input-elem dark:bg-dark-600 dark:text-gray-300"
									type="text"
									name="rePassword" />
							</div>
							
							<div>
								<button type={"submit"} className="btn shadow-md dark_subtitle dark:bg-dark-600">Change Password</button>
							</div>
						</form>
					</div>
			) : (
				<div>
					<h2 className="font-bold mb-4">Session Expires</h2>
					<p>Your Password reset session end. please retry password reset request to click forget password button.</p>
					
					<span className="cursor-pointer text-blue-400 p-px">
						<Link to="/auth/join/reset-password">Forget password ?</Link>
					</span>
					
				</div>
			)}
			
			
		</div>
		</div>
	)
}

export default SetNewPassword