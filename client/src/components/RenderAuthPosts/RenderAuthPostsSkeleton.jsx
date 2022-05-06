import React from 'react';
import PostSkeleton from "../../pages/postFilterPage/PostSkeleton";

const RenderAuthPostsSkeleton = () => {
	return (
		<div>
			{ new Array(5).fill(1).map((a, i)=>(
				<li className="my-4" key={i}><PostSkeleton /></li>
			)) }
		</div>
	);
};

export default RenderAuthPostsSkeleton;