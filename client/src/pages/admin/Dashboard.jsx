import React, {Suspense} from 'react';
import {NavLink, Switch} from "react-router-dom";
import {useSelector} from "react-redux";
import ProgressBar from "../../components/UI/topProgressBar/TopProgressBar";
import AdminRoutes from "./AdminRoutes";
import "./dashboard.scss"
import DashboardContext from "./dashboardContext";

const Dashboard = (props) => {
  const {authState, appState} = useSelector(state=> state)
  
  const [dashboardState, setDashboardState] = React.useState({
    users: [],
    markdownFiles: [],
    allPosts: []
  })
  
  
  
  const adminNav = [
    { to: "/admin/dashboard", exact: true, text: "Dashboard" },
    { to: "/admin/dashboard/add-post/null", exact: true, text: "Add Post" },
    { to: "/admin/dashboard/posts", exact: true, text: "All Posts" },
    { to: "/admin/dashboard/files", exact: true, text: "Markdown Files" },
    { to: "/admin/dashboard/logs", exact: true, text: "Server Logs" },
    { to: "/admin/dashboard/portfolio", exact: true, text: "Portfolio Posts" }
  ]
  
  return (
    <div className="container-1200 px-4">
      <div className="flex flex-col sm:flex-row ">
        
        <div className="flex-4">
          <div className="dashboard-navigation bg-pink-300 items-center shadow-md mb-4 mt-4 dark:bg-dark-600 rounded ">
            { adminNav.map(nav=>(
              <li className="mx-2 py-1.5">
                <NavLink className="text-white dark_subtitle font-medium" to={nav.to}>{nav.text}</NavLink>
              </li>
            )) }
          </div>
        </div>
        
        <div className="dashboard-content flex-10 sm:ml-4">
          <DashboardContext.Provider value={{dashboardState, actions: {
            fetchUsers: (users)=>setDashboardState({...dashboardState, users: users}),
            fetchMarkdownFiles: (files)=>setDashboardState({...dashboardState, markdownFiles: files}),
            fetchAllPosts: (posts)=>setDashboardState({...dashboardState, allPosts: posts})
          } }}>
            {/*<Switch>*/}
            {/*  <Suspense fallback={<ProgressBar/>}>*/}
            {/*    /!*{adminRoutes(authState._id).map(route=> <Route {...route} /> )}*!/*/}
            {/*    <AdminRoutes*/}
            {/*      _id={authState._id}*/}
            {/*      isAuthLoaded={authState.isAuthLoaded}*/}
            {/*    />*/}
            {/*  </Suspense>*/}
            {/*</Switch>*/}
          </DashboardContext.Provider>
        </div>
        
      </div>
      
      
  
      
    </div>
  );
};


export default Dashboard;