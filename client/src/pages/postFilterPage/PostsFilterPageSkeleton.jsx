import React from 'react';
import Skeleton from "../../components/UI/skeleton/Skeleton";
import RenderPostsSkeleton from "../../components/RenderPosts/RenderPostsSkeleton";

const PostsFilterPageSkeleton = () => {
	return (
		<div className="container-1000 mx-auto">
			<Skeleton className="mt-10">
				<Skeleton.Line width="100px" height="10px" radius="2px" />
				<Skeleton.Line width="100%" height="60px" className="mt-4" />
			</Skeleton>
		
			<div className="mx-20">
				<RenderPostsSkeleton />
			</div>
			
		</div>
	);
};

export default PostsFilterPageSkeleton;