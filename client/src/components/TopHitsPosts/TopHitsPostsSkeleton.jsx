import Circle from "../UI/skeleton/Circle";
import Line from "../UI/skeleton/Line";
import React from "react";

function TopHitsPostsSkeleton(){
	return new Array(7).fill(20).map((_, i) => (
		<div key={i} className="mx-4 my-8">
			<div className="flex align-center my-1">
				<Circle width="25px" height="25px" className="mr-1" />
				<Line width="70%" height="18px" radius="4px" />
			</div>
			<div className="mt-2">
				<Line width="100%" height="15px" radius="4px" />
				<Line width="100%" height="15px" radius="4px" className="mt-1" />
				
				<div>
					<Line className="h-1.5 rounded mt-2" />
					<Line className="h-1.5 rounded mt-0.5" />
					<Line className="h-1.5 rounded mt-0.5" />
					<Line className="h-1.5 rounded mt-0.5" />
					<Line className="h-1.5 rounded mt-0.5" />
					<Line className="h-1.5 rounded mt-0.5" />
					<Line className="h-1.5 rounded mt-0.5" />
				</div>
				<div className="mt-2">
					<Line width="60%" height="15px" radius="4px" className="mt-1" />
				</div>
			
			</div>
			<div>
			
			</div>
		</div>
	))
}

export default TopHitsPostsSkeleton