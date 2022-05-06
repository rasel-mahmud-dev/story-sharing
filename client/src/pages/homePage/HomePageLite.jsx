import React, { Suspense } from 'react';
import ReactLazyPreload from "../../utils/ReactLazyPreload";
import HomePageSkeleton from "./HomePageSkeleton";

const HomePage = ReactLazyPreload(()=>import("./Homepage"))

const HomePageLite = () => {
	return (
		<div>
			<Suspense fallback={<HomePageSkeleton/>}>
				{/*<HomePageSkeleton/>*/}
				<HomePage />
			</Suspense>
			
		</div>
	);
};

export default HomePageLite;