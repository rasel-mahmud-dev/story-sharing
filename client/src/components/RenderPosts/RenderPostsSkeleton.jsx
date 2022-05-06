import React from "react";
import Circle from "../UI/skeleton/Circle";
import Line from "../UI/skeleton/Line";


function RenderPostsSkeleton() {
	return new Array(5).fill(1).map((_, i) => (
		<div key={i}>
			<div className="my-8">
				<div className="flex justify-between">
					<div className="flex-4">
						<div className="my-1 flex align-center">
							<Circle width="30px" height="30px" className="mr-1 rounded-full" />
							<Line width="90%" height="18px" radius="4px" />
						</div>
						<div className="mt-2">
							<Line width="99%" height="15px" radius="4px" />
							<div>
								<Line width="100%" height="5px" radius="4px" className="mt-2" />
								<Line width="100%" height="5px" radius="4px" className="mt-0.5" />
								<Line width="100%" height="5px" radius="4px" className="mt-0.5" />
								<Line width="100%" height="5px" radius="4px" className="mt-0.5" />
								<Line width="100%" height="5px" radius="4px" className="mt-0.5" />
								<Line width="100%" height="5px" radius="4px" className="mt-0.5" />
								<Line width="99%" height="5px" radius="4px" className="mt-0.5" />
								<Line width="96%" height="5px" radius="4px" className="mt-0.5" />
								<Line width="93%" height="5px" radius="4px" className="mt-0.5" />
								<Line width="85%" height="5px" radius="4px" className="mt-0.5" />
								<Line width="84%" height="5px" radius="4px" className="mt-0.5" />
								<Line width="80%" height="5px" radius="4px" className="mt-0.5" />
							</div>
							<div className="mt-2 flex justify-between align-center">
								<Line width="50%" height="15px" radius="4px" className="mr-4" />
								<div className="flex flex-1">
									<Line width="60%" height="15px" radius="4px" className="mr-0.5" />
									<Line width="40%" height="15px" radius="4px" className="mr-0.5" />
									<Line width="100%" height="15px" radius="4px" className="mr-0.5" />
									<Line width="30%" height="15px" radius="4px" className="mr-0.5" />
									<Line width="30%" height="15px" radius="4px" className="mr-0.5" />
									<Line width="30%" height="15px" radius="4px" className="mr-0.5" />
									<Line width="20%" height="15px" radius="4px" className="mr-0.5" />
									<Line width="70%" height="15px" radius="4px" className="mr-0.5" />
									<Line width="60%" height="15px" radius="4px" className="mr-0.5" />
								</div>
							</div>
						
						</div>
					</div>
					
					{/*image shape*/}
					<div className="flex-1 ml-2">
						<Line width="100%" height="4px" radius="4px" className="mt-1" />
						<Line width="100%" height="4px" radius="4px" className="mt-1" />
						<Line width="100%" height="4px" radius="4px" className="mt-1" />
						<Line width="100%" height="4px" radius="4px" className="mt-1" />
						<Line width="100%" height="4px" radius="4px" className="mt-1" />
						<Line width="100%" height="4px" radius="4px" className="mt-1" />
						<Line width="100%" height="4px" radius="4px" className="mt-1" />
						<Line width="100%" height="4px" radius="4px" className="mt-1" />
						<Line width="100%" height="4px" radius="4px" className="mt-1" />
						<Line width="100%" height="4px" radius="4px" className="mt-1" />
						<Line width="100%" height="4px" radius="4px" className="mt-1" />
						<Line width="100%" height="4px" radius="4px" className="mt-1" />
						<Line width="100%" height="4px" radius="4px" className="mt-1" />
					</div>
				
				</div>
			</div>
		</div>
	))
}

export default RenderPostsSkeleton