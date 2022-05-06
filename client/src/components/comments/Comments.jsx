import React from 'react';
import fullLink from "../../utils/fullLink";

import "./comments.scss"
import AddComment from "./AddComment";

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {faClock, faHeart, faPen, faReply, faTrash, faUserCircle} from "@fortawesome/free-solid-svg-icons";
import PreLoad from "../UI/Preload/Preload";


const Comments = (props) => {
  const {
    comment,
    onDeleteComment,
    onFetchNestedComment,
    onHideReply,
    onSetShowReplyCommentForm,
    showReplyCommentForm,
    onSubmitAddComment,
    authId,
  } = props
  
  
  const [showMoreCommentOptionId, setShowMoreCommentOptionId] = React.useState("")
  
  function handleToggleMoreOption(_id) {
    if(_id === showMoreCommentOptionId){
      setShowMoreCommentOptionId("")
    } else {
      setShowMoreCommentOptionId(_id)
    }
  }
  
  
  // prevent re-rendering... whitelist these dep...
  const renderCommentMemoized = renderComment(comment)
  
  
  // // prevent re-rendering... whitelist these dep...
  // const renderCommentMemoized = useMemo(()=>{
  //   return renderComment(comment)
  // }, [comment, comment.reply, showMoreCommentOptionId, showReplyCommentForm])
  //
  
  function renderComment({_id, text, post_id, user_id, user, created_at, reply=false, child_comment_count, username, avatar}) {
    function formatDateTime(created) {
      let now = new Date()
      let sec = 1000;
      let min = sec * 60
      let hour = min * 60
      let day = hour * 24
      let mili = now - new Date(created)

      let r = ""
      if(Math.floor(mili / day)){
        r = Math.floor(mili / day) + " day ago"
      } else if(Math.floor(mili / hour)){
        r = Math.floor(mili / hour) + " hour ago"
      } else if(Math.floor(mili / min)){
        r = Math.floor(mili / min) + " min ago"
      } else if(Math.floor(mili / sec)){
        r = Math.floor(mili / sec) + " sec ago"
      } else {
        r = "a second ago"
      }
      return r
    }

    function handleDeleteComment(_id) {
      handleToggleMoreOption("-1")
      onDeleteComment && onDeleteComment(user_id, _id)
    }
    
    return (
      <div className="my-4 mt-6">
        <div className="flex">
          <div className="w-5 mr-2">
            {user && user.avatar ?
              <img className="flex w-full radius-100" src={fullLink(user.avatar)} alt="avatar"/>
              :  <FontAwesomeIcon icon={faUserCircle} className="text-gray-500 text-md hover:text-primary" />
               }
          </div>

          <div className="comment-body flex-1">
            <div className="comment-body-text px-2 py-1 dark_subtitle dark:bg-dark-700 bg-gray-100 bg-opacity-80 text-sm rounded">
              <PreLoad to={`/author/profile/${user.username}/${user_id}`} className="text-blue-600 dark:ext-blue-800 text-sm font-medium" >{user.username}</PreLoad>
              {/*<h4 className="text-xs">render timestamp {Date.now().toString()}</h4>*/}
              <p className="text-sm dark:text-gray-300 whitespace-pre-wrap">{text}</p>
            </div>
            <div className="comment-action flex mt-1 text-xs text-gray-dark-9  items-center">
              <li className="">
                <FontAwesomeIcon icon={faHeart} className="text-sm hover:text-primary" />
              </li>
              <li className="mx-3">
                <FontAwesomeIcon icon={faReply} onClick={()=>onSetShowReplyCommentForm(_id)} className="text-sm mr-1"/>
              </li>
              <li>
                <FontAwesomeIcon icon={faClock} onClick={()=>onSetShowReplyCommentForm(_id)} className="text-sm mr-1"/>
                {formatDateTime(new Date(created_at))}
              </li>
              <li className="ml-3  relative">
                <span className="cursor-pointer hover:text-primary"
                      onClick={() => handleToggleMoreOption(_id)}>more</span>
                
                {showMoreCommentOptionId === _id && authId === user_id && <div className="bg-white w-40 comment_option absolute shadow_1">
                  <ul className="">
                    <li className={"px-2 py-1 flex-1 cursor-pointer hover:bg-primary_light  hover:text-primary flex"}>
                     <span className="pointer-events-none  whitespace-nowrap">
                        <FontAwesomeIcon icon={faPen}  className="text-sm mr-1"/>
                        <span>Edit comment</span>
                     </span>
                    </li>
                    <li onClick={()=>handleDeleteComment(_id)}
                        className={"px-2 py-1 cursor-pointer hover:bg-primary_light hover:text-primary flex"}>
                      <span className="pointer-events-none whitespace-nowrap">
                        <FontAwesomeIcon icon={faTrash} className="text-sm mr-1"/>
                          <span>Delete comment</span>
                      </span>
                    </li>

                  </ul>
                </div>}
                
              </li>
            </div>
  
            { showReplyCommentForm === _id && (
              <AddComment onSubmit={onSubmitAddComment} parent_id={_id} cancelBtn onCancel={()=>onSetShowReplyCommentForm("")} />
            ) }
            
            {child_comment_count > 0 &&
              <div onClick={() => reply && reply.length > 0 ? onHideReply(_id) : onFetchNestedComment(_id, post_id)} className="flex mt-3 items-center">
              <i className="fa text-xs text-gray-light-7 fa-reply mr-1"/>
              <h4
                className="text-gray-light-7 text-xs hover:text-primary cursor-pointer"> {  reply && reply.length > 0 ? "hide reply comments" : "show reply" } {child_comment_count}</h4>
            </div>
            }

            { reply &&  reply.map(c=> renderComment(c) ) }

          </div>
        </div>

      </div>
    );
  }
  
  
  return renderCommentMemoized
};

export default Comments;