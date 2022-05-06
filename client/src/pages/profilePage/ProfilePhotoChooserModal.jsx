import React, {useRef} from "react";
import blobToBase64 from "../../utils/blobToBase64";
import {getApi} from "../../apis";
import PropTypes from 'prop-types';


const PhotoEditor = (props)=>{
	const { element, onFinalImage } = props
	const [result, setResult] = React.useState("")
	const [canvasProp, setCanvasProp] = React.useState({
		originalWidth: "",
		originalHeight: "",
		sx: 0,
		sy: 0,
		sw: 0,
		sh: 0,
		dx: 0,
		dy: 0,
		dw: 200,
		dh: 200,
	})

	React.useEffect(()=>{
		
		if(element.current){
			
			
			createImage(
				element.current,
				element.current.naturalWidth,
				element.current.naturalHeight,
				null,
				null,
				null,
				null
			)
			
			setCanvasProp({
				...canvasProp,
				originalWidth: element.current.naturalWidth,
				originalHeight: element.current.naturalHeight
			})
			
		}
		
	}, [element.current])
	
	function handleZoom(e){
		createImage(
			element.current,
			element.current.naturalWidth,
			element.current.naturalHeight,
			canvasProp.sx,
			canvasProp.sy,
			Number(e.target.value),
			Number(e.target.value)
		)
		setCanvasProp({
			...canvasProp,
			sw: Number(e.target.value),
			sh: Number(e.target.value)
		})
	}
	
	function handleMoveY(e){
		createImage(
			element.current,
			element.current.naturalWidth,
			element.current.naturalHeight,
			canvasProp.sx,
			(canvasProp.originalHeight / 100 ) * Number(e.target.value),
			canvasProp.sw,
			canvasProp.sh
		)
		setCanvasProp({
			...canvasProp,
			sy: (canvasProp.originalHeight / 100 ) * Number(e.target.value)
		})
	}
	
	function handleMoveX(e){
		createImage(
			element.current,
			element.current.naturalWidth,
			element.current.naturalHeight,
			(canvasProp.originalWidth / 100 ) * Number(e.target.value),
			// (canvasProp.originalHeight / 100 ) * Number(e.target.value),
			canvasProp.sy,
			canvasProp.sw,
			canvasProp.sh,
		)
		setCanvasProp({
			...canvasProp,
			sx: (canvasProp.originalWidth / 100 ) * Number(e.target.value)
		})
	}
	
	function createImage(element, naturalWidth, naturalHeight,  sx, sy, sw, sh) {
		let canvas = document.createElement("canvas")
		let context = canvas.getContext("2d")
		let ow = naturalWidth
		let oh = naturalHeight
		canvas.width = 200
		canvas.height = 200
		context.drawImage(
			element,
			sx ? sx : (ow / 100 ) * (ow / 200),
			sy ? sy : (oh / 100) * (oh / 200),
			sw  ? sw : (ow / oh) * ( (ow / oh) * 1000),
			sh ? sh: (ow / oh) * ((ow / oh) * 1000),
			0,
			0,
			200,
			200
		)
		let s = canvas.toDataURL("image/jpeg", 0.5)
		onFinalImage && onFinalImage(canvas)
		setResult(s)
	}
	
	function renderController() {
		return (
			<div className="controller">
				<h4>You can adjust photo zoom and position</h4>
				<div className="flex flex-row">
					<label className="w-85">Zoom</label>
					<input onChange={handleZoom} className="zoom" min="0" max="3000" step="5" type="range" />
				</div>
				<div>
					<div className="flex flex-row">
						<label className="w-85">Move	X Axios</label>
						<input onChange={handleMoveX} className="position-x" min="0" max="100" step="1" type="range" />
					</div>
					<div className="flex flex-row">
						<label className="w-85" htmlFor="">Move Y Axios</label>
						<input onChange={handleMoveY} className="position-y" min="0" max="100" step="1" type="range" />
					</div>
				</div>
			</div>
		)
	}
	
	return (
		<div>
			{ result && (
				<div>
					<h4>Final Photo</h4>
						<div className="flex border border-gray-9 w-min">
							<img className="radius-100" src={result} alt="resut"/>
						</div>
				</div>
			) }
			
			{ element.current && <div className="mt-4">{renderController()}</div> }
		
		
		</div>
	)
}

const ProfilePhotoChooseModal = ({onCancel, onSuccess, whichPhoto})=>{
	
	const [photo, setPhoto] = React.useState({name: "", base64: "", canvasBase64: ""})
	const [photoBlob, setPhotoBlob] = React.useState()
	
	const [errorMessage, setErrorMessage] = React.useState("")
	const [canvas, setCanvas] = React.useState(null)
	
	const profileImageRef = useRef()
	
	function makeCanvas(imgElement){
		const canvas = document.createElement("canvas")
		const context = canvas.getContext("2d")
		let imageOriginalHeight = imgElement.naturalHeight
		let imageOriginalWidth =  imgElement.naturalWidth
		

		canvas.width = whichPhoto === "avatar" ? 200 : imageOriginalWidth
		canvas.height = whichPhoto === "avatar" ? 200 : imageOriginalHeight
		// canvas.getImageData
		// profileImageRef.current.parentElement.appendChild(canvas)
		// drawImage(image: CanvasImageSource, sx: number, sy: number, sw: number, sh: number, dx: number, dy: number, dw: number, dh: number): void;
		context.drawImage(
			imgElement,
			0,
			0,
			whichPhoto === "avatar" ? 200 : imageOriginalWidth,
			whichPhoto === "avatar" ? 200 : imageOriginalHeight
		)
		return canvas
	}
	
	function handleChange(e){
		let file = e.target.files[0]
		blobToBase64(file, (base)=>{
			setPhoto({name: file.name, base64: base, canvasBase64: ""})
			// setPhotoBlob(null)
		})
	}
	
	React.useEffect(()=>{
		if(profileImageRef.current){
			let canvas = makeCanvas(profileImageRef.current)
			let d = canvas.toDataURL("image/jpeg", 0.5)
			setPhoto({...photo, canvasBase64: d})
			canvas.toBlob((blob)=>{
				setPhotoBlob(blob)
			}, "image/jpeg", 0.5)
		}
	}, [photo.base64])
	
	
	function handleUploadProfilePhoto(e) {
		if(!photoBlob){
			setErrorMessage("Please Choose a Image")
			return
		}
		
		if(whichPhoto === "avatar"){
			if(canvas) {
				let formData = new FormData()
				canvas.toBlob((blob)=>{
					formData.append("avatar", blob, photo.name)
					getApi().post("/api/upload-profile-photo", formData).then(r => {
						if (r.status === 201) {
							setErrorMessage("Your Avatar Photo has been Changed...")
							onSuccess && onSuccess(r.data.avatar)
						}
					}).catch(ex => {
						setErrorMessage("Avatar Upload fail. Try Again")
					})
				}, "image/jpeg", 0.5)
				
				
			} else {
				setErrorMessage("Please Choose a Image")
			}
		} else {
			if(photoBlob) {
				let formData = new FormData()
				formData.append("cover", photoBlob, photo.name)
				getApi().post("/api/upload-profile-cover-photo", formData).then(r => {
					if (r.status === 201) {
						setErrorMessage("Profile cover photo has been changed...")
						onSuccess && onSuccess(r.data.avatar)
					}
				}).catch(ex => {
					setErrorMessage("Profile cover photo upload fail. Try Again")
				})
			} else{
				setErrorMessage("Please Choose a Image")
			}
		}
		
	}
	
	function cancelHandler() {
		onCancel && onCancel()
	}
	return (
		<div className="flex items-center flex-col overflow-y-auto" style={{maxHeight: "70vh"}}>
			<div>
				<h1>Choose a profile {whichPhoto === "avatar" ? "" : "cover"} photo</h1>
				<ul>
					{/*<li>photo size must be lower than 200kb</li>*/}
					<li>for better looking photo ratio should be {whichPhoto === "avatar" ? "1/1 (square)" : "1/4 (landscape)" } </li>
				</ul>
				
				{ errorMessage && (
					<div className="bg-red-400 my-4 py-3 px-2 text-white rounded">
						<p>{errorMessage}</p>
					</div>
				) }
				
				<div className="mt-4 mb-2">
					<input className="" accept="image/*" onClick={()=>setErrorMessage("")} type="file" onChange={handleChange} />
				</div>
				
				{/*  */}
				<div className="">
					{photo && photo.base64 && (
						<div>
							{ whichPhoto === "avatar" && <h4>Original Photo</h4> }
							<div className="w-300">
								<img ref={profileImageRef} className={["w-full", whichPhoto === "avatar" ? "" : "hidden" ].join(" ")} src={photo.base64} alt="profile_photo"  />
							</div>
						</div>
					)}
					{photo && photo.base64 && whichPhoto === "avatar" &&
						<PhotoEditor onFinalImage={(base64) => setCanvas(base64)} element={profileImageRef}/>
					}
				</div>
				
				
				{whichPhoto !== "avatar" && photo.canvasBase64 && (
					<div className="flex">
						<img className="w-full radius-1000" src={photo.canvasBase64} alt="profile_photo"  />
					</div>
				)}
				
				<div className="mt-4">
					<button onClick={handleUploadProfilePhoto} className="btn btn-primary" >Change {whichPhoto === "avatar" ? "Profile" : "Cover" } Photo</button>
					<button onClick={cancelHandler} className="ml-4 btn btn-primary" >Cancel</button>
				</div>
			</div>
		</div>
	)
}

export default ProfilePhotoChooseModal

ProfilePhotoChooseModal.propTypes  = {
	onCancel: PropTypes.func,
	onSuccess: PropTypes.func,
	// it as an enum.
	whichPhoto: PropTypes.oneOf(['cover', 'avatar'])
}