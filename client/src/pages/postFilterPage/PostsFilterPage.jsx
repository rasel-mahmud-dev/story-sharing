import {connect, useDispatch} from "react-redux";
import React, {useEffect, Suspense} from "react";
import queryString from "query-string"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "./styles.scss";
import {Link, useHistory, useLocation, useParams} from "react-router-dom";
import {
  deletePost,
  filterPostUsingTag,
  filterPostUsingText
} from "../../store/actions/postAction";
import Loader from "../../components/UI/Loader";
import {faTimesCircle} from "@fortawesome/free-solid-svg-icons";



import ReactLazyPreload from "../../utils/ReactLazyPreload";

const RenderPosts  =  ReactLazyPreload(()=>import("../../components/RenderPosts/RenderPosts"));

const PostsFilterPage = (props) => {
  const [isLoading, setLoading] = React.useState(false)

  const {postState, authState} = props
  const [postDetail, setPostDetail] = React.useState({})
  const [commentPagination, setCommentPagination] = React.useState({
    pageSize: 1,
    currentPage: 1
  })

  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(()=>{
    setLoading(true)
    
    let val = queryString.parse(history.location.search)
    if(val.tag){
      filterPostUsingTag(dispatch, val.tag, ()=>setLoading(false))
      dispatch({
        type: "SET_POST_SEARCH_VALUE",
        payload: val.tag
      })
    } else if(val.text) {
      filterPostUsingText(dispatch, val.text,  ()=>setLoading(false))
      dispatch({
        type: "SET_POST_SEARCH_VALUE",
        payload: val.text
      })
    }

    // if(postState.posts.length < 1) {
    //   setLoading(true)
    //   // fetchPosts(dispatch, location.pathname, () => setLoading(false))
    // }

  }, [history.location.search])


  // useEffect(async () => {
  //   let val = qs.search
  //   if (val) {
  //     let uniqArr = filterPost(postState.posts, val.trim().toLowerCase())
  //     if (uniqArr.length > 0) {
  //       dispatch({type: "SEARCH_POSTS", payload: uniqArr})
  //       dispatch({type: "SET_POST_SEARCH_VALUE", payload: val.trim().toLowerCase()})
  //
  //       history.replace(`/?search=${val}`)
  //     } else {
  //       dispatch({type: "SEARCH_POSTS", payload: []})
  //       history.replace(`/?search=${val}`)
  //     }
  //   } else {
  //     dispatch({type: "SEARCH_POSTS", payload: postState.posts})
  //   }
  //   console.log(qs)
  // }, [history.location.search])


  let updatedComments = []


  function handleClearPostSearch(e) {
    dispatch({type: "SET_POST_SEARCH_VALUE", payload: ""})
    dispatch({type: "SEARCH_POSTS", payload: postState.posts})
    history.replace("/")
  }

  function deletePostHandler(id) {
    props.deletePost(id, (isDeleted)=>{
      console.log(isDeleted)
    })
  }


  return (
    <div className="container-1000 min-h-viewport">

      <div className="px-0">
        <div className="posts_wrapper">
          <div className="filter_items mt-0">
            <Link to="/" className="font-medium">Back to Homepage</Link>
          </div>

          <div className="mb-2"/>
     
          <div className="flex justify-between bg-gray-100 dark:bg-dark-600 py-4 px-2 rounded">
           <div className="flex align-center dark:text-white">
             <div className="mr-2 no-wrap">Search by: </div>
             <h2 className="rounded"> {postState.searchValue}</h2>
             <FontAwesomeIcon icon={faTimesCircle} className="ml-2 cursor-pointer text-red-400" onClick={handleClearPostSearch}/>
           </div>
            {/*<div className="no-wrap flex align-center dark:text-white">*/}
            {/*  <span>Sort By:</span>*/}
            {/*  <h2>Created</h2>*/}
            {/*</div>*/}
           </div>
         
            <div className="mx-auto flex justify-center">
              { isLoading && <Loader/>  }
            </div>


            {
              postState.searchPosts.length === 0 ? (
              <h1 className="mt-10 dark_title title text-center text-xl">
                {!isLoading && `Not posts matched with` }
                <span className="text-red-500">{postState.searchValue}</span>
              </h1>
              ) : (
                <div className="mt-4">
                  <Suspense fallback={<h1>Loading..</h1>}>
                    <RenderPosts posts={postState.searchPosts} />
                  </Suspense>
                </div>
              )
            }
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state) {
  return {
    postState: state.postState,
    authState: state.authState
  }
}

export default connect(mapStateToProps, { deletePost })(PostsFilterPage);
