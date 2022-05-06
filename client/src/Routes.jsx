// import React, {lazy, Suspense} from "react";
// import {Redirect, Route, Switch} from "react-router-dom";
// import ReactLazyPreload from "./utils/ReactLazyPreload";
// import ProgressBar from "./components/UI/topProgressBar/TopProgressBar";
//
// import AddPostSkeleton from "./pages/admin/AddPostSkeleton";
//
// const AllSignInLite  = ReactLazyPreload(()=>import("./pages/auth/AllSignInLite"));
// const AuthService = ReactLazyPreload(()=>import("./pages/auth/AuthService"));
// const PostsFilterPageLite = ReactLazyPreload(()=>import("./pages/postFilterPage/PostsFilterPageLite"));
// const HomePageLite = ReactLazyPreload(()=>import("./pages/homePage/HomePageLite"));
// const About = ReactLazyPreload(()=>import("./components/about/About"));
//
// const PostDetailSimple = ReactLazyPreload(()=>import("./pages/postDetails/PostDetailSimple"));
// const AddPost = ReactLazyPreload(()=>import("src/pages/admin/AddPostSimple"));
// const Dashboard = ReactLazyPreload(()=>import("src/pages/admin/Dashboard"));
// const ProfilePageSimple = ReactLazyPreload(()=>import("src/pages/profilePage/ProfilePageSimple"));
//
// export const publicRoutes = [
//   { path: "/", exact: true, component: HomePageLite},
//   { path: "/search", exact: true, component: PostsFilterPageLite},
//   {
//     path: "/author/profile/:username/:id",
//     exact: true,
//     component: ProfilePageSimple
//   },
//   {path: "/posts/:slug/:id", exact: true, component: PostDetailSimple},
//   {path: "/about", exact: true, component: About},
//   {path: "/auth/callback/:authServiceName", exact: false, component: AuthService },
//   {
//     path: "/admin/dashboard",
//     component: Dashboard,
//     protected: true,
//     redirectUrl: "/auth/join",
//     authFetchInLoading: AddPostSkeleton
//   },  // nested routes
//   {
//     path: "/auth/add-post/null",
//     component: AddPost,
//     protected: true,
//     redirectUrl: "/auth/join",
//     authFetchInLoading: AddPostSkeleton
//   },  // nested routes
//   {
//     path: "/auth/join",
//     exact: false,
//     unProtected: true,
//     redirectUrl: "/",
//     component: AllSignInLite
//   }, // nested routes
// ]
//
// const Routes = (props)=> {
//
//   const { authState, isAuthLoaded } = props
//
//   return (
//     <Switch>
//       <Suspense fallback={<ProgressBar/>}>
//         {/*{routes(!!authState.id).map((route, i) => <Route key={i} {...route} />)}*/}
//
//         { publicRoutes && publicRoutes.map((route, i)=>{
//           if(route.protected){
//             return (
//               <Route
//                 key={i}
//                 path={route.path}
//                 exact={route.exact}
//                 render={(props) =>
//                   authState._id
//                     ? <route.component {...props} />
//                     : isAuthLoaded
//                       ? <Redirect to={route.redirectUrl} />
//                       : route.authFetchInLoading && <route.authFetchInLoading />  }
//               />
//             )
//           } else {
//
//             return (
//               <Route
//                 key={i}
//                 path={route.path}
//                 exact={route.exact}
//                 render={(props) =>{
//                   if(route.unProtected) {
//                     return authState._id
//                       ?  <Redirect to={route.redirectUrl} />
//                       : <route.component {...props} />
//                   } else {
//                     return  <route.component {...props} />
//                   }
//                 }}
//               />
//             )
//
//           }
//           // else {
//           //   return (
//           //     <Route exact={!!route.exact} component={route.component} path={route.path}/>
//           //   )
//           // }
//         })}
//
//
//         {/*<Redirect from="/admin/dashboard/add-post/:id" to="/auth/join" />*/}
//         {/*<Route path="/" exact={true} component={HomePage} />*/}
//         {/*<Route path="/admin/dashboard/add-post/:null" render={(props) =>{*/}
//         {/*  return authState._id ? <AddPost {...props} /> : <Redirect to="/signin" />*/}
//         {/*}} />*/}
//
//
//       </Suspense>
//     </Switch>
//   )
// }
//
//
// export default Routes