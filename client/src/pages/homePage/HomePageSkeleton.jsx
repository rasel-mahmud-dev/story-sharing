import React from 'react';
import TopHitsPostsSkeleton from "../../components/TopHitsPosts/TopHitsPostsSkeleton";
import Skeleton from "../../components/UI/skeleton/Skeleton";

const HomePageSkeleton = () => {
	return (
		<div>
			<div className="container-1000 mx-auto">
				
				<Skeleton>
					<Skeleton.Line className="w-4/5 h-6 mt-6" />
					<div className="mt-2">
						<Skeleton.Line  className="w-4/5 h-1 my-1" />
						<Skeleton.Line  className="w-4/5 h-1 my-1" />
						<Skeleton.Line  className="w-4/5 h-1 my-1" />
						<Skeleton.Line  className="w-3/5 h-1 my-1" />
						<Skeleton.Line  className="w-2/5 h-1 my-1" />
					</div>
					
					<Skeleton.Circle  className="w-full h-7 w-40 my-1 rounded-full mt-3" />
				
				</Skeleton>
				
				<div className="mt-10">
					<TopHitsPostsSkeleton />
				</div>

			</div>
			
		</div>
	);
};

export default HomePageSkeleton;