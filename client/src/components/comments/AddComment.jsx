import React from 'react';


const AddComment = props =>{
  const { onSubmit, cancelBtn, onCancel, parent_id } = props
  const [newComment,  setNewComment] = React.useState({
    text: "",
    parent_id: parent_id
  })
  
  function handleSubmit(e){
    e.preventDefault()
    onSubmit && onSubmit(newComment)
    setNewComment({parent_id: "", text: ""})
  }
  return (
      <div>
        <div className="add-comment-form">
          <textarea
            onChange={(e)=>setNewComment({...newComment, text: e.target.value})}
            className="input-elem dark_subtitle dark:bg-dark-600"
            name="text"
            value={newComment.text}
            placeholder="Post your comment"
            id="text"
          />
          <div className="flex justify-end">
            {cancelBtn && <button onClick={onCancel} className="btn  btn-primary">Cancel</button> }
            <button onClick={handleSubmit} className="btn btn-primary  ml-2">Post</button>
          </div>
        </div>
      </div>
    );
}

export default AddComment;