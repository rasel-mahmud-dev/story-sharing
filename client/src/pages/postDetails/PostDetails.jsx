import React from 'react';
import {Link, useParams} from "react-router-dom";
import "./style.scss"
import apis, {baseBackend, getApi} from "../../apis";
import fullLink from "../../utils/fullLink";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faClock,  faEye, faHeart, faComment } from "@fortawesome/free-solid-svg-icons";
import { faUserCircle} from "@fortawesome/pro-light-svg-icons";
import {faHeart as faHeartLI} from "@fortawesome/pro-regular-svg-icons";
import {useSelector} from "react-redux";

import PostDetailSkeleton from "./PostDetailSkeleton";
import AddComment from "../../components/comments/AddComment";
import Comments from "../../components/comments/Comments";
import AlertHandler from "../../components/AlertHandler/AlertHandler";


import "./hijs.scss"
import Spin from "../../components/UI/Spin/Spin";
import PreLoad from "../../components/UI/Preload/Preload";

let id;
const PostDetails = (props) => {

  let params = useParams()
  const authState = useSelector(state=>state.authState)

  const [httpProgress, setHttpProgress] = React.useState(false)
  
  
  const [postDetails, setPostDetails] = React.useState({
    mdContent: "",
    comments: [],
    post_id: "",
    user_id: "",
    createdAt: null,
    tags: []
  })
  let [comments, setComments] = React.useState([])
  
  const [likes, setLikes] = React.useState([])
  
  const [loadingState, setLoadingState] = React.useState({
    id: "add_comment",
    isShown: false,
    status: "", // "error" || "success"
    message: ""
  })
  const [markDownContent, setMarkDownContent] = React.useState({
    _id: "",
    html: ""
  })
  React.useEffect(()=>{
    if(loadingState.isShown) {
     id = setTimeout(() => {
        setLoadingState({
          ...loadingState,
          isShown: false
        })
      }, 2000)
    }
    return()=>{
      id && clearTimeout(id)
    }
  }, [loadingState.isShown])

  const [isOver, setOver] = React.useState(false)

  React.useEffect(async () => {
    
    if(params.id) {
  
      let response = await apis.get(`/api/posts/${params.id}`)
  
      let updatedPostDetails = {...postDetails}
      if (response.status === 200) {
        let post = response.data.post
        updatedPostDetails = {
          ...updatedPostDetails,
          ...post
        }
    
        setPostDetails(updatedPostDetails)
        let req = new XMLHttpRequest()
        req.open("POST", `${baseBackend}/api/markdown/content`)
        req.responseType = 'text';
        req.onload = function (e) {
      
        }
    
        req.onprogress = ev => {
          // console.log(ev)
        }
    
        /** store chunked markdown html and render it  */
        req.onreadystatechange = function () {
          if (markDownContent.html) {
            // re-render every second when streaming...
            setTimeout(() => {
              setMarkDownContent({
                _id: post._id,
                html: markDownContent.html + req.response
              })
            }, 1000)
          } else {
            setMarkDownContent({
              _id: post._id,
              html: markDownContent.html + req.response
            })
          }
        }
    
        req.setRequestHeader('Content-type', 'application/json')
        req.send(JSON.stringify({
          filePath: post.path,
          post_id: post._id
        }));
    
    
        // get all comments
        getApi().post("/api/post/fetch-comments", {post_id: updatedPostDetails._id}).then(res => {
          if (res.status === 200) {
            setComments(res.data.comments)
          }
        })
        getApi().post("/api/post/get-likes", {post_id: updatedPostDetails._id}).then(res => {
          if (res.status === 200) {
            setLikes(res.data)
          }
        })
      }
  
    }
  }, [params.id])
  
  async function handleToggleLike(post_id) {
    if(!authState || !authState._id){
      setLoadingState({
        id: "add_comment",
        status: 200,
        message: "You have to Login first to Like post",
        isShown: true
      })
      return
    }
    
    setHttpProgress(true)
    
    
    let updatedLikes = [...likes]
    let likeIndex = updatedLikes.findIndex((like)=>like.postId === post_id && like.userId === authState._id )
    
    if(likeIndex === -1){
      ///add new like
  
      getApi().post("/api/post/add-like", {post_id: post_id, user_id: authState._id}).then(r => {
          if (r.status === 201) {
            setLikes([...updatedLikes, r.data])
            setHttpProgress(false)
          }
      })
      
    } else {
      ///remove like
      let like = updatedLikes[likeIndex]
      if(like) {
        getApi().post("/api/post/remove-like", {like_id: like._id, user_id: authState._id}).then(r => {
          if (r.status === 201) {
            updatedLikes.splice(likeIndex, 1)
            setLikes(updatedLikes)
            setHttpProgress(false)
          }
        })
      }
    }
  }
  
  function postReaction({_id}) {
    let youLiked = likes && likes.findIndex((like)=>like.userId === authState._id) !== -1

    return (
        <div>
          <ul className="flex text-sm">
            <li className="w-30 mx-1 flex items-center">
              { httpProgress ? (
                <div>
                  <Spin />
                </div>
              ) : (
                <div className="flex items-center" >
                  <FontAwesomeIcon icon={youLiked ? faHeart : isOver ? faHeart : faHeartLI}
                                   onClick={(e) => handleToggleLike(_id)}
                     onMouseEnter={()=>setOver(true)}
                     onMouseLeave={()=>setOver(false)}
                     className={['cursor-pointer hover:text-pink-700 dark_subtitle ', youLiked ? 'text-pink-400 ' : 'text-gray-800'].join(" ")}
                  />
                  <h4 className="font-medium ml-1">{likes ? likes.length : '0'}</h4>
                </div>
                ) }
            </li>
          </ul>
        </div>
    )
  }

  function renderMarkdownContent(){
    return (
        <div className="article">
          {/*<div className="flex mb-5 justify-center"><img src={fullLink(postDetails.cover)} alt=""/></div>*/}
          <div className="code  dark:text-white " dangerouslySetInnerHTML={{__html: markDownContent.html}}/>
          <br/>
        </div>
    )
  }
  
  function addCommentHandler({text, parent_id}){

    setLoadingState({
      ...loadingState,
      isShown: false
    })

    if(!authState || !authState._id){

      setLoadingState({
        id: "add_comment",
        status: 200,
        message: "You have to Login first to post comment...",
        isShown: true
      })
      return
    }

    if(!text){
      setLoadingState({
        id: "add_comment",
        status: 400,
        message: "Empty comment are not accept",
        isShown: true
      })
      return
    }

    let newComment = {
      text,
      parent_id: parent_id ? parent_id : null,
      user_id: authState._id,
      post_id: postDetails._id,
      username: authState.username,
      avatar: authState.avatar
    }

    getApi().post("/api/post/add-comment", newComment).then(r=>{
      if(r.status >= 200 && r.status < 400){
        let updatedComments = [...comments]
       
        if(updatedComments){
          updatedComments.push(r.data)
        } else {
          updatedComments = [r.data]
        }
        setComments(updatedComments)
        
        setLoadingState({
          id: "add_comment",
          status: 200,
          message: "Your Comment has been posted..",
          isShown: true
        })
      } else {
        setLoadingState({
          id: "add_comment",
          status: 400,
          message: "Comment post fail..",
          isShown: true
        })
      }
    }).catch(ex=>{
      setLoadingState({
        id: "add_comment",
        status: 400,
        message: "Comment post fail..",
        isShown: true
      })
    })
  }

  
  
  function commentDeleteHandler(user_id, comment_id){

    if(authState && user_id !== authState._id){
      return;
    }

    setLoadingState({
      ...loadingState,
      isLoading: true
    })

    if(!authState || !authState._id){
      setLoadingState({
        id: "add_comment",
        status: 200,
        message: "You have to Login first to delete comment...",
        isLoading: false
      })
      return
    }



    getApi().post(`/api/post/delete-comment`, {
      comment_id: comment_id,
      user_id: authState._id,
      post_id: postDetails._id
    })
        .then(r=>{
          if(r.status >= 200 && r.status < 400) {
            const comment_id = r.data.comment_id
            
            let updatePostDetail = {...postDetails}
            if (updatePostDetail.comments) {
              let idx = updatePostDetail.comments.findIndex(c=>c._id === comment_id)
              if(idx !== -1){
                updatePostDetail.comments.splice(idx, 1)
              }
            }
            setPostDetails(updatePostDetail)
            setLoadingState({
              id: "add_comment",
              status: 200,
              message: r.data.message,
              isLoading: false
            })
          } else {
            setLoadingState({
              id: "add_comment",
              status: 400,
              message: r.data.message,
              isLoading: false
            })
          }
        })
        .catch(ex=>{
          setLoadingState({
            id: "add_comment",
            status: 400,
            message: ex.response.data.message,
            isLoading: false
          })
      })


  }
  
  function toggleCommentReaction(comment_id){
    let updatedComments = [...comments]
    let commentIndex = updatedComments.findIndex(comment=>comment._id === comment_id);
    if(commentIndex !== -1){
      
      let comment = updatedComments[commentIndex]
      if(comment.likes){
        let hasReactionIndex = comment.likes.indexOf(authState._id)
        if(hasReactionIndex === -1){
          
          apis.post("/api/post/add-comment-reaction", { comment_id: comment_id }).then(res=>{
            if(res.status === 201){
              comment.likes.push(authState._id)
              setComments(updatedComments)
            }
          }).catch(ex=>{})
          
        } else {
          apis.post("/api/post/remove-comment-reaction", { comment_id: comment_id }).then(res=>{
            if(res.status === 201){
              comment.likes.splice(hasReactionIndex, 1)
              setComments(updatedComments)
            }
          }).catch(ex=>{})
          
        }
      }
    

    }
  }
  
  function renderPostComments(){
    return (
        <div>
          <label className="text-md mb-1 dark_subtitle" htmlFor="">Write a comment</label>
          <AddComment onSubmit={addCommentHandler}  />
          <div className="">
            {comments && comments.length > 0 ? comments.map(c=>(
                <Comments toggleCommentReaction={toggleCommentReaction} onDeleteComment={commentDeleteHandler} authId={authState._id} comment={c} />
            )) : (
              <h3>No comment posted yet</h3>
              
            )}
          </div>
        </div>
    )
  }

  function renderPostFooter(){
    return (
        <div>
          <div className="flex items-center dark_subtitle">
            <div className="flex items-center mb-2">
              {postReaction(postDetails)}
              <h4 className="ml-1 text-sm">Loves</h4>
            </div>

            <div className="flex items-center mb-2 ml-4">
              <FontAwesomeIcon icon={faEye} className="text-gray-dark-9" />
              <h4 className="ml-1 text-sm">{postDetails.hits ? postDetails.hits.count : 0} read</h4>
            </div>


            <div className="flex items-center mb-2 ml-4">
              <FontAwesomeIcon icon={faComment} className="text-blue-500" />
              <h4 className="ml-1 text-sm">{comments ? comments.length : 0} comments</h4>
            </div>

          </div>

          <div className="post-end-meta flex items-start">
            <h4 className="title dark_subtitle">Tags: </h4>
            <ul className="flex flex-wrap">
              {postDetails.tags && postDetails.tags.map(tag => (
                  <li
                      className="bg-gray-9 dark_subtitle dark:bg-dark-600 m-0.5 text-xs py-1 rounded"
                      key={tag}>
                    <Link className="text-gray-80 font-medium text-opacity-60" to={`/?search=${tag}`}>#{tag}</Link></li>
              ))}
            </ul>
          </div>
        </div>
    )
  }

  function closeErrorMessage(){
    setLoadingState({
      ...loadingState,
      isShown: false
    })
  }

  

  

  return (
    <div className="container-1000 px-4 min-h-viewport">

      <AlertHandler message={loadingState.message} isShown={loadingState.isShown} onClick={closeErrorMessage} status={200}/>

      {postDetails._id ? (
        <div className="post_detail mt-4">
          {postDetails.author && <div className="post_author_description items-start">
            <div className="author_info__avatar">
              <div className="w-100 md:w-12">
                {postDetails.author.avatar ? (
                  <img className="w-full rounded-full" src={fullLink(postDetails.author.avatar)} alt=""/>
                  // <img src={fullLink(postDetails.author.avatar)} alt=""/>
                ) : (
                  <FontAwesomeIcon className="text-5xl" icon={faUserCircle}/>
                )}
              </div>
            </div>

            <div className="user_info ml-3">
              <div className="flex align-center mb-2 justify-center sm:justify-start">
                <h4 className="title">
                  <PreLoad
                    className="text-md"
                    to={`/author/profile/${postDetails.author.first_name} ${postDetails.author.last_name ? postDetails.author.last_name : ""}/${postDetails.author._id}`}>
                    {postDetails.author.first_name} {postDetails.author.last_name}
                  </PreLoad>
                </h4>
                <button className="btn ml-5 btn-outline dark_subtitle">Follow</button>
              </div>
              <p className="author_desc text-sm dark_subtitle">{postDetails.author.description}</p>
            </div>
          </div>
          }


          {/* post title */}
          <div className="post_meta mt-4">
            <h1 className="title text-3xl dark_title">{postDetails.title}</h1>
            <div className="mt-2 mb-4 subtitle text-sm">
              <FontAwesomeIcon icon={faClock} className="mr-1"/>
              <span className="dark_gray">Create at {" "}
                {new Date(postDetails.createdAt).toDateString()}
                {" "} {new Date(postDetails.createdAt).toLocaleTimeString()}
                </span>
            </div>
          </div>

          {/* post cover photo */}
          <div className="flex mb-5 justify-center">
            <img className="w-full"
                 src={fullLink(postDetails.cover)} alt=""/>
          </div>

          {markDownContent.html && (
            <>
              {renderMarkdownContent()}
              {/*{renderPostFooter()}*/}
            </>
          )}
  
      
          <div className="mt-6">
            {renderPostFooter()}
          </div>
          
          <div className="mt-6">
            <div className="border-b border-gray-9 mb-4 " />
            { renderPostComments() }
          </div>
          
          

        </div>
      ) : (
        <div className="mx-4 mt-4">
          <PostDetailSkeleton.SkeletonMeta/>
          <PostDetailSkeleton.SkeletonContent/>
        </div>
      )}


      {/*{!markDownContent.html && <PostDetailSkeleton.SkeletonContent/>}*/}


    </div>
  
);
  
  

};

export default PostDetails;