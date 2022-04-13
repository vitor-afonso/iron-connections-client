// jshint esversion:9

import { useContext, useState, useEffect } from "react";
import { AuthContext } from '../context/auth.context';
import { NavLink, useParams } from "react-router-dom";
import { getUser } from './../api';

export const ProfilePage = () => {
  
  const [userProfile, setUserProfile] = useState(null);
  const { user } = useContext(AuthContext);
  const { userId } = useParams();

  useEffect(()=>{

    (async()=>{
      let response = await getUser(userId);
      setUserProfile(response.data);
    })();

  },[userId]);

  return (
    <div>
      {userProfile ? <div className="profile-header">
          <img src={userProfile.imageUrl} alt={userProfile.username} style={{width: "50px"}}/>
          <span> {userProfile.username} </span>
          
          {user._id === userProfile._id ? <NavLink to={`/users/${userProfile._id}/edit`}><button>Edit Profile</button></NavLink>: <button>Follow</button>}
        </div> : <p>Loading...</p>}
    </div>
  )
}
