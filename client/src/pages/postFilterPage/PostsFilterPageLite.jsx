import React, { Suspense } from 'react';
import ReactLazyPreload from "../../utils/ReactLazyPreload";
import PostsFilterPageSkeleton from "./PostsFilterPageSkeleton";
const PostsFilterPage = ReactLazyPreload(()=>import("./PostsFilterPage"))

const PostsFilterPageLite = () => {
	return (
		<div>
			<Suspense fallback={<PostsFilterPageSkeleton />}>
				<PostsFilterPage />
			</Suspense>
		</div>
	);
};

export default PostsFilterPageLite;