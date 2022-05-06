import {createStore, combineReducers, applyMiddleware, compose} from "redux"
import thunk from "redux-thunk"

import postReducer from "./reducers/postReducer"
import appReducer from "./reducers/appReducer"
import authReducer from "./reducers/authReducer"

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
//
//
// export default (initialState) => {
//   return createStore(reducers, initialState={},   composeEnhancers(applyMiddleware(thunk.withExtraArgument(api))))
// }


const reducers = combineReducers({
  postState: postReducer,
  appState: appReducer,
  authState: authReducer
})

export default createStore(reducers, {}, composeEnhancers(applyMiddleware(thunk)))
