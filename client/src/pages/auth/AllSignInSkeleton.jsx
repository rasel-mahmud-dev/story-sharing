
import React from 'react';
import Skeleton from "../../components/UI/skeleton/Skeleton";

const AllSignInSkeleton = () => {
	return (
		<div>
			<div className="container-1000 mx-auto">
				
				<div className="flex justify-center mx-4">
					<Skeleton>
						<Skeleton.Line className="w-4/5 h-10 mt-15 mb-10 mx-auto" />
						<Skeleton.Circle className="mx-auto h-9 w-40 my-1 rounded-full mt-3" />
						<Skeleton.Circle className="mx-auto h-9 w-40 my-1 rounded-full mt-3" />
						<Skeleton.Circle className="mx-auto h-9 w-40 my-1 rounded-full mt-3" />
					
						<div className="flex mx-auto justify-center">
							<div className="flex sm:w-2/5 w-3/5">
								<Skeleton.Line className="mr-4 w-4/5 h-5 mt-20 mb-10 mx-auto" />
								<Skeleton.Line className="w-4/5 h-5 mt-20 mb-10 mx-auto" />
							</div>
						
						</div>
					</Skeleton>
				</div>
				
			
			</div>
		
		</div>
	);
};

export default AllSignInSkeleton;