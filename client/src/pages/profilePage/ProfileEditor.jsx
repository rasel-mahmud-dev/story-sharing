import React, {Suspense} from 'react';

import "./profle_editor.scss"

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faPen} from "@fortawesome/pro-light-svg-icons";
import {useDispatch} from "react-redux";
import ReactLazyPreload from "../../utils/ReactLazyPreload";


const  EditProfileFormModal = ReactLazyPreload(()=>import("./EditProfileFormModal"));




const ProfileEditor = (props) => {
	
	const { author } = props
	
	
	const [isShowProfileEditForm, setShowProfileEditForm] = React.useState(false)
	
	const dispatch = useDispatch()
	
	const [authorPassword, setAuthorPassword] = React.useState("")
	
	
	// React.useEffect(()=>{
	// 	if(author.id) {
	// 		getApi().get(`/api/get-auth-password?user_id=${author.id}`).then(res => {
	// 			if(res.status === 200){
	// 				setAuthorPassword(res.data)
	// 			}
	// 		})
	// 	}
	// }, [author.id])
	
	
	function renderProfile(){
		
		function eachItem(label, name){
			return (
				<li className="flex justify-between items-center bg-gray-9 my-2 py-2 pl-2 pr-2 rounded dark:bg-dark-700 ">
					<div className="flex items-center">
						<label className="font-medium min-w-100 block dark_subtitle"  htmlFor="">{label}</label>
						<span className="dark_gray">{ name}</span>
					</div>
					<div>
						{/*<FontAwesomeIcon icon={faPen} />*/}
					</div>
				</li>
			)
		}
		
		
	    return (
	        <div className="mt-6 mb-2">
						<div className="flex items-center">
						<h4 className="font-medium text-gray-900 text-lg mr-4 dark_subtitle">Profile Information</h4>
							<FontAwesomeIcon  className="cursor-pointer" onClick={handleProfileEditForm} icon={faPen} />
						</div>
						
						<div className=''>
							<div className=''>
								{eachItem("First Name:", author.first_name)}
								{eachItem("Last Name:", author.last_name)}
								{eachItem("Username:", author.username)}
								{eachItem("Email:", author.email)}
								
								
								{/*<li className="flex justify-between items-center bg-gray-9 my-2 py-2  pl-2 pr-2">*/}
								{/*	<div className="flex items-center">*/}
								{/*		<label className="min-w-100 block" htmlFor="">Password:</label>*/}
								{/*		<span>{ author.password }</span>*/}
								{/*	</div>*/}
								{/*	<div>*/}
								{/*		<FontAwesomeIcon*/}
								{/*			icon={faEye}*/}
								{/*			// onClick={()=> setOpenModal("password_change") }*/}
								{/*		/>*/}
								{/*	</div>*/}
								{/*</li>*/}
							</div>
						</div>
					</div>
	    )
	}
	
	function modalFormCloseHandler(){
		// setOpenModal("")
	}

	function handleProfileEditForm(isOpen=true) {

		if (!isOpen) {

			dispatch({
				type: "TOGGLE_APPMASK",
				payload: false
			})
			setShowProfileEditForm(false)
		} else {
			
			if (isShowProfileEditForm) {
				dispatch({
					type: "TOGGLE_APPMASK",
					payload: false
				})
				setShowProfileEditForm(false)
			} else {
				dispatch({
					type: "TOGGLE_APPMASK",
					payload: {
						as: "backdrop",
						isOpen: true
					}
				})
				setShowProfileEditForm(true)
			}
		}
	}
	

	
	return (
		<div >
			{ renderProfile()	}
			{ isShowProfileEditForm && (
				<Suspense fallback={<div>Loading...</div>}>
					<EditProfileFormModal
						author={author}
						handleProfileEditForm={handleProfileEditForm}
					/>
				</Suspense>
			)}
		</div>
	);
};






export default ProfileEditor;