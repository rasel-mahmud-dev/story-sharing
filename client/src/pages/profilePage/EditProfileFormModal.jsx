import React from "react";
import {getApi} from "../../apis";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEye} from "@fortawesome/pro-light-svg-icons";
import AlertHandler from "../../components/AlertHandler/AlertHandler";

function EditProfileFormModal(props) {
	
	const { handleProfileEditForm, author } = props
	
	const [loadingState, setLoadingState] = React.useState({isShown: false, message: "" })
	const [userProfile, setUserProfile] = React.useState({
		_id: "",
		username: "",
		email: "",
		description: "",
		first_name: "",
		last_name: "",
		oldPassword: "",
		newPassword: "",
		newConfirmPassword: ""
	})
	
	React.useEffect(()=>{
		setUserProfile({
			_id: author._id,
			username: author.username,
			email: author.email,
			first_name: author.first_name,
			last_name: author.last_name,
			description: author.description,
		})
	}, [author])
	
	
	function closeErrorMessage(){
		setLoadingState({
			...loadingState,
			isShown: false
		})
	}
	
	
	function handleChange(e) {
		setUserProfile({
			...userProfile,
			[e.target.name]: e.target.value
		})
	}
	
	function handleSubmit(e) {
		e.preventDefault()
		setLoadingState({message: "", isShown: false})
		
		let data = {
			username: userProfile.username ? userProfile.username.trim() : '',
			email: userProfile.email ? userProfile.email.trim() : '',
			first_name: userProfile.first_name ? userProfile.first_name.trim() : '',
			last_name: userProfile.last_name ? userProfile.last_name.trim() : '',
			description: userProfile.description ? userProfile.description.trim() : ''
		}
		
		if (userProfile.oldPassword && userProfile.newConfirmPassword && userProfile.newConfirmPassword ) {
			if(userProfile.newPassword  !== userProfile.newConfirmPassword){
				setLoadingState({
					message: "Please Check your password",
					isShown: true
				})
				return
			} else {
				data.newPassword = userProfile.newPassword.trim()
				data.oldPassword = userProfile.oldPassword.trim()
			}
		}
		
		getApi().post("/api/update-profile", data).then(res=>{
			if(res.status === 201){
				setLoadingState({
					isShown: true,
					message: res.data.message
				})
				setTimeout(()=>{
					handleProfileEditForm(false)
					setUserProfile({
						username: "",
						email: "",
						first_name: "",
						last_name: "",
						oldPassword: "",
						newPassword: "",
						newConfirmPassword: "",
						description: ""
					})
				}, 200)
			} else {
				setLoadingState({
					isShown: true,
					message: res.data.message
				})
			}
		}).catch(ex=>{
			setLoadingState({
				isShown: true,
				message: ex.response && ex.response.data.message ? ex.response.data.message : ex.message
			})
		})
	}
	
	function eachFormGroup(label, name, value, type="text", placeholder){
		
		let [isShowPass, setIsShowPass] = React.useState(false)
		
		function toggleShowPassword(){
			setIsShowPass(!isShowPass)
		}
		
		return (
			<div className="flex mb-2 flex-col md:flex-row">
				<label
					className="font-medium min-w-150 block text-sm font-400 text-gray-dark-4;"
					htmlFor="">{label}</label>
				
				<div className="input-elem flex items-center">
					<input
						autoComplete={false}
						aria-autocomplete={"none"}
						onChange={handleChange}
						value={value}
						placeholder={placeholder}
						className="outline-none w-full"
						type={ isShowPass ? "text" : type}
						name={name}
					/>
					{ type === "password" && <FontAwesomeIcon onClick={toggleShowPassword} icon={faEye} className="cursor-pointer text-gray-500" /> }
				</div>
			</div>
		)
	}
	
	return (
		<div className="fixed profile-edit-form z-500 top-1/3 shadow_1 rounded-5">
			<div className="bg-white px-6 py-4 rounded-5 w-full mx-auto">
				
				<AlertHandler
					message={loadingState.message} isShown={loadingState.isShown}
					onClick={closeErrorMessage} status={200} />
				
				
				<h1 className="text-lg font-400 text-gray-light-7 text-center mb-5 ">Edit Profile Information</h1>
				
				<form onSubmit={handleSubmit} className="py-1 w-full">
					
					<div className="grid w-full grid-cols-1 md:grid-cols-2  md:gap-x-4 lg:gap-x-16 ">
						
						{ eachFormGroup("First name", "first_name", userProfile.first_name, "", "Change first name")}
						{ eachFormGroup("Last name", "last_name", userProfile.last_name, "", "Change last name")}
						
						{ eachFormGroup("Username", "username", userProfile.username, "username", "Change Username")}
						{ eachFormGroup("Email", "email", userProfile.email, "email", "Change Email")}
						
						{ eachFormGroup("Current password", "oldPassword", userProfile.oldPassword, "password", "Enter your current password.")}
						{ eachFormGroup("New Password", "newPassword", userProfile.newPassword, "password", "Set your new password.")}
						
						{ eachFormGroup("Re-type new password", "newConfirmPassword", userProfile.newConfirmPassword, "password", "Re-type new password")}
						{/*{ eachFormGroup("Username", "username", userProfile.username, "password", "Change Username")}*/}
					</div>
					
					<div className="block">
						<label className="font-medium min-w-150 block text-sm font-400 text-gray-dark-4;" htmlFor="">About You</label>
						<div className="input-elem ">
						<textarea
							name="description"
							onChange={handleChange}
							defaultValue={userProfile.description}
							placeholder="About Your"
							className="outline-none w-full"
						>
						
						</textarea>
						
						</div>
					</div>
					
					<div className="mt-6">
						<button type="submit" className="btn">Update</button>
						<button onClick={()=>handleProfileEditForm(false)} type="button" className="btn ml-3">Cancel</button>
					</div>
				</form>
			</div>
		</div>
	)
}


export default EditProfileFormModal