
import React, { Suspense } from 'react';
import ReactLazyPreload from "../../utils/ReactLazyPreload";
import AllSignInSkeleton from "./AllSignInSkeleton";
import {Outlet} from "react-router-dom";
import LoginStateContext from "./loginStateContext";

// const AllSignIn = ReactLazyPreload(()=>import("./AllSignIn"))

const AllSignInLite = () => {
	const [state, setState] = React.useState({})
	
	return (
		<LoginStateContext.Provider value={{state, action: (data)=>setState({...state, ...data})}}>
			<div>
				<Suspense fallback={<AllSignInSkeleton/>}>
					{/*<AllSignInSkeleton/>*/}
	
					
					<Outlet/>
					
				</Suspense>
			
			</div>
		</LoginStateContext.Provider>
	);
};

export default AllSignInLite;