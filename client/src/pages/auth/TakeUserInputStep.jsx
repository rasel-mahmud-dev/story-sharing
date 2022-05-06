import React from "react";
import {CSSTransition} from "react-transition-group";
import Loader from "../../components/UI/Loader";

const TakeUserInputStep = (props)=>{
	const {
		handleChange, userData, message, stepNumber, stepData, fetchLoading
	} = props
	const {name, label, type, btnLabel, placeholder} = stepData
	
	const [isDisableNext, setIsDisableNext] = React.useState(true)
	
	const inputRef = React.useRef()
	
	React.useEffect(()=>{
		if(userData[name] && userData[name].trim()){
			setIsDisableNext(false)
		} else {
			setIsDisableNext(true)
		}
	}, [userData[name]])
	
	React.useEffect(()=>{
		inputRef.current && inputRef.current.focus()
	}, [stepNumber])
	
	// function handleNextStep(){
	// 	if(userData.email){
	// 		let isValid = validateEmail(userData.email)
	// 		if (isValid) {
	// 			setStep(2)
	// 			setMessage("")
	// 		} else {
	// 			setMessage("Bad email format")
	// 		}
	//
	// 	} else {
	// 		setMessage("Please put your email")
	// 	}
	
	function handleSubmit(e){
		e.preventDefault()
		if(stepData.handleNextStep){
			
			stepData.handleNextStep()
		} else{
			// handleNextStep && handleNextStep()
		}
		
	}
	
	
	return (
		<div>
			{ stepData.step === 3 ? (
				<div>sdf</div>
			) : (
				<div>
					
					<div className="mt-5 mb-3">
						{ stepData.renderUserInfo && stepData.renderUserInfo() }
					</div>
					
					<form className="flex justify-center flex-col  mb-4 flex-1" onSubmit={handleSubmit}>
						<div className="flex flex-col flex-1 px-10">
							<label htmlFor="input" className="text-center mb-2 text-base title dark_subtitle">{label}</label>
							<CSSTransition unmountOnExit={true} in={message} timeout={500} classNames="my-node" >
								<label htmlFor="" className="error-label text-center mb-2 text-base title">{message}</label>
							</CSSTransition>
							<input
								id="input"
								ref={inputRef}
								onChange={handleChange}
								name={name}
								value={userData[name]}
								type={type}
								className="material_input w-full text-center dark_subtitle"
							/>
						</div>
						
						
						
						{fetchLoading ? (
							<div className="flex justify-center flex-col my-4 ">
								<div className="mx-auto">
									<Loader />
								</div>
								<h4 className="text-sm font-medium text-primary text-center">Please wait...</h4>
							</div>
						) :  (
							<div className="mt-4 flex justify-center">
								{ stepNumber > 0 &&
									<button type="button" onClick={stepData.handlePreviousStep} className="rounded-full py-2 btn w-min mx-1 px-5 bg-gray-10 dark:bg-dark-600 dark_subtitle">Back</button>
								}
									<button type="submit"
										className={["rounded-full py-2 btn w-min" +
										" mx-1 px-5 bg-gray-10 " +
										"dark:bg-dark-600 " +
										"dark_subtitle", isDisableNext && "disable_btn"].join(" ")}>{btnLabel}
									</button>
								</div>
							)}
				
						{/*<button type="button" onClick={handleNextStep} className="rounded-full  py-2 px-10 btn mt-4 w-min mx-auto bg-gray-10">{btnLabel}</button>*/}
					</form>
					
					<div className="mt-3 mb-3">
						{ stepData.renderBottomInfo && stepData.renderBottomInfo() }
					</div>
				
				
				</div>
			)  }
		
		</div>
	)
}

export default TakeUserInputStep