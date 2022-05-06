import React, {useEffect} from "react";
import {Link, useHistory} from "react-router-dom";
import api from "src/apis";
import {useDispatch} from "react-redux";
import {CSSTransition} from "react-transition-group";

const Registration = (props) => {
  const [message, setMessage] = React.useState("")
  const [userData, setUserData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const dispatch = useDispatch()
  const history = useHistory()

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
      if (userData.password !== userData.confirmPassword) {
        setMessage("password not matched")
        return;
      }
      api.post("/api/auth/users", {
        first_name: userData.firstName,
        last_name: userData.lastName,
        email: userData.email,
        password: userData.password,
      }).then(response => {
        if(response.status === 201){
          dispatch({
            type: "LOGIN",
            payload: response.data
          })
          history.push("/")
        } else {}
        setMessage(response.data.message)
      })
      .catch(ex=>{
        if(ex.response){
          setMessage(ex.response.data.message)
        } else {
          setMessage(ex.message)
        }
      })
    } else {
      setMessage("You have to fill all input ")
    }
  }
  
  return (
    <div>
      <div className="container px-15 mx-auto">
        
        <div className="bg-white px-6 py-4 rounded-5 max-w-xl mx-auto">
          <h1 className="text-2xl font-400 text-primary text-center">Create a new account.</h1>

          <CSSTransition unmountOnExit={true} in={message} timeout={500} classNames="my-node" >
            <div className="error-alert">
              <h4>{message}</h4>
            </div>
          </CSSTransition>

          <form onSubmit={handleSubmit} className="py-5">
            
            <div className="flex mb-2 flex flex-col md:flex-row ">
              <label className="font-medium min-w-100px block text-sm font-400 text-gray-dark-4" htmlFor="">First
                Name</label>
              <input
                value={userData.firstName}
                onChange={handleChange}
                placeholder="Enter Your First Name."
                className="input-elem" type="text" name="firstName"/>
            </div>
            
            <div className="flex mb-2 flex flex-col md:flex-row ">
              <label className="font-medium min-w-100px block text-sm font-400 text-gray-dark-4" htmlFor="">Last
                Name</label>
              <input
                value={userData.lastName}
                onChange={handleChange}
                placeholder="Enter Your Last Name."
                className="input-elem " type="text" name="lastName"/>
            </div>
            
            <div className="flex mb-2 flex flex-col md:flex-row ">
              <label className="font-medium min-w-100px block text-sm font-400 text-gray-dark-4"
                     htmlFor="">Email</label>
              <input
                value={userData.email}
                onChange={handleChange}
                placeholder="Enter Your Email."
                className="input-elem "
                type="email" name="email"/>
            </div>
            <div className="flex mb-2 flex flex-col md:flex-row ">
              <label className="font-medium min-w-100px block text-sm font-400 text-gray-dark-4 "
                     htmlFor="">Password</label>
              <input
                value={userData.password}
                onChange={handleChange}
                placeholder="Enter Your Password."
                className="input-elem "
                type="text" name="password"
              />
            </div>
            <div className="flex mb-2 flex flex-col md:flex-row ">
              <label className="font-medium min-w-100px block text-sm font-400 text-gray-dark-4"
                     htmlFor="confirmPassword">Confirm Password</label>
              <input
                value={userData.confirmPassword}
                onChange={handleChange}
                placeholder="Enter Your Password."
                className="input-elem "
                type="text" name="confirmPassword"
              />
            </div>
            <div className="mt-2 mb-3 flex flex-col md:flex-row">
              <h4 className="text-sm font-400">Already have a account?
                <span className="cursor-pointer text-blue-400 p-px ml-0.5 "><Link to="/auth/login">Click</Link></span>
                Login Page </h4>
            
            </div>
            <div>
              <button className="btn mb-2 mt-5 ">Registration
              </button>
            </div>
          </form>
        </div>
      
      </div>
    </div>
  );
};

export default Registration;