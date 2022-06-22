import React, {Suspense} from 'react';
import { useParams} from "react-router-dom";
import api from "../../apis";

import "./profile_page.scss"

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"

import fullLink from "../../utils/fullLink";
import {useDispatch, useSelector} from "react-redux";
import {faFacebook, faGithub, faLinkedin, faTwitter} from "@fortawesome/free-brands-svg-icons";
import {faGlobe, faPen, faTrash, faUserCircle} from "@fortawesome/free-solid-svg-icons";
import blobToBase64 from "../../utils/blobToBase64";
import ProfileSkeleton from "./ProfileSkeleton";
import parseTextToHtml from "../../utils/parseTextToHtml";
import ReactLazyPreload from "../../utils/ReactLazyPreload";
import RenderAuthPostsLite from "../../components/RenderAuthPosts/RenderAuthPostsLite";
const ProfileEditor = ReactLazyPreload(()=>import("./ProfileEditor"));
const ProfilePhotoChooseModal = ReactLazyPreload(()=>import("./ProfilePhotoChooserModal"));
import PreloadLink from "src/components/UI/Preload/Preload"

const ProfilePage = (props) => {
	const params = useParams()
	
	const dispatch = useDispatch()
	const {authState, postState} = useSelector(state=>state)
	
	const profilePhotoInput = React.useRef()
	const profileCoverPhotoInput = React.useRef()
	
	let [author, setAuthor] = React.useState({})
	let [userPosts, setUserPosts] = React.useState(null)
	
	const [photo, setPhoto] = React.useState({
		cover: {base: '', blob: ''},
		avatar: {base: '', blob: ''},
	})
	
	
	const [photoChangeForm, setPhotoChossserForm] = React.useState("")
	
	
	React.useEffect(async ()=>{
		setAuthor({})
		setUserPosts(null)
		
		if(params.id) {
			let idx = postState.cacheUserProfile.findIndex(p => p._id === params.id)
			if (idx !== -1) {
				setAuthor(postState.cacheUserProfile[idx])
				setUserPosts(postState.cacheUserProfile[idx].posts ? postState.cacheUserProfile[idx].posts : [])
			} else {
				api.get(`/api/users/${params.id}`).then(response => {
					if (response.status === 200) {
						dispatch({type: "FETCH_USER_PROFILE", payload: response.data.user})
						setAuthor(response.data.user)
						
						
						// fetch user posts
						api.get(`/api/posts?author_id=${response.data.user._id}`)
							.then(response => {
								if (response.status === 200) {
									dispatch({
										type: "FETCH_USER_POSTS",
										payload: {userId: params.id, posts: response.data.posts}
									})
									setUserPosts(response.data.posts)
								}
							})
					}
				})
			}
		}
	}, [params.id])
	
	
	
	function uploadProfilePhoto(fieldName, blob){
		let data = new FormData()
		data.append(fieldName, blob, blob.name ? blob.name : "")
		api.post(`${fieldName === "avatar"
			? 'api/upload-profile-photo'
			: 'api/upload-profile-cover-photo'}`, data).then(r=>{
		}).catch(ex=>{
			// console.log(ex)
		})
	}
	
	
	function photoChangeHandler(e) {
		
		blobToBase64(e.target.files[0], (base)=>{
			if(base) {
				setPhoto({
					...photo,
					[e.target.name]: {
						base
					}
				})
				uploadProfilePhoto(e.target.name, e.target.files[0])
			}
		})
	}
	
	function togglePhotoChooserForm(which_photo, isOpen) {
		if(which_photo === "cover") {
			setPhotoChossserForm(isOpen ? which_photo : "")
		} else {
			setPhotoChossserForm(isOpen ? which_photo : "")
		}
		dispatch({
			type: "TOGGLE_APPMASK",
			payload: {
				as: "backdrop",
				isOpen: !!isOpen
			}
		})
	}
	
	async function coverPhotoUploadSuccess(path) {
		dispatch({
			type: "TOGGLE_APPMASK",
			payload: false
		})
		setPhotoChossserForm("")
		let response = await api.get(`/api/users/${params.id}`)
		if(response.status === 200) {
			setAuthor(response.data.user)
		}
	}
	async function avatarPhotoUploadSuccess(path) {
		dispatch({
			type: "TOGGLE_APPMASK",
			payload: false
		})
		setPhotoChossserForm("")
		let response = await api.get(`/api/users/${params.id}`)
		if(response.status === 200) {
			setAuthor(response.data.user)
		}
	}
	
	function renderCoverPhoto(){
		if(author.cover){
			return photo.cover.base
				? photo.cover.base
				: fullLink(author.cover)
			
		} else {
			return photo.cover.base
				? photo.cover.base
				: ""
		}
	}
	
	React.useEffect(()=>{
		return ()=>{
			setPhoto({
				cover: {base: '', blob: ''},
				avatar: {base: '', blob: ''},
			})
		}
	}, [])
	
	
	
	return (
		author._id ? <div>
				<div className="profile_hero_header background_cover"
						 style={{backgroundImage: `url(${renderCoverPhoto()})`}}>
					<div className="relative overlay">
						<input accept="image/*" onChange={photoChangeHandler} name="avatar" ref={profilePhotoInput}
									 type="file" hidden={true}/>
						<input accept="image/*" onChange={photoChangeHandler} name="cover" ref={profileCoverPhotoInput}
									 type="file" hidden={true}/>
						{authState._id === author._id && <button
							onClick={() => togglePhotoChooserForm("cover", true)}
							className="absolute right-2 top-2 btn bg-opacity-40 btn-outline text-white text-sm ">Change
							Cover</button>}
						
						<div className="container-1000 mt-0 mx-auto text-center overlay-title ">
							<div className="relative">
								<div className="post_cover text-center m-auto relative" style={{width: "100px"}}>
									{author.avatar ? (
										photo.avatar.base
											? <img className="w-full rounded-full" src={photo.avatar.base} alt=""/>
											:
											<img className="w-full rounded-full" src={fullLink(author.avatar)} alt=""/>
									) : (
										photo.avatar.base
											? <img className="w-full rounded-full" src={photo.avatar.base} alt=""/>
											: <FontAwesomeIcon className="text-9xl" icon={faUserCircle}/>
									)}
									{authState._id === author._id && <FontAwesomeIcon
										onClick={() => togglePhotoChooserForm("avatar", true)}
										className="absolute bottom-6 z-10 transform translate-x-1/2 right-1/2"
										icon={faPen}
									/>}
									{/*<button className="z-10  right-2 top-2 btn btn-outline bg-primary">Change Avatar</button>*/}
								</div>
							</div>
							
							<div>
								<h1>{author.first_name} {author.last_name}</h1>
								{/*<p className="leading-6 text-opacity-90 text-white">{author.description}</p>*/}
								<p className="leading-6 text-opacity-90 text-white"
									 dangerouslySetInnerHTML={{__html: author.description && parseTextToHtml(author.description)}}
								>
								</p>
								<div className="social flex justify-center">
									<li className="mr-2">
										<a href="https://www.facebook.com/rasel.mahmud.dev" target="_blank">
											<FontAwesomeIcon icon={faFacebook}/>
										</a>
									</li>
									<li className="mr-2">
										<a href="https://github.com/rasel-mahmud-dev" target="_blank">
											<FontAwesomeIcon icon={faGithub}/>
										</a>
									</li>
									<li className="mr-4">
										<a href="https://www.linkedin.com/in/rasel-mahmud-9869a2234" target="_blank">
											<FontAwesomeIcon icon={faLinkedin}/>
										</a>
									</li>
									<li className="mr-2">
										<a href="https://rasel-portfolio.vercel.app" target="_blank">
											<FontAwesomeIcon icon={faGlobe}/>
										</a>
									</li>
									
									{/*<FontAwesomeIcon icon={faFacebook} className='text-lg px-1.5 hover:text-primary'/>*/}
									{/*<FontAwesomeIcon icon={faTwitter}  className='text-lg px-1.5 hover:text-primary' />*/}
									{/*<FontAwesomeIcon icon={faGithub} className='text-lg px-1.5 hover:text-primary' />*/}
									{/*<FontAwesomeIcon icon={faGlobe} className='text-lg px-1.5 hover:text-primary' />*/}
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className="container-1000 px-4">
					<h4 className="title text-lg text-center mt-4 dark_subtitle">
						{/*{ authState._id  }*/}
						{userPosts ? userPosts.length : 0} Stories
						by {author.first_name} {author.last_name}</h4>
					
					
					<div className="user-content-wrapper">
						{authState._id === author._id &&
						<div className="my-4">
							{/*<Link className="btn btn-outline dark_subtitle " to="/admin/dashboard/add-post/null">Make A Post</Link>*/}
							<PreloadLink className="btn btn-outline dark_subtitle " to="/auth/add-post/null">Make A Post</PreloadLink>
						</div>
						}
						
						{/*// own posts start..........*/}
						<RenderAuthPostsLite
							userPosts={userPosts}
							_id={authState._id}
							dispatch={dispatch}
						/>
						{/*// own posts end..........*/}
						
						
						{ photoChangeForm && photoChangeForm === "cover" &&
						<div className="fixed profile-edit-form z-500 top-1/5 shadow_1 rounded-5">
							<div className="bg-white px-6 py-4 rounded-5 w-full mx-auto">
								<Suspense fallback={<div></div>}>
									<ProfilePhotoChooseModal
										onSuccess={coverPhotoUploadSuccess}
										whichPhoto={"cover"}
										onCancel={()=>togglePhotoChooserForm("cover", false)}
									/>
								</Suspense>
							</div>
						</div>
						}
						
						{ photoChangeForm && photoChangeForm === "avatar" &&
						<div className="fixed profile-edit-form z-500  shadow_1 rounded-5">
							<div className="bg-white px-10 py-5 rounded-5 w-full mx-auto dark:bg-dark-500">
								<Suspense fallback={<div></div>}>
									<ProfilePhotoChooseModal
										whichPhoto="avatar"
										onSuccess={avatarPhotoUploadSuccess}
										onCancel={()=>togglePhotoChooserForm("avatar", false)}
									/>
								</Suspense>
							</div>
						</div>
						}
						
						{ authState && author && author._id === authState._id &&
						<Suspense fallback={<div></div>}>
							<ProfileEditor dispatch={dispatch} author={author}/>
						</Suspense>
						}
					</div>
				</div>
			
			</div>
			: (
				<div className="container-1000">
					<ProfileSkeleton />
				</div>
			)) ;
};


export default ProfilePage;