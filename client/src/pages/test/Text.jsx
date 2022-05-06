import React from 'react';


const Text = () => {
  let [comments, setComments] = React.useState([
    {
      text: "1st level comment",
      id: 1,
      reply: [
        {text: "2st level comment", id: 2},
        {
          text: "2st level comment 2", id: 3,
          reply: [
            {text: "3st level comment", id: 4},
            {
              text: "3st level comment 2", id: 5,
              reply: [
                {text: "4st level comment", id: 6},
                {
                  text: "4st level comment 2", id: 7,
                  reply: [
                    {text: "5st level comment", id: 8},
                    {
                      text: "5st level comment 2", id: 9,
                      reply: [
                        {text: "6st level comment", id: 10},
                        {text: "6st level comment 2", id: 11},
                      ]
                    },
                  ]
                },
              ]
            },
          ]
        },
      ],
    }
  ])
  
  //? Delete n nested recursive comment
  function handleDelete(id) {
    let updatedComments = [...comments]
    
    function recursiveDelete(comments, deletedId, itemOfPatent = null) {
      if (Array.isArray(comments)) {
        comments.map(c => {
          if (c.reply && c.reply.length > 0) {
            recursiveDelete(c.reply, deletedId, c)
          }
          
          if (c.id === deletedId) {
            // nested n level
            if (itemOfPatent && itemOfPatent.reply) {
              let idx = itemOfPatent.reply.findIndex(d => d.id === c.id)
              itemOfPatent.reply.splice(idx, 1)
            } else {
              // root level
              let idx = comments.findIndex(d => d.id === c.id)
              comments.splice(idx, 1)
            }
          }
        })
      }
    }
    
    recursiveDelete(updatedComments, id, null)
    setComments(updatedComments)
  }
  
  function handleAddNewComment() {
    let updatedComments = [...comments]
    
    let newComment = {
      text: "New Added Comment",
      id: 22
    }
    
    function recursiveAddNew(comments, parent_id, itemOfPatent = null) {
      if (Array.isArray(comments)) {
        comments.map(c => {
          if (c.reply && c.reply.length > 0) {
            recursiveAddNew(c.reply, parent_id, c)
          }
          
          if (c.id === parent_id) {
            // nested n level
            if (itemOfPatent && itemOfPatent.reply) {
              if (itemOfPatent.reply) {
                itemOfPatent.reply.push(newComment)
              } else {
                itemOfPatent.reply = [newComment]
              }
            } else {
              let idx = comments.findIndex(pc => pc.id === c.id)
              if (comments[idx].reply) {
                comments[idx].reply.push(newComment)
              } else {
                comments[idx].reply = [newComment]
              }
            }
          }
        })
      }
    }
    
    recursiveAddNew(updatedComments, 1, null)
    setComments(updatedComments)
  }
  
  return (
    <div className="render_comments">
      <h2 className="text-center  text-xl text-pink-500">React Recursion Render</h2>
      <button onClick={() => handleAddNewComment()}>Add New</button>
      <ul>
        {comments.map(c => (
          <Comment key={c.id} onDelete={handleDelete} comment={c}/>
        ))}
      </ul>
      
      
      {/* { comments.map(c=>(
        <li>
          <span onClick={()=>handleDelete(c.id)}>{c.text} id: {c.id}</span>
          <ul className="ml-3">
            { c.reply && c.reply.map(rc=>(
              <li>
                <span onClick={()=>handleDelete(rc.id)}>{rc.text} id: {rc.id}</span>
              </li>
            )) }
          </ul>
        </li>
      )) }     */}
    
    </div>
  );
};

const Comment = (props) => {
  let {key, comment, onDelete} = props
  return (
    <li key={key} className="mb-2">
        <span>{comment.text}
          <span className="ml-24">id: {comment.id}</span>
          <button className="btn btn-sm ml-10" onClick={() => onDelete(comment.id)}>delete</button>
        </span>
      <ul>
        {comment.reply && comment.reply.map(cc => (
          <Comment key={cc.id} onDelete={onDelete} comment={cc}/> // this is recursion we check if comment.reply exists or not
        ))}
      </ul>
    </li>
  )
}

export default Text;