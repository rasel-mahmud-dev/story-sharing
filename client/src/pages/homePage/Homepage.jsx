import React, { Suspense } from 'react';
import {Link, useLocation, useNavigate, useParams} from "react-router-dom";
import "./homepage.scss"
import {fetchPosts, fetchTopPosts, filterPost} from "../../store/actions/postAction";
import {useDispatch, useSelector} from "react-redux";
import queryString from "query-string"

import ReactLazyPreload from "../../utils/ReactLazyPreload";
import RenderPostsSkeleton from "../../components/RenderPosts/RenderPostsSkeleton";
import TopHitsPostsSkeleton from "../../components/TopHitsPosts/TopHitsPostsSkeleton";
import TopHitsPosts from "../../components/TopHitsPosts/TopHitsPosts";
import PreLoad from "../../components/UI/Preload/Preload";

const RenderPosts  =  ReactLazyPreload(()=>import("../../components/RenderPosts/RenderPosts"));


const HeroSection = (props) => {
  
  const { topPosts, posts, searchResultPosts } = useSelector(state=> state.postState )
  const dispatch = useDispatch()
  
  
  React.useEffect(()=>{

    if (topPosts.posts.length === 0) {
      // fetchTopPosts(dispatch).then(r => {})
    }
    if (posts.length === 0) {
      fetchPosts(dispatch, "", (data) => {})
    }
  }, [])

  

   const topTags = [
     "React", "Javascript", "Nodejs",
     "React", "Javascript", "Nodejs",
     "React", "Javascript", "Nodejs"
   ]
    const footerLinks = [
      {  label: "About"},
      {  label: "Status"},
      {  label: "Writers"},
      {  label: "About"},
    ]

    
    
    return (
      <div className="container-1400 mx-4">
         <div className="mt-8">
             <div style={{maxWidth: "400px"}}>
               {/*<img src="https://drive.google.com/uc?id=1dMwmUemXuebCC9XaHU_ymA3yGfVsAD3l&export=download" alt=""/>*/}
                 <h1 className="text-black dark:text-dark-0 text-base  mb-2 ">
                   <span className="font-medium mr-1">DEV STORY</span>
                   is a place
                     to write, read,
                     and connect</h1>
                 <p className="text-dark-400   dark:text-dark-10 text-base">It's easy and free to post your thinking on any topic and connect
                     with millions of readers.</p>
                 
               <button className="btn mt-4 btn-outline font-medium dark:text-gray-400">
                 <PreLoad to="/auth/add-post/null" className="dark:text-gray-400">Start Writing</PreLoad>
               </button>
               
             </div>
         </div>
    
          <div className="border-b border-dark-100 dark:border-dark-600  mt-8"/>
          
    
          <div className="flex align-center mt-4">
              <img src="" alt=""/>
              <h4 className="ml-1 text-dark-700 dark:text-gray-200">TRENDING ON DEV STORY</h4>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3  mt-8">
            {topPosts && topPosts.posts.length === 0 ? <TopHitsPostsSkeleton /> : <TopHitsPosts topPosts={topPosts} />}
          </div>
          <div className="border-b border-dark-100 dark:border-dark-600  mt-8 mb-8"/>
      
          <div className="flex ">
            {/* all scroll able posts */}
            <div className="posts flex-3">
              <Suspense fallback={<RenderPostsSkeleton/>}>
                { posts && posts.length === 0 ? <RenderPostsSkeleton/> : <RenderPosts posts={posts} /> }
              </Suspense>
            </div>
            <div className="hidden md:block" style={{maxWidth: "40%"}}>
              {/* Sticky Footer  */}
              <div className="dt mt-8 ml-5">
                <h4  className="font-medium text-xs text-gray-600 dark:text-gray-200">DISCOVER MORE OF WHAT MATTERS TO YOU</h4>
                <div className="mt-4 flex flex-3 flex-wrap">
                  {topTags.map(tag=>(
                    <span className="mx-1 my-1 mt-2 ">
                      <PreLoad to={`/search?tag=${tag.toLowerCase()}`} className="btn bg-gray-10 rounded dark:bg-dark-500 dark:text-gray-300">{tag}</PreLoad>
                    </span>
                  ))}
                </div>
                <div className="class"/>
                <div className="mt-4 flex flex-3 flex-wrap">
                  {footerLinks.map(tag=>(
                    <a className="mx-1 mt-2 rounded cursor-pointer text-gray-600 dark:text-gray-300 dark:text-gray-300">{tag.label}</a>
                  ))}
                </div>
              </div>
            </div>
          </div>
      </div>
    )
}

const Homepage = () => {
    const postState = useSelector(state=>state.postState)
  
    
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()

    React.useEffect(()=>{
        let qs = queryString.parse(location.search)
        let val = qs.search
        if (val) {
            let uniqArr = filterPost(postState.posts, val.trim().toLowerCase())
                dispatch({type: "SET_POST_SEARCH_VALUE", payload: val.trim().toLowerCase()})
            if (uniqArr.length > 0) {
                dispatch({type: "SEARCH_POSTS", payload: uniqArr})
  
              navigate(`/?search=${val}`)
            } else {
                dispatch({type: "SEARCH_POSTS", payload: []})
              navigate(`/?search=${val}`)
            }
        } else {
            dispatch({type: "SEARCH_POSTS", payload: postState.posts})
        }

    }, [])

  
    return (
        <div className="container-1200">
          <HeroSection />
          <br />
      </div>
    );
};





export default Homepage;