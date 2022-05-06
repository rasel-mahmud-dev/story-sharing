import React from 'react';
import "./styles.scss";
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {FontAwesomeIcon} from  "@fortawesome/react-fontawesome"
import {faFacebook, faGithub, faLinkedin, faYoutube} from "@fortawesome/free-brands-svg-icons";
import {faGlobe} from "@fortawesome/free-solid-svg-icons";
import PreLoad from "../UI/Preload/Preload";


const Footer = () => {
	let start = '2021-11-08T15:40:15.000Z'
	const appState = useSelector(state=>state.appState)
	
	return (
		<div className="bg-primary py-5 dark:bg-dark-900 hover:bg-primary">
			<div className="container-1200 px-4">
				<div className="footer text-center grid grid-cols-1 gap-y-4 sm:grid-cols-2 md:grid-cols-4 md:text-left ">
					<div>
						<h3 className="text-lg font-medium text-gray-200 mb-2">DEV STORY</h3>
						<a  className='text-gray-300 text-sm mb-2' href="https://rasel-code-dev.vercel.app" target="_blank">
							Hire Me
						</a>
						<h4><Link className="text-gray-300" to="/about" >About US</Link></h4>
						<div className="social flex py-2 justify-center md:justify-start">
							<li className="mr-2">
								<a href="https://www.facebook.com/raselmraju" target="_blank">
									<FontAwesomeIcon icon={faFacebook} />
								</a>
							</li>
							<li className="mr-2">
								<a href="https://github.com/rasel-code-dev" target="_blank">
									<FontAwesomeIcon icon={faGithub} />
								</a>
							</li>
							<li className="mr-4">
								<a href="https://www.linkedin.com/in/rasel-code-dev" target="_blank">
									<FontAwesomeIcon icon={faLinkedin} />
								</a>
							</li>
							<li className="mr-2">
								<a href="https://rasel-code-dev.vercel.app" target="_blank">
									<FontAwesomeIcon icon={faGlobe} />
								</a>
							</li>
						</div>
						
						<h4 className="text-base text-gray-300 mb-2">© {new Date().getFullYear()}, All Rights Reserved.</h4>
					</div>
					
					<div>
						<h3 className="text-md text-gray-200 mb-2">Quick Link</h3>
						<ul>
							<li className="text-sm"><Link className="text-gray-300" to="/auth/join" >Join</Link> </li>
							<li className="text-sm"><Link className="text-gray-300" to="/auth/add-post/null" >Create a Post</Link> </li>
						</ul>
					</div>
					
					<div>
						<h3 className="text-md text-gray-200 mb-2">Authors</h3>
						<ul>
							<li className="text-sm"> <PreLoad className="text-gray-300" to="/author/profile/rasel_mahmud/620ff9e25cb6c343543bebc5" >#Rasel Mahmud</PreLoad> </li>
							<li className="text-sm"> <PreLoad className="text-gray-300" to="/author/profile/Apele%20Mahmud/6214b0a899b30a904d70ae89" >#Apele Mahmud</PreLoad> </li>
						</ul>
					</div>
					
					<div>
						<h3 className="text-md text-gray-200 mb-2">Hottest Stories</h3>
						<ul>
							<li className="text-sm">  <Link className="text-gray-300" to="/search?tag=javascript" >#Javascript</Link> </li>
							<li className="text-sm">  <Link className="text-gray-300" to="/search?tag=react" >#React</Link> </li>
							<li className="text-sm">  <Link className="text-gray-300" to="/search?tag=mongodb" >#Databse</Link> </li>
							<li className="text-sm">  <Link className="text-gray-300" to="/search?tag=mysql" >#MySQL</Link> </li>
							<li className="text-sm">  <Link className="text-gray-300" to="/search?tag=loop" >#Loop</Link> </li>
						</ul>
					</div>
				
				</div>
				{/*<h4 className="title text-md text-white">Project Start ON {new Date(start).toLocaleString()}</h4>*/}
				{/* <div className="bg-gray-9 max-w-max mx-auto bg-opacity-50 rounded dark:bg-dark-800">*/}
				{/*    <div className="flex items-center justify-center text-gray-900  mt-4 md:mt-0">*/}
				{/*        <h4 className="px-2 py-1 font-normal text-sm  dark_subtitle">Today Hits {appState.visitors.day_visitor  ? appState.visitors.day_visitor : 0}  </h4>*/}
				{/*        <h4 className="px-2 py-1 text-sm font-normal  dark_subtitle">Total Visitor {appState.visitors.total_visitors ? appState.visitors.total_visitors : 0}  </h4>*/}
				{/*    </div>*/}
				{/*</div>*/}
			</div>
		</div>
	);
};

export default Footer;
