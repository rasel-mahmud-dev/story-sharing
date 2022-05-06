import React from 'react';
import api from "src/apis";
import fullLink from "../../utils/fullLink";
import {Link} from "react-router-dom";

const Peoples = (props) => {
  let [users, setUsers] = React.useState([])
  
  React.useEffect(() => {
    api.get("/backend/peoples").then(response => {
      setUsers(response.data)
    })
  }, [])
  
  return (
    <div className="max-w-screen-2xl mx-auto px-2">
      <h1>Find Some Friend</h1>
      <ul>
        {users.map((user, i) => (
          <div key={i}>
            <li className="flex justify-between my-3">
              <span className="flex">
                <span className="w-6">
                  {user.avatar ? (
                    <img className="rounded-2xl w-full" src={fullLink(user.avatar)} alt=""/>
                  ) : (
                    <i className="fa text-2xl fa-user-circle"/>
                  )}
                </span>
                <Link to="/user/profile" className="ml-2">{user.username}</Link>
              </span>
              <button className="btn">Add Friend</button>
            </li>
          
          </div>
        ))}
      </ul>
    
    </div>
  );
};

export default Peoples;