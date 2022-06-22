# JavaScript Recursion updated

In this tutorial, you will learn about recursion in JavaScript with the help of examples.



## we will learn these things.

- How loop with recursive.
- How react component render recursive  



## What is Recursion ?

Recursion is a process of calling itself. A function that calls itself is called a recursive function.

Recursive very important thing in programming.

````js
function recurseFn() {
    if(condition) {
        recurseFn();
    }
    else {
        // stop calling recurse()
    }
}

recurseFn();  
````



A recursive function must have a condition to stop calling itself. Otherwise, the function is called indefinitely. it will run infinity.

Once the condition is met, the function stops calling itself. This is called a base condition.

To prevent infinite recursion, you can use if else statemen.

------



A simple example of a recursive function would be to count down the value to 1.

## Example 1: Print Number

```js
// count number until number = 1

function countDown(number) {
    // we display the number
    console.log(number);

    // decrease the number value
    const newNumber = number - 1;

    // base case
    if (newNumber > 0) {
        countDown(newNumber);
    }
}

countDown(4);
```
## output
``` js
4
3
2
1
```
A simple example of a recursive function would be to count down the value to 1.

In the above program, the user passes a number as an argument when calling a function.

In each iteration, the number value is decreased by **1** and function `countDown()` is called until the number is positive. Here, `newNumber > 0` is the base condition.

```shell
countDown(4) prints 4 and calls countDown(3)
countDown(3) prints 3 and calls countDown(2)
countDown(2) prints 2 and calls countDown(1)
countDown(1) prints 1 and calls countDown(0)
```

When the number reaches **0**, the base condition is met, and the function is not called anymore. 



## In React Component.

we have nested 5 level nested comment  each level has reply arr and that has another reply array. but end of children object there are not reply array. This is Base Condition to stop recursive funciton.

 `!(comment.reply && comment.reply.length > 1)` 



Like this.

```jsx

import React from 'react';
const Post = () => {    
   let [comments, setComments] = React.useState([
    {
      text: "1st level comment",
      id: 1,
      reply: [
        {text: "2st level comment", id: 2},
        {text: "2st level comment 2", id: 3,
          reply: [
            {text: "3st level comment", id: 4},
            {text: "3st level comment 2", id: 5,
              reply: [
                {text: "4st level comment", id: 6},
                {text: "4st level comment 2", id: 7,
                  reply: [
                    {text: "5st level comment", id: 8},
                    {text: "5st level comment 2", id: 9,
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
  return (
    <div className="render_comments">
      <h2 className="text-center  text-xl text-pink-500">React Recursion Render</h2>
      <button onClick={()=>handleAddNewComment()}>Add New </button>
      <ul>
        { comments.map(c=>(
          <Comment key={c.id} onDelete={handleDelete} comment={c} />
        ))}
      </ul>    
    </div>
  );
};

const Comment = (props)=>{
  let { key, comment, onDelete } = props
  return (
      <li key={key} className="mb-2">
        <span>{comment.text}
          <span className="ml-24">id: {comment.id}</span>
          <button className="btn btn-sm ml-10" onClick={()=>onDelete(comment.id)}>delete</button>
        </span>
          <ul>
            { comment.reply && comment.reply.map(cc=>(
                <Comment key={cc.id} onDelete={onDelete} comment={cc} /> // base condition to run recursive
              )) }
          </ul>
      </li>
  )
}

export default Post;

```



here comment component call itself

```jsx
const Comment = (props)=>{
  let { key, comment, onDelete } = props
  return (
      <li key={key} className="mb-2">
        <span>{comment.text}
          <span className="ml-24">id: {comment.id}</span>
          <button className="btn btn-sm ml-10" onClick={()=>onDelete(comment.id)}>delete</button>
        </span>
          <ul>
            { comment.reply && comment.reply.map(cc=>(
                <Comment key={cc.id} onDelete={onDelete} comment={cc} /> // base condition to run recursive
              )) }
          </ul>
      </li>
  )
```





### delete comment inside deep nested child comment

```jsx
//? Delete n nested recursive comment
  function handleDelete(id){
    let updatedComments = [...comments]  // deep nested comment
   
    function recursiveDelete(comments, deletedId, itemOfPatent=null){
      if(Array.isArray(comments)){
        comments.map(c=>{
          if(c.reply && c.reply.length > 0){
            recursiveDelete(c.reply, deletedId, c)
          }
          
          if(c.id === deletedId ){
            // nested n level
            if(itemOfPatent && itemOfPatent.reply) {
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
```







### Add new comment inside deep nested child comment

```js

function handleAddNewComment(){
    let updatedComments = [...comments]  // deep nested comment

    let newComment = {
        text: "New Added Comment",
        id: 22
    }

    function recursiveAddNew(comments, parent_id, itemOfPatent=null){
        if(Array.isArray(comments)){
            comments.map(c=>{
                if(c.reply && c.reply.length > 0){
                    recursiveAddNew(c.reply,  parent_id, c)
                }

                if(c.id === parent_id ){
                    // nested n level
                    if(itemOfPatent && itemOfPatent.reply) {
                        if(itemOfPatent.reply) {
                            itemOfPatent.reply.push(newComment)
                        } else {
                            itemOfPatent.reply = [newComment]
                        }
                    } else {
                        let idx = comments.findIndex(pc=>pc.id === c.id)
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
```

# JavaScript Recursion updated

In this tutorial, you will learn about recursion in JavaScript with the help of examples.



## we will learn these things.

- How loop with recursive.
- How react component render recursive  



## What is Recursion ?

Recursion is a process of calling itself. A function that calls itself is called a recursive function.

Recursive very important thing in programming.

````js
function recurseFn() {
    if(condition) {
        recurseFn();
    }
    else {
        // stop calling recurse()
    }
}

recurseFn();  
````



A recursive function must have a condition to stop calling itself. Otherwise, the function is called indefinitely. it will run infinity.

Once the condition is met, the function stops calling itself. This is called a base condition.

To prevent infinite recursion, you can use if else statemen.

------



A simple example of a recursive function would be to count down the value to 1.

## Example 1: Print Number

```js
// count number until number = 1

function countDown(number) {
    // we display the number
    console.log(number);

    // decrease the number value
    const newNumber = number - 1;

    // base case
    if (newNumber > 0) {
        countDown(newNumber);
    }
}

countDown(4);
```
## output
``` js
4
3
2
1
```
A simple example of a recursive function would be to count down the value to 1.

In the above program, the user passes a number as an argument when calling a function.

In each iteration, the number value is decreased by **1** and function `countDown()` is called until the number is positive. Here, `newNumber > 0` is the base condition.

```shell
countDown(4) prints 4 and calls countDown(3)
countDown(3) prints 3 and calls countDown(2)
countDown(2) prints 2 and calls countDown(1)
countDown(1) prints 1 and calls countDown(0)
```

When the number reaches **0**, the base condition is met, and the function is not called anymore. 



## In React Component.

we have nested 5 level nested comment  each level has reply arr and that has another reply array. but end of children object there are not reply array. This is Base Condition to stop recursive funciton.

 `!(comment.reply && comment.reply.length > 1)` 



Like this.

```jsx

import React from 'react';
const Post = () => {    
   let [comments, setComments] = React.useState([
    {
      text: "1st level comment",
      id: 1,
      reply: [
        {text: "2st level comment", id: 2},
        {text: "2st level comment 2", id: 3,
          reply: [
            {text: "3st level comment", id: 4},
            {text: "3st level comment 2", id: 5,
              reply: [
                {text: "4st level comment", id: 6},
                {text: "4st level comment 2", id: 7,
                  reply: [
                    {text: "5st level comment", id: 8},
                    {text: "5st level comment 2", id: 9,
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
  return (
    <div className="render_comments">
      <h2 className="text-center  text-xl text-pink-500">React Recursion Render</h2>
      <button onClick={()=>handleAddNewComment()}>Add New </button>
      <ul>
        { comments.map(c=>(
          <Comment key={c.id} onDelete={handleDelete} comment={c} />
        ))}
      </ul>    
    </div>
  );
};

const Comment = (props)=>{
  let { key, comment, onDelete } = props
  return (
      <li key={key} className="mb-2">
        <span>{comment.text}
          <span className="ml-24">id: {comment.id}</span>
          <button className="btn btn-sm ml-10" onClick={()=>onDelete(comment.id)}>delete</button>
        </span>
          <ul>
            { comment.reply && comment.reply.map(cc=>(
                <Comment key={cc.id} onDelete={onDelete} comment={cc} /> // base condition to run recursive
              )) }
          </ul>
      </li>
  )
}

export default Post;

```



here comment component call itself

```jsx
const Comment = (props)=>{
  let { key, comment, onDelete } = props
  return (
      <li key={key} className="mb-2">
        <span>{comment.text}
          <span className="ml-24">id: {comment.id}</span>
          <button className="btn btn-sm ml-10" onClick={()=>onDelete(comment.id)}>delete</button>
        </span>
          <ul>
            { comment.reply && comment.reply.map(cc=>(
                <Comment key={cc.id} onDelete={onDelete} comment={cc} /> // base condition to run recursive
              )) }
          </ul>
      </li>
  )
```





### delete comment inside deep nested child comment

```jsx
//? Delete n nested recursive comment
  function handleDelete(id){
    let updatedComments = [...comments]  // deep nested comment
   
    function recursiveDelete(comments, deletedId, itemOfPatent=null){
      if(Array.isArray(comments)){
        comments.map(c=>{
          if(c.reply && c.reply.length > 0){
            recursiveDelete(c.reply, deletedId, c)
          }
          
          if(c.id === deletedId ){
            // nested n level
            if(itemOfPatent && itemOfPatent.reply) {
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
```







### Add new comment inside deep nested child comment

```js

function handleAddNewComment(){
    let updatedComments = [...comments]  // deep nested comment

    let newComment = {
        text: "New Added Comment",
        id: 22
    }

    function recursiveAddNew(comments, parent_id, itemOfPatent=null){
        if(Array.isArray(comments)){
            comments.map(c=>{
                if(c.reply && c.reply.length > 0){
                    recursiveAddNew(c.reply,  parent_id, c)
                }

                if(c.id === parent_id ){
                    // nested n level
                    if(itemOfPatent && itemOfPatent.reply) {
                        if(itemOfPatent.reply) {
                            itemOfPatent.reply.push(newComment)
                        } else {
                            itemOfPatent.reply = [newComment]
                        }
                    } else {
                        let idx = comments.findIndex(pc=>pc.id === c.id)
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
```

# JavaScript Recursion updated

In this tutorial, you will learn about recursion in JavaScript with the help of examples.



## we will learn these things.

- How loop with recursive.
- How react component render recursive  



## What is Recursion ?

Recursion is a process of calling itself. A function that calls itself is called a recursive function.

Recursive very important thing in programming.

````js
function recurseFn() {
    if(condition) {
        recurseFn();
    }
    else {
        // stop calling recurse()
    }
}

recurseFn();  
````



A recursive function must have a condition to stop calling itself. Otherwise, the function is called indefinitely. it will run infinity.

Once the condition is met, the function stops calling itself. This is called a base condition.

To prevent infinite recursion, you can use if else statemen.

------



A simple example of a recursive function would be to count down the value to 1.

## Example 1: Print Number

```js
// count number until number = 1

function countDown(number) {
    // we display the number
    console.log(number);

    // decrease the number value
    const newNumber = number - 1;

    // base case
    if (newNumber > 0) {
        countDown(newNumber);
    }
}

countDown(4);
```
## output
``` js
4
3
2
1
```
A simple example of a recursive function would be to count down the value to 1.

In the above program, the user passes a number as an argument when calling a function.

In each iteration, the number value is decreased by **1** and function `countDown()` is called until the number is positive. Here, `newNumber > 0` is the base condition.

```shell
countDown(4) prints 4 and calls countDown(3)
countDown(3) prints 3 and calls countDown(2)
countDown(2) prints 2 and calls countDown(1)
countDown(1) prints 1 and calls countDown(0)
```

When the number reaches **0**, the base condition is met, and the function is not called anymore. 



## In React Component.

we have nested 5 level nested comment  each level has reply arr and that has another reply array. but end of children object there are not reply array. This is Base Condition to stop recursive funciton.

 `!(comment.reply && comment.reply.length > 1)` 



Like this.

```jsx

import React from 'react';
const Post = () => {    
   let [comments, setComments] = React.useState([
    {
      text: "1st level comment",
      id: 1,
      reply: [
        {text: "2st level comment", id: 2},
        {text: "2st level comment 2", id: 3,
          reply: [
            {text: "3st level comment", id: 4},
            {text: "3st level comment 2", id: 5,
              reply: [
                {text: "4st level comment", id: 6},
                {text: "4st level comment 2", id: 7,
                  reply: [
                    {text: "5st level comment", id: 8},
                    {text: "5st level comment 2", id: 9,
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
  return (
    <div className="render_comments">
      <h2 className="text-center  text-xl text-pink-500">React Recursion Render</h2>
      <button onClick={()=>handleAddNewComment()}>Add New </button>
      <ul>
        { comments.map(c=>(
          <Comment key={c.id} onDelete={handleDelete} comment={c} />
        ))}
      </ul>    
    </div>
  );
};

const Comment = (props)=>{
  let { key, comment, onDelete } = props
  return (
      <li key={key} className="mb-2">
        <span>{comment.text}
          <span className="ml-24">id: {comment.id}</span>
          <button className="btn btn-sm ml-10" onClick={()=>onDelete(comment.id)}>delete</button>
        </span>
          <ul>
            { comment.reply && comment.reply.map(cc=>(
                <Comment key={cc.id} onDelete={onDelete} comment={cc} /> // base condition to run recursive
              )) }
          </ul>
      </li>
  )
}

export default Post;

```



here comment component call itself

```jsx
const Comment = (props)=>{
  let { key, comment, onDelete } = props
  return (
      <li key={key} className="mb-2">
        <span>{comment.text}
          <span className="ml-24">id: {comment.id}</span>
          <button className="btn btn-sm ml-10" onClick={()=>onDelete(comment.id)}>delete</button>
        </span>
          <ul>
            { comment.reply && comment.reply.map(cc=>(
                <Comment key={cc.id} onDelete={onDelete} comment={cc} /> // base condition to run recursive
              )) }
          </ul>
      </li>
  )
```





### delete comment inside deep nested child comment

```jsx
//? Delete n nested recursive comment
  function handleDelete(id){
    let updatedComments = [...comments]  // deep nested comment
   
    function recursiveDelete(comments, deletedId, itemOfPatent=null){
      if(Array.isArray(comments)){
        comments.map(c=>{
          if(c.reply && c.reply.length > 0){
            recursiveDelete(c.reply, deletedId, c)
          }
          
          if(c.id === deletedId ){
            // nested n level
            if(itemOfPatent && itemOfPatent.reply) {
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
```







### Add new comment inside deep nested child comment

```js

function handleAddNewComment(){
    let updatedComments = [...comments]  // deep nested comment

    let newComment = {
        text: "New Added Comment",
        id: 22
    }

    function recursiveAddNew(comments, parent_id, itemOfPatent=null){
        if(Array.isArray(comments)){
            comments.map(c=>{
                if(c.reply && c.reply.length > 0){
                    recursiveAddNew(c.reply,  parent_id, c)
                }

                if(c.id === parent_id ){
                    // nested n level
                    if(itemOfPatent && itemOfPatent.reply) {
                        if(itemOfPatent.reply) {
                            itemOfPatent.reply.push(newComment)
                        } else {
                            itemOfPatent.reply = [newComment]
                        }
                    } else {
                        let idx = comments.findIndex(pc=>pc.id === c.id)
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
```

# JavaScript Recursion updated

In this tutorial, you will learn about recursion in JavaScript with the help of examples.



## we will learn these things.

- How loop with recursive.
- How react component render recursive  



## What is Recursion ?

Recursion is a process of calling itself. A function that calls itself is called a recursive function.

Recursive very important thing in programming.

````js
function recurseFn() {
    if(condition) {
        recurseFn();
    }
    else {
        // stop calling recurse()
    }
}

recurseFn();  
````



A recursive function must have a condition to stop calling itself. Otherwise, the function is called indefinitely. it will run infinity.

Once the condition is met, the function stops calling itself. This is called a base condition.

To prevent infinite recursion, you can use if else statemen.

------



A simple example of a recursive function would be to count down the value to 1.

## Example 1: Print Number

```js
// count number until number = 1

function countDown(number) {
    // we display the number
    console.log(number);

    // decrease the number value
    const newNumber = number - 1;

    // base case
    if (newNumber > 0) {
        countDown(newNumber);
    }
}

countDown(4);
```
## output
``` js
4
3
2
1
```
A simple example of a recursive function would be to count down the value to 1.

In the above program, the user passes a number as an argument when calling a function.

In each iteration, the number value is decreased by **1** and function `countDown()` is called until the number is positive. Here, `newNumber > 0` is the base condition.

```shell
countDown(4) prints 4 and calls countDown(3)
countDown(3) prints 3 and calls countDown(2)
countDown(2) prints 2 and calls countDown(1)
countDown(1) prints 1 and calls countDown(0)
```

When the number reaches **0**, the base condition is met, and the function is not called anymore. 



## In React Component.

we have nested 5 level nested comment  each level has reply arr and that has another reply array. but end of children object there are not reply array. This is Base Condition to stop recursive funciton.

 `!(comment.reply && comment.reply.length > 1)` 



Like this.

```jsx

import React from 'react';
const Post = () => {    
   let [comments, setComments] = React.useState([
    {
      text: "1st level comment",
      id: 1,
      reply: [
        {text: "2st level comment", id: 2},
        {text: "2st level comment 2", id: 3,
          reply: [
            {text: "3st level comment", id: 4},
            {text: "3st level comment 2", id: 5,
              reply: [
                {text: "4st level comment", id: 6},
                {text: "4st level comment 2", id: 7,
                  reply: [
                    {text: "5st level comment", id: 8},
                    {text: "5st level comment 2", id: 9,
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
  return (
    <div className="render_comments">
      <h2 className="text-center  text-xl text-pink-500">React Recursion Render</h2>
      <button onClick={()=>handleAddNewComment()}>Add New </button>
      <ul>
        { comments.map(c=>(
          <Comment key={c.id} onDelete={handleDelete} comment={c} />
        ))}
      </ul>    
    </div>
  );
};

const Comment = (props)=>{
  let { key, comment, onDelete } = props
  return (
      <li key={key} className="mb-2">
        <span>{comment.text}
          <span className="ml-24">id: {comment.id}</span>
          <button className="btn btn-sm ml-10" onClick={()=>onDelete(comment.id)}>delete</button>
        </span>
          <ul>
            { comment.reply && comment.reply.map(cc=>(
                <Comment key={cc.id} onDelete={onDelete} comment={cc} /> // base condition to run recursive
              )) }
          </ul>
      </li>
  )
}

export default Post;

```



here comment component call itself

```jsx
const Comment = (props)=>{
  let { key, comment, onDelete } = props
  return (
      <li key={key} className="mb-2">
        <span>{comment.text}
          <span className="ml-24">id: {comment.id}</span>
          <button className="btn btn-sm ml-10" onClick={()=>onDelete(comment.id)}>delete</button>
        </span>
          <ul>
            { comment.reply && comment.reply.map(cc=>(
                <Comment key={cc.id} onDelete={onDelete} comment={cc} /> // base condition to run recursive
              )) }
          </ul>
      </li>
  )
```





### delete comment inside deep nested child comment

```jsx
//? Delete n nested recursive comment
  function handleDelete(id){
    let updatedComments = [...comments]  // deep nested comment
   
    function recursiveDelete(comments, deletedId, itemOfPatent=null){
      if(Array.isArray(comments)){
        comments.map(c=>{
          if(c.reply && c.reply.length > 0){
            recursiveDelete(c.reply, deletedId, c)
          }
          
          if(c.id === deletedId ){
            // nested n level
            if(itemOfPatent && itemOfPatent.reply) {
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
```







### Add new comment inside deep nested child comment

```js

function handleAddNewComment(){
    let updatedComments = [...comments]  // deep nested comment

    let newComment = {
        text: "New Added Comment",
        id: 22
    }

    function recursiveAddNew(comments, parent_id, itemOfPatent=null){
        if(Array.isArray(comments)){
            comments.map(c=>{
                if(c.reply && c.reply.length > 0){
                    recursiveAddNew(c.reply,  parent_id, c)
                }

                if(c.id === parent_id ){
                    // nested n level
                    if(itemOfPatent && itemOfPatent.reply) {
                        if(itemOfPatent.reply) {
                            itemOfPatent.reply.push(newComment)
                        } else {
                            itemOfPatent.reply = [newComment]
                        }
                    } else {
                        let idx = comments.findIndex(pc=>pc.id === c.id)
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
```

