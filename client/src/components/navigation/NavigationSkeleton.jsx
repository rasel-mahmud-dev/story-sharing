import React from 'react';
import Line from "../UI/skeleton/Line";
import Circle from "../UI/skeleton/Circle";

import "./navigation_skeleton.scss"

const NavigationSkeleton = (props) => {
	return (
		
		<div>
			<div className="navigation_skeleton dark:bg-gray-900 flex align-center ">
				<div className="w-full mx-4">
					
					<div className="container-1200 mx-auto ">
						<div className="skeleton_group">
							
							<div className="flex justify-between">
								
								<div className="flex flex-1">
									<Circle  width="25px" height="25px" className=""  />
									<Line radius={4} width="40%" height="25px" className="ml-2" />
								</div>
								
								<div className="flex flex-1">
									<Line radius={4} width="70%" height="25px" className="" />
								</div>
								
								<div className="flex flex-1 justify-end">
									<Line radius={4} width="20%" height="25px" className="ml-2" />
									<Line radius={4} width="20%" height="25px" className="ml-2" />
									<Line radius={4} width="20%" height="25px" className="ml-2" />
									<Circle  width="25px" height="25px" className="ml-2"  />
									<Circle  width="25px" height="25px" className="ml-2"  />
								</div>
							</div>
						
						
						
						</div>
					</div>
				
				</div>
			</div>
			<div className="h-60" />
		</div>
		
		
	);
};

export default NavigationSkeleton;