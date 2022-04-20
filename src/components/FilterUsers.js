//jshint esversion:9

import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

export const FilterUsers = ({usersList, userFollowersIds, currentUser, handleAddFollower}) => {

    const [users, setUsers] = useState("");
    const [str, setStr] = useState("");

    useEffect(()=>{
        
        let sortedUsersList = usersList.sort((a, b) => a.username.toLowerCase() > b.username.toLowerCase()? 1 : -1);
        
        if (str === "") {

            setUsers(sortedUsersList);

        } else {

            let filteredUsers = sortedUsersList.filter( user => user.username.toLowerCase().includes(str.toLowerCase()) );
            setUsers(filteredUsers);
        }

    },[str, usersList]);

  return (

    <div> FilterUsers: 

        <label>
            <input type="text" name="search" value={str} onChange={(e) => setStr(e.target.value) }/>
        </label>

        {users.length && users.map((oneUser) => {

          return (

            <div key={oneUser._id}>

              <NavLink to={`/profile/${oneUser._id}`}>
                <img
                  src={oneUser.imageUrl}
                  alt={oneUser.username}
                  style={{ width: "30px" }}
                />
              </NavLink>

              <span>{oneUser.username}</span>

              {currentUser._id !== oneUser._id && !userFollowersIds.includes(oneUser._id) && (

                <button onClick={() => handleAddFollower(oneUser._id)}> Follow </button>
              )}

            </div>
          );
        })}
    </div>
  )
}
