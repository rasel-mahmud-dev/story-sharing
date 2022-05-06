const initialState = {
  username: "",
  email: "",
  first_name: "",
  _id: ""
}


export default function (state = initialState, action) {
  let updatedState = {...state}
  switch (action.type) {
    case "LOGIN":
      let {token, ...user} = action.payload
      if (token) {
        window.localStorage.setItem("token", token);
      }
      let s = user || {}
      return s
    default:
      return state
  }
}

