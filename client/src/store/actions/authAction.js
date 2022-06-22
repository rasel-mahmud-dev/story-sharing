import api, {getApi} from "../../apis";


export const fetchCurrentAuth = (dispatch) => {
  getApi().get("/api/auth/current-auth").then(response => {
    if (response.status === 201) {
      dispatch({
        type: "LOGIN",
        payload: response.data
      })
      dispatch({
        type: "SET_AUTH_LOADED",
        payload: true
      })
      
    }
  }).catch(err=>{
    dispatch({
      type: "SET_AUTH_LOADED",
      payload: true
    })
    console.log(err.message)
  })
}

export const loginUser = (userData, dispatch, cb)=> {
  
  getApi().post("/api/auth/login", {email: userData.email, password: userData.password})
      .then(response => {
        if (response.status === 201) {
          dispatch({
            type: "LOGIN",
            payload: response.data
          })
            cb(false)
        } else {
            cb(response.data.message)
        }
      })
  .catch(err=> {
      if(err.response){
        cb(err.response.data.message)
      } else {
        cb(err.message)
      }
  })
}


    // dispatch({
    //   type: "LOGIN",
    //   payload: {
    //     id: "1",
    //     username: "rasel",
    //     email: "raselmr005@gmail.com",
    //     avataa
    //     role: "admin"
    //   }
    // })

    // axios.get("https://localhost:1000/api/users").then(doc=>{
    //   console.log(doc)
    // })
    //

