// import React from 'react'
// import { matchPath, Link, withRouter } from 'react-router-dom'
//
//
// // import "./Preload.scss"
//
// import { publicRoutes } from "../Routes";
// // import {adminRoutes} from "../../pages/admin/AdminRoutes";
//
// const findComponentForRoute = (path, routes) => {
// 	const matchingRoute = routes.find(route =>
// 		matchPath(path, {
// 			path: route.path,
// 			exact: route.exact
// 		})
// 	);
// 	return matchingRoute ? matchingRoute.component : null;
// };
//
//
// let preloadLinks = []
//
//
// const PreloadLink = ({staticContext, to, delay, history, isActive, match, ...rest})=>{
// 	let id;
// 	let componentLoadTimeOutId;
// 	const [ loaded, isLoaded ] = React.useState(false)
// 	const [ isLoading, setLoading ] = React.useState(false)
//
//
// 	/** log warning message if not pass component preload promises */
// 	function preloadLog(message){
// 		console.info(`*********** ${message} *************`)
// 	}
//
//
// 	/** render normal route without preload component chunks */
// 	function normalRouteLoad(){
// 		preloadLog("component.preload function not return any promise, " +
// 			"we assume you are not using react lazy loading routing, " +
// 			"so you can simple use NavLink or Link"
// 		)
// 		preloadLinks = []
// 		// isLoaded(true)
//
// 		// * just nice delay loading bar
// 		id = setTimeout(()=>{
// 			setLoading(false)
// 		}, delay ? delay : 100 )
//
// 		// * delay route change loading bar
// 		if(delay){
// 			componentLoadTimeOutId = setTimeout(()=>{
// 				history.push(to)
// 			}, delay)
// 		} else{
// 			history.push(to)
// 		}
// 	}
//
//
// 	function preloadRouteComponent(path){
// 		/**
// 		 * Clear loading bar Timeout if
// 		 * double click before load component
// 		 * if supply delay timeout props
// 		 *
// 		 * */
// 		clearTimeout(id)
//
// 		/**
// 		 * Clear component load Timeout if
// 		 * double click before load component
// 		 * if supply delay timeout props
// 		 *
// 		 * */
// 		clearTimeout(componentLoadTimeOutId)
//
//
// 		setLoading(true)
// 		// isLoaded(false)
// 		// preloadLinks.push(path)
//
// 		let routes = [
// 			...adminRoutes,
// 			  ...publicRoutes,
//
// 		]
//
//
// 		const component = findComponentForRoute(path, routes);
//
// 		if (component && component.preload) {
//
// 		  const moduleLoadedPromise = component.preload()
// 		  /**
// 		    * check it preload function exist or not when import module with loadable component or react lazy
// 		    *  const ReactLazyPreload  = (importStatement)=>{
// 		    *    const Component:ComponentType = lazy(importStatement)
// 		    *     Component.preload = importStatement   // preload function return as promises
// 		    *     return Component
// 		    * }
// 		    *  Here lazy should be = loadable component or React lazy
// 		   */
//
// 		  if(moduleLoadedPromise){
// 		    moduleLoadedPromise.then(()=>{
// 		      if(delay){
// 		        setTimeout(()=>{
// 		          // isLoaded(true)
// 		          setLoading(false)
// 		          preloadLinks = []
// 		          history.push(path)
// 		        }, delay)
// 		      } else{
// 		        // isLoaded(true)
// 		        setLoading(false)
// 		        history.push(path)
// 		        preloadLinks = []
// 		      }
//
// 		    }).catch(err=>console.log("Something were wrong when preload component load", err))
//
//
// 		  } else{
// 		    /**
// 		     * Component.preload function not return promises So return normal Route without preload component
// 		     */
// 		    normalRouteLoad()
// 		  }
//
// 		} else {
// 		  normalRouteLoad()
// 		}
// 	}
//
// 	if(loaded){
// 		//? go to last clicked path
// 		// history.push(preloadLinks[preloadLinks.length - 1])
// 		preloadLinks = []
// 		isLoaded(false)
// 	}
//
// 	function routeChange(){
// 		if(loaded){
// 			return to
// 		} else {
// 			return  ""
// 		}
// 	}
//
// 	return (
// 		<div className="preload_route_link" >
// 			{ isLoading && <h1>Loading...</h1> }
// 			<Link
//
// 				className={"pointer-= " + isActive ? "active" : ""}
// 				// onClick={}
// 				onMouseDown={()=> preloadRouteComponent(to) }
// 				{...rest}
// 			/>
// 		</div>
// 	)
// }
//
//
// // export default preloadLink
// export default withRouter(({location, ...props})=>{
// 	const isActive = location?.pathname === props.to
// 	return <PreloadLink isActive={isActive}  {...props} />
// })
//
