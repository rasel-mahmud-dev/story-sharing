import React from 'react';
import {Link, useParams, useHistory} from "react-router-dom";

import "./addPost.scss"
import {fetchPostById, fetchPostMdContent, fetchRawMdContent} from "src/store/actions/postAction";
import {useDispatch, useSelector} from "react-redux";
import fullLink from "../../utils/fullLink";
import MultiInput from "../../components/UI/multiInput/MultiInput";
import api, {baseBackend, getApi} from "../../apis";

import MarkdownIt from 'markdown-it';
import MdEditor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import hljs from "highlight.js";
import "highlight.js/styles/atom-one-dark.css"
import Loader from "../../components/UI/Loader";
import {CSSTransition} from "react-transition-group";
import PreloadLink from "../../components/preloadLink/PreloadLink";
import FileUploader from "./fileUploader/FileUploader";

const AddPost = (props) => {

  const dispatch = useDispatch()
  const authState = useSelector(state=>state.authState)

  const [image, setImage] = React.useState("")
  const [loadingState, setLoadingState] = React.useState({
    id: "photo_upload",
    isLoading: false,
    status: "", // "error" || "success"
    message: ""
  })
  const imageInputRef = React.useRef(null)

  const history = useHistory()

  const [markdown_string, setMarkdown_string] = React.useState("")

  
  let [post, setPost] = React.useState({
    title: "",
    tags: [],
    cover: "",
    summary: "",
    isUpdated: false,
    mdContent: ""
  })
  
  const params = useParams()

  
  let m  = new MarkdownIt( {
    html: true,
    linkify: true,
    typographer: true,
    highlight: function (str, lang) {
      if (lang && hljs.getLanguage(lang)) {
        try {
          return hljs.highlight(lang, str).value
        } catch (__) {}
      }
      return "" // use external default escaping
    }
  })

  React.useEffect(()=>{

    if(params.postId && params.postId !== "null"){
      fetchPostById(params.postId, dispatch, (returnPost)=>{
        
        setPost({
          ...post,
          ...returnPost,
          isUpdated: true
        })
        
        // fetch markdown files
        // fetchRawMdContent(returnPost.path, dispatch, (content)=>{
        //   setMarkdown_string(content)
        // })
  
        let req = new XMLHttpRequest()
        req.open("POST", `${baseBackend}/api/raw-md-content`)
        req.responseType = 'text';
        req.onload = function (e){}
        req.onprogress = ev => {}
        /** store chunked markdown html and render it  */
        req.onreadystatechange = function() {
          if(req.response){
            setMarkdown_string((v)=>v+req.response)
          }
        }
        req.setRequestHeader('Content-type', 'application/json')
        req.send(JSON.stringify({
          filePath: returnPost.path
        }));
        
      })
    }
  }, [params.postId])


  function handleChange(e){
    const {name, value, values} = e.target
    let updatedPost = {...post}
    if(name === "tags"){
      updatedPost.tags = values
    } else {
      updatedPost[name] = value
    }
    setPost(updatedPost)
  }
  function onSetUrlToCover(path) {
    if(path && typeof path === "string") {
      setPost(p => {
        return {
          ...p,
          cover: path
        }
      })
    }
  }
  
  async function addPostHandler(e){
    e.preventDefault()
    const { isUpdated, _id, title, tags, cover_url } = post

    if(title && title.trim() && tags.length > 0 && markdown_string){

      if(isUpdated) {

        getApi().post("/api/post/update-post", {
          _id,
          title,
          tags,
          summary: post.summary,
          cover: post.cover ? post.cover : "",
          mdContent: markdown_string
        }).then(response => {
          if(response.status < 400 && response.status >= 200) {
            setLoadingState({
              id: "addpost",
              message: "Post Updated",
              status: 200,
              isLoading: false,
            })
            setTimeout(()=>{
              let path = `/author/profile/${authState.username}/${authState._id}`
              history.push(path)
            }, 500)
          } else {
            setLoadingState({
              id: "addpost",
              message: "Post Update Fail",
              status: 400,
              isLoading: false,
            })
          }
        }).catch(ex=>{
          setLoadingState({
            id: "addpost",
            message: "Post Update Fail",
            status: 400,
            isLoading: false,
          })
        })
      } else {

        let d = {
          title: title.trim(),
          tags,
          summary: post.summary,
          mdContent: markdown_string,
          author_id: authState._id,
          cover: post.cover ? post.cover : ""
        }
        getApi().post("/api/post/add-post", d)
        .then(response=>{
          if(response.status < 400 && response.status >= 200){
            setLoadingState({
              id: "addpost",
              message: "Post Upload Successful",
              status: 200,
              isLoading: false,
            })
            setTimeout(()=>{
              let path = `/author/profile/${authState.username}/${authState._id}`
              // dispatch({
              //   type: "UPDATE_USER_PROFILE_POSTS",
              //   payload: { userId: authState._id, post: response.data }
              // })
              history.push(path)
            }, 500)
          } else{
            setLoadingState({
              id: "addpost",
              message: "Post Upload Fail",
              status: 400,
              isLoading: false,
            })
          }
        }).catch(ex=>{
          console.log(ex)
          setLoadingState({
            id: "addpost",
            message: ex.message,
            status: 400,
            isLoading: false,
          })
        })
      }


    } else{
      setLoadingState({
        id: "addpost",
        message: "Please fill up all input fields",
        status: 400,
        isLoading: false,
      })
    }


  }

  // Initialize a markdown parser
  const mdParser = new MarkdownIt(/* Markdown-it options */);

// Finish!
  function handleEditorChange({ html, text }) {
    setMarkdown_string(text)
    // console.log('handleEditorChange', html, text);
  }


 
  function inputWrapper() {
    return (
        <div className="input_wrapper input-elem dark:bg-dark-600 dark_subtitle flex justify-between">
          <input name="cover" onChange={handleChange}
                 value={post.cover}
             className="outline-none w-full bg-transparent dark_subtitle "
             type="text" placeholder="Paster image full url" />
          {/*<button onClick={()=>coverPhotoInputRef.current && coverPhotoInputRef.current.click()} className="cursor-pointer">Upload</button>*/}
        </div>
    )
  }
  
  return (
    <div className="container-1000 px-4 mt-4">
      <div>
        <PreloadLink to={`/author/profile/${authState.first_name}/${authState._id}`} className="font-medium text-primary ">Back to Profile</PreloadLink>
      </div>
      <h1 className="title text-lg text-center font-bold dark_title">{post.isUpdated ? "Update Post" : "Add New Post"}</h1>
      

      {loadingState.id === "addpost" &&
        <CSSTransition unmountOnExit={true} in={loadingState.message} timeout={450} classNames="my-node">
          <div className={["alert-message", loadingState.status === 400 ? "error-alert" : "success-alert"].join(" ")}>
            <h4>{loadingState.message}</h4>
          </div>
        </CSSTransition>
      }
      
      <div>
  
        <div className="add-post-form">
          
          <div className="form-group flex-col">
            <label className="block no-wrap text-sm dark_subtitle" htmlFor="">Post Title</label>
            <input
              onChange={handleChange}
              type="text"
              name="title"
              value={post.title}
              className="input-elem dark:bg-dark-600 dark_subtitle" />
          </div>
          
          <div className="form-group flex-col">
            <label className="block no-wrap text-sm dark_subtitle" htmlFor="">Post cover photo</label>
            {inputWrapper()}
            {/*<input type="file" ref={coverPhotoInputRef} hidden={true} accept="image/*" onChange={handleChangeCoverPhoto} />*/}
          </div>
          <div className="w-full">
            {/*{cover.base && (*/}
            {/*    <img className="w-full" src={cover.base} alt="" />*/}
            {/*)}*/}
          </div>
          <div className="w-full">
            {post.cover && (
              <img className="w-full" src={fullLink(post.cover)} alt=""/>
            )}
          </div>
          
          <div className="form-group flex-col">
            <label className="block no-wrap text-sm dark_subtitle" htmlFor="">Tags</label>
            <MultiInput name="tags" onChange={handleChange} defaultValues={post.tags} />
          </div>

          <div>
             <div>
               
               <FileUploader onSetUrlToCover={onSetUrlToCover} />
               
               { loadingState.id === "photo_upload" && loadingState.isLoading && (
                   <div className="flex flex-col  items-center">
                     <Loader/>
                     <h5 className="dark_subtitle">Uploading...</h5>
                   </div>
               ) }

               {loadingState.id === "photo_upload" &&
                 <CSSTransition unmountOnExit={true} in={loadingState.message} timeout={450} classNames="my-node">
                   <div className={loadingState.status === 400 ? "error-alert" : "success-alert"}>
                     <h4 className="dark_subtitle">{loadingState.message}</h4>
                   </div>
                 </CSSTransition>
               }

               {  image && <p
                   onClick={handleClickToCopy}
                   className="mt-t text-xs px-2 outline-none font-medium cursor-pointer hover:bg-primary hover:text-white "
               >{image}</p>
                }
               <div className="max-w-xl">
                 { image && <img className="responsive-image" src={image} alt=""/> }
               </div>
             </div>
            <div className="form-group flex-col">
              <label className="block no-wrap text-sm dark_subtitle" htmlFor="">Summary</label>
              <textarea
                onChange={handleChange}
                name="summary"
                rows={5}
                defaultValue={post.summary}
                className="input-elem dark:bg-dark-600 dark_subtitle"  />
            </div>
            <div className="form-group flex-col">
              <label className="block no-wrap text-sm dark_subtitle" htmlFor="">Article</label>

              <MdEditor
                  value={markdown_string}
                  style={{ height: "500px" }}
                  renderHTML={(text) => m.render(text)}
                  onChange={handleEditorChange}
                  className=""
              />
              {/*<textarea style={{ minHeight: post.isUpdated ? "500px": "200px" }} className="input-elem ml-5" defaultValue={post.mdContent}></textarea>*/}
            </div>

          </div>
          
          <button onClick={addPostHandler} className="btn btn-primary dark:bg-dark-600 dark_subtitle">{post.isUpdated ? "Update" : "Add Post"}</button>

        </div>
        
      </div>
      
      
      
    </div>
  );
};


export default AddPost;