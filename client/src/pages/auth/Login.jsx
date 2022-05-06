import React, {useEffect, Suspense} from "react";
import {Link, useHistory, Switch, Route} from "react-router-dom";
import {useDispatch} from "react-redux"
import { loginUser } from "src/store/actions/authAction";
import {CSSTransition} from "react-transition-group";
import "./Login.scss"
import ReactLazyPreload from "../../utils/ReactLazyPreload";
import ProgressBar from "react-topbar-progress-indicator";

const ForgetPassword = ReactLazyPreload(()=>import("src/pages/auth/ForgetPassword"));
const SetNewPassword = ReactLazyPreload(()=>import("src/pages/auth/SetNewPassword"));




const Login = (props) => {
  
  const dispatch = useDispatch()
  const history = useHistory()

  const [message, setMessage] = React.useState("")

  const [userData, setUserData] = React.useState({
    email: "",
    password: "",
  })
  
  
  function handleChange(e) {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value.trim()
    })
  }
  
  function handleSubmit(e) {
    e.preventDefault()
    setMessage("")
    let complete = true;
    for (const userDataKey in userData) {
      if (!userData[userDataKey]) {
        complete = false
      }
    }
    if (complete) {
      if(userData.email === "rasel.mahmud.dev@gmail.com"){
        // alert("rasel.mahmud.dev@gmail.com")
      } else {
        loginUser(userData, dispatch, (err) => {
          if (err) {
            setMessage(err)
          } else {
            history.push("/")
          }
        })
      }
    } else {
      setMessage("You have to fill all field")
    }
  }

  function renderNestedRoutes(){
    return (
      <div className="px-3">
        <Switch>
          <Suspense fallback={<ProgressBar/>}>
            <Route exact={true} path="/auth/login">{loginComponentRender()}</Route>
            <Route
              path="/auth/login/reset-password"
              render={()=><ForgetPassword {...props} email={userData.email} />}
            />
            <Route
              path="/auth/login/new-password/:token"
              render={()=><SetNewPassword {...props} email={userData.email} />}
            />
          </Suspense>
        </Switch>
      </div>
    )
  }
  
  function loginComponentRender(){
    return (
      <div className="bg-white px-6 py-4 rounded-5 max-w-xl mx-auto">
        <h1 className="text-2xl font-400 text-gray-light-7 text-center mb-5">Login in your Account.</h1>
    
        <CSSTransition unmountOnExit={true} in={message} timeout={500} classNames="my-node" >
          <div className="error-alert">
            <h4>{message}</h4>
          </div>
        </CSSTransition>
    
        <form onSubmit={handleSubmit} className="py-5">
          <div className=" flex mb-2 flex-col md:flex-row">
            <label
              className="font-medium min-w-100px block text-sm font-400 text-gray-dark-4"
              htmlFor="">Email</label>
            <input
              onChange={handleChange}
              value={userData.email}
              placeholder="Enter Your Email."
              className="input-elem" type="text" name="email"/>
          </div>
          <div className="mb-2 flex flex-col md:flex-row ">
            <label className="font-medium min-w-100px block text-sm font-400 text-gray-dark-4 "
                   htmlFor="">Password</label>
            <input
              onChange={handleChange}
              value={userData.password}
              placeholder="Enter Your Password."
              className="w-full input-elem"
              type="text" name="password"
            />
          </div>
          <div className="mt-4 mb-2 flex flex-col md:flex-row">
            <div>
              <h4 className="text-sm font-400">Not have a account?
                <span className="cursor-pointer text-blue-400 p-px ml-0.5 ">
                  <Link to="/auth/registration">Create a account new account</Link>
                </span>
              </h4>
          
              <span className="cursor-pointer text-blue-400 p-px">
                  <Link to="/auth/login/reset-password">Forget password ?</Link>
                </span>
        
            </div>
          </div>
          <div>
            <button className="btn">Login</button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div>
      <div className="container mx-auto">
  
        {renderNestedRoutes()}
      
      </div>
    </div>
  );
};

export default Login;