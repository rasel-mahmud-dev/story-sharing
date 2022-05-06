import React from 'react';
import api from "../../../apis";
import Loader from "../../../components/UI/Loader";

const FileUploader = (props) => {
	
	const {onSetUrlToCover} = props
	
	const [errorMessage, setErrorMessage] = React.useState("")
	const [image, setImage] = React.useState({
		blob: null,
		base64: null,
	})
	
	const [loadingState, setLoadingState] = React.useState({
		isLoading: false,
		isUploaded: false,
		status: 200,
		message: "",
		uploadImageUrl: null
	})
	
	const imageInputRef = React.useRef()

	
	function handleFileChoose(e){
		let file = e.target.files[0]
		if(file){
			// setImage({...image, blob: file})
			let reader = new FileReader()
			reader.addEventListener('loadend',()=>{
				setImage({blob: file, base64: reader.result})
			})
			reader.readAsDataURL(file)
		}
	}
	
	function copyToClipboard() {
		
		if(!loadingState.uploadImageUrl){
			return
		}
		
		let value = loadingState.uploadImageUrl
		
		// Create a "hidden" input
		let aux = document.createElement("input");
		
		// Assign it the value of the specified element
		aux.setAttribute("value", value);
		
		// Append it to the body
		document.body.appendChild(aux);
		
		// Highlight its content
		aux.select();
		
		// Copy the highlighted text
		document.execCommand("copy");
		
		// Remove it from the body
		document.body.removeChild(aux);
	}
	
	
	// function handleClickToCopy() {
	// 	var copyText = image
	// 	var input = document.createElement('textarea');
	// 	input.innerHTML = copyText;
	// 	document.body.appendChild(input);
	// 	input.select();
	// 	var result = document.execCommand('copy');
	// 	document.body.removeChild(input);
	// 	setLoadingState({
	// 		isLoading: false,
	// 		id: "photo_upload",
	// 		status: 200,
	// 		message: "image link copied in clipboard",
	// 		uploadImageUrl: ""
	// 	})
	// }
	//
	//
	
	function handleUpload(e){
		if(!image.blob){
			setErrorMessage("Please choose a image")
			setImage({blob: null, base64: null})
			return
		}
		if((image.blob.size / 1000) <= 180){
			setLoadingState({
				isUploaded: false,
				status: 200,
				isLoading: true,
				message: "Uploading on server",
				uploadImageUrl: null
			})
			const file = image.blob
			let data = new FormData()
			data.append("photo", file, file.name)
			api.post("/api/upload-markdown-image", data).then(res=>{
				setLoadingState({
					isUploaded: true,
					isLoading: false,
					uploadImageUrl: res.data.path,
					status: 200,
					message: "Image upload success."
				})
			}).catch(ex=>{
				setLoadingState({
					isUploaded: false,
					isLoading: false,
					status: 400,
					uploadImageUrl: null,
					message: "Can't upload image. Try again."
				})
			})
			
		} else {
			setImage({blob: null, base64: null})
			setErrorMessage("Upload Image file size should be less than 180kb")
		}
	}
	
	function handleClearImage(){
		setImage({blob: null, base64: null})
		setErrorMessage("")
	}
	
	function handleSetUrlToCover(){
		if(loadingState.uploadImageUrl ) {
			onSetUrlToCover && onSetUrlToCover(loadingState.uploadImageUrl)
			setImage({blob: null, base64: null})
			setErrorMessage("")
			setLoadingState({
				isLoading: false,
				isUploaded: false,
				status: 200,
				message: "",
				uploadImageUrl: null
			})
		}
	}
	
	return (
		<div>
			
			{ loadingState.isLoading && (
				<div
					className={[loadingState.status === 200 ? "bg-primary/20 text-primary" : "bg-red-400/10 text-red-400", "px-4 py-1 my-2 flex flex-col items-center"].join(" ")}
				>
					<h3>{loadingState.message}</h3>
					<Loader/>
				</div>
			)}
			
			{ loadingState.isUploaded && (
				<div
					className="bg-primary/20 text-primary px-4 py-2 my-2 flex flex-col">
					<h4>{loadingState.message}</h4>
					<div className="flex ">
						<button className="mr-2 btn-primary w-max btn mt-2" onClick={handleSetUrlToCover}>Use This image as post cover</button>
						<button className="btn-primary w-max  btn mt-2" onClick={copyToClipboard}>Copy image url</button>
					</div>
				</div>
			)}
			
			
			<input onChange={handleFileChoose} type="file" accept="image/*" hidden={true} ref={imageInputRef}/>
			
			{ !image.base64 && <button type="button"
				onClick={()=>imageInputRef.current && imageInputRef.current.click()}
				className="btn  bg-primary text-white btn w-max-width mb-2">
				Upload a Image for Markdown Cover Link
			</button>}
			
			<div className="w-full">
				{ loadingState.uploadImageUrl ? (
					<div>
						<img src={loadingState.uploadImageUrl} className="w-full"  alt=""/>
					</div>
				) : image.base64 && <div>
						<img src={image.base64} className="w-full"  alt=""/>
					</div>
				
				}
				
				
				{ errorMessage && <div
					className="bg-red-400/10 text-red-400 px-4 py-1 my-2"
				>{errorMessage}</div> }
				{image.blob && (
					<div>
						<button type="button" onClick={handleUpload} className="btn bg-primary text-white btn-info btn w-max-width mt-2 mb-4 ">Upload It</button>
						<button type="button" onClick={handleClearImage} className="btn ml-3 bg-primary text-white btn-info btn w-max-width mt-2 mb-4 ">Clear Image</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default FileUploader;