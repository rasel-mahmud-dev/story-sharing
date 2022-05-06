import React from 'react';
import ReactLazyPreload from "../../utils/ReactLazyPreload";


// const Logs = ReactLazyPreload(() => import("./Server/logs/Logs"));
// const PortfolioPosts = ReactLazyPreload(() => import("./portfolioPosts/PortfolioPosts"));
//
// const AllPosts = ReactLazyPreload(() => import("src/pages/admin/allPosts/AllPosts"));
// const AddPostSimple = ReactLazyPreload(() => import("src/pages/admin/AddPostSimple"));
// const DatabaseFiles = ReactLazyPreload(() => import("./databaseFiles/DatabaseFiles"))
// const Login = ReactLazyPreload(() => import("src/pages/auth/Login"));
// const DashboardHome = ReactLazyPreload(() => import("src/pages/admin/DashboardHome"));


export const adminRoutes = [
	// {path: "/admin/dashboard", exact: true, component: DashboardHome},
	// {path: "/admin/dashboard/add-post/:postId", exact: true, component: AddPostSimple},
	// // {path: "/admin/dashboard/add-post/:id", exact: true },
	// {path: "/admin/dashboard/files", exact: true, component: DatabaseFiles},
	// {path: "/admin/dashboard/posts", exact: true, component: AllPosts},
	// {path: "/admin/dashboard", component: Login},
	// {path: "/admin/dashboard/add-post/:postId", component: Login},
	// {path:"/admin/dashboard/logs", component: Logs},
	// {path:"/admin/dashboard/portfolio", component: PortfolioPosts}
]

// const AdminRoutes = ({_id, isAuthLoaded}) => {
// 	return adminRoutes.map((route, i) => {
// 		return (
// 			<Route
// 				key={i}
// 				path={route.path}
// 				exact={route.exact}
// 				// component={route.component}
// 				render={(props) => {
// 						return _id ? <route.component authId={_id} {...props} /> : isAuthLoaded && "sdf"
// 					// if(route.unProtected) {
// 					//     return authState._id ?  <Redirect to={route.redirectUrl} /> : route.component
// 					//   } else {
// 					//   return  <Route exact={!!route.exact} component={route.component} path={route.path}/>
// 					// }
//
// 					}
// 				}
// 			/>
// 		)
// 	})
// };

// export default AdminRoutes;

// export const adminRoutes = [
// 	{path: "/admin/dashboard", exact: true, component: DashboardHome},
// 	// {path: "/admin/dashboard/add-post/:postId", exact: true, component: AddPost},
// 	{path: "/admin/dashboard/add-post/:id", exact: true, protected: true, redirectUrl: "/auth/join", component: AddPostSimple},
// 	{path: "/admin/dashboard/files", exact: true, component: DatabaseFiles},
// 	{path: "/admin/dashboard/posts", exact: true, component: AllPosts},
// 	{path: "/admin/dashboard", component: Login},
// 	{path: "/admin/dashboard/add-post/:postId", component: Login}
// ]
//
// const AdminRoutes = ({_id, isAuthLoaded}) => {
// 	return adminRoutes.map((route, i) => {
// 		if (route.protected) {
// 			return (
// 				<Route
// 					key={i}
// 					path={route.path}
// 					exact={route.exact}
// 					render={(props) => _id ? <route.component authId={_id} {...props} /> : isAuthLoaded && <Redirect to={route.redirectUrl}/>}
// 				/>
// 			)
// 		} else {
//
// 			return (
// 				<Route
// 					key={i}
// 					path={route.path}
// 					exact={route.exact}
// 					// component={route.component}
// 					render={(props) => {
// 						if (route.unProtected) {
// 							return _id
// 								? <Redirect to={route.redirectUrl}/>
// 								: <route.component {...props} />
// 						} else {
// 							return <route.component {...props} />
// 						}
// 						// if(route.unProtected) {
// 						//     return authState._id ?  <Redirect to={route.redirectUrl} /> : route.component
// 						//   } else {
// 						//   return  <Route exact={!!route.exact} component={route.component} path={route.path}/>
// 						// }
//
// 					}
// 					}
// 				/>
// 			)
//
// 		}
// 	})
// };
//
// export default AdminRoutes;