import React from 'react';
import DashboardContext from "../dashboardContext";
import {getApi} from "../../../apis";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faTrash} from "@fortawesome/pro-solid-svg-icons";
import PreloadLink from "../../../components/preloadLink/PreloadLink";

const Writters = (props) => {
	const context = React.useContext(DashboardContext)
	React.useEffect(()=>{
		
		if( context.dashboardState.users && context.dashboardState.users.length === 0) {
			getApi().post("/api/auth/users", {adminId: props._id}).then(res => {
				if (res.status === 200) {
					context.actions.fetchUsers(res.data.users)
				}
			}).catch(ex => {
				console.log(ex)
			})
		}
	}, [])
	
	function handleDeleteUser(e){
		alert("User Delete not implement")
	}
	
	return (
		<div>
			<h1 className="dark_subtitle">All Writers</h1>
			
			{ context.dashboardState.users && context.dashboardState.users.map(user=>(
				
					<div className="flex justify-between my-2 hover:bg-primary hover:bg-opacity-10 px-2 py-1">
		
						<PreloadLink className="flex " to={`/author/profile/${user.first_name}/${user._id}`}>
							<div className="mr-1">
								<img src={user.avatar} className="w-5 h-5 rounded-full" alt=""/>
							</div>
							<div>
								<h3 className="hover:text-green-400 dark_subtitle dark:hover:text-green-400">{user.first_name}</h3>
								<h4>{user.email}</h4>
							</div>
						</PreloadLink>
						
						<div>
							<FontAwesomeIcon onClick={handleDeleteUser} icon={faTrash} className="cursor-pointer text-red-500" />
						</div>
					
					</div>
	
			)) }
			
		</div>
	);
};

export default Writters;