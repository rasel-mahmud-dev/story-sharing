
import React, { Suspense } from 'react';
import ReactLazyPreload from "../../utils/ReactLazyPreload";
import AllSignInSkeleton from "./AllSignInSkeleton";

const AllSignIn = ReactLazyPreload(()=>import("./AllSignIn"))

const AllSignInLite = () => {
	return (
		<div>
			<Suspense fallback={<AllSignInSkeleton/>}>
				{/*<AllSignInSkeleton/>*/}
				<AllSignIn />
			</Suspense>
		
		</div>
	);
};

export default AllSignInLite;