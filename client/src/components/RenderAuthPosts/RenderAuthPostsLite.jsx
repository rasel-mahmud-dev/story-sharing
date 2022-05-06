import React, {Suspense} from 'react';
import ReactLazyPreload from "../../utils/ReactLazyPreload";
import RenderAuthPostsSkeleton from "./RenderAuthPostsSkeleton";
const RenderAuthPosts = ReactLazyPreload(()=>import("src/components/RenderAuthPosts/RenderAuthPosts"))


const RenderAuthPostsLite = (props) => {
	return (
		<div> {
			!props.userPosts ? (
				<RenderAuthPostsSkeleton />
			) : (
				<Suspense fallback={<RenderAuthPostsSkeleton/>}>
					<RenderAuthPosts {...props} />
				</Suspense>
			) }
		</div>
	);
};

export default RenderAuthPostsLite ;