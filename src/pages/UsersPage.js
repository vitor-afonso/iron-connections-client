//jshint esversion:9
import { useContext, useEffect } from "react";
import { AuthContext } from '../context/auth.context';

import { NavLink } from "react-router-dom";

export const UsersPage = ({allUsers, refreshAllUsers}) => {

    const { user } = useContext(AuthContext);

    useEffect(() => {

        refreshAllUsers();
    
    }, [] );
    
  return (

    <div>UsersPage
    
        {allUsers && allUsers.map(oneUser => {
            

            return (

                <div>
                    <NavLink to={`/profile/${oneUser._id}`}>   
                        <img src={oneUser.imageUrl} alt={oneUser.username} style={{width: "30px"}} />
                    </NavLink>
                    <span>{oneUser.username}</span> 
                    {user._id !== oneUser._id && <button>Follow</button>}
                </div>
            )
        })}
    
    </div>

  )
}
