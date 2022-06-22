import * as React from 'react';
import {Link} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {deletePost, fetchPosts} from "../../../store/actions/postAction";
import {getApi} from "../../../apis";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {faTrash} from "@fortawesome/pro-regular-svg-icons";
import {faPen} from "@fortawesome/free-solid-svg-icons";

import DashboardContext from "../dashboardContext";

const AndroidPosts = () => {
  
  const {postState, authState} = useSelector(state=>state)
  
  const context = React.useContext(DashboardContext)
  const dispatch = useDispatch()
  
  console.log(context)
  
  React.useEffect(()=>{
    if(context.dashboardState.allAndroidPosts && context.dashboardState.allAndroidPosts.length === 0 ){
      getApi().get("/api/android/posts").then(response=>{
        if(response.data){
          context.actions.fetchAllAndroidPosts(response.data)
        }
      })
    }
  }, [])
  
  
  
  function downloadBackup(){
    getApi().get("/api/backup", {responseType: "blob"}).then(r=>{
      const url = window.URL.createObjectURL(new Blob([r.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'backup.zip'); //or any other extension
      document.body.appendChild(link);
      link.click();
      link.remove()
    })
  }
  
  function deletePostHandler(id, path) {
    
    if(authState._id && authState.role === "admin") {
      dispatch(deletePost(id, path ? path : "", authState._id ))
    } else {
      dispatch(deletePost(id, path ? path : ""))
    }
    // setOwnPosts(ownPosts.filter(p=>p._id !== id))
  }
  
  
  return (
    <div>
      <h1 className="dark_subtitle">All Posts</h1>
      
      { context.dashboardState.allAndroidPosts && context.dashboardState.allAndroidPosts.length > 0 &&  context.dashboardState.allAndroidPosts.map(p=>(
        <div className="my-1 px-3 bg-gray-9 dark:bg-dark-600">
          <div className="flex justify-between bg-opacity-50 py-2">
            <h4 className="dark_subtitle">{p.title}</h4>
            <span className="flex align-center">
							<Link to={`/admin/dashboard/add-post/${p._id}?w=app`}>
								 <FontAwesomeIcon icon={faPen} className="pointer fa fa-trash ml-3 text-sm dark_gray "/>
							</Link>
							
                <FontAwesomeIcon
                  icon={faTrash}
                  onClick={(e) => deletePostHandler(p._id, p.path)}
                  className="dark_subtitle pointer fa fa-trash ml-3" />
              </span>
          </div>
        
        </div>
      )) }
    
    </div>
  );
};

export default AndroidPosts;