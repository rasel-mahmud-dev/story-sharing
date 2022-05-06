// import React from "react";
// import uuid from "../../utils/uuid";
//
// const BlogWrapper = ()=>{
//   return (
//     <div className="App">
//       <h1 className="mb-2 text-xl text-purple-700 font-medium  text-center">
//         React Prevent Extra Re Render When using Big List
//       </h1>
//       <Comments />
//     </div>
//   );
// }
//
// const Comments = (props)=>{
//   const [comments, setComments]  = React.useState([
//     {id: 1, text: "first Comment"},
//     {id: 2, text: "Second Comment"},
//   ])
//
//   const commentText = React.useRef()
//
//   function addNewCommentHandler(e){
//     e.preventDefault()
//     let uid = uuid()
//     setComments([
//       ...comments,
//       { id: uid , text: commentText.current.value }
//     ])
//   }
//
//   function deleteComment(id){
//     setComments(comments.filter(c=>c.id !== id))
//   }
//
//   return (
//     <div>
//       <form onSubmit={addNewCommentHandler} className="mx-5">
//         <div>
//           <input ref={commentText} type="text" placeholder="Comment text" className="input-elem"/>
//           <button className="btn mt-1">Add</button>
//         </div>
//       </form>
//       <div>
//         { comments.map(c=><Comment comment={c} deleteComment={deleteComment} />
//         )}
//       </div>
//     </div>
//   )
// }
//
// const MemoizedComment=(props)=>{
//   let commentMemoized = React.useMemo(()=>{
//     return <Comment {...props} />
//   }, [props.comment.id])
//
//   return commentMemoized
// }
//
//
// const Comment = (props)=>{
//
//   let {deleteComment, comment} = props
//
//
//   function renderEachComment(comment){
//     let now = Date.now().toString()
//     return (
//       <div>
//         <div className="mx-5 px-3 py-2">
//
//           <div className="bg-gray-light-9 my-2 px-3 py-2 flex justify-between">
//             <div className="flex-1">
//               <h4 className="min-w-100px">{comment.text}</h4><
//           /div>
//             {/*<div className="flex-1">
//             <button className="btn btn-sm" onClick={(e)=>handleChangeCommentName(comment.id)}>change Name</button>
//           </div>*/}
//             <div className="flex text-sm font-normal">
//               <h4>render Comment:  </h4>
//               <span className="ml-2 font-medium">{now.slice(now.length - 4) } ago</span>
//             </div>
//           </div>
//           <div className="flex">
//             <li onClick={()=>deleteComment(comment.id)} className="text-xs mx-2"><i className="far fa-trash" /></li>
//             <li className="text-xs"><i className="far fa-pen" /></li>
//           </div>
//         </div>
//       </div>
//     )
//   }
//
//   return renderEachComment(comment)
// }
// export  default BlogWrapper
