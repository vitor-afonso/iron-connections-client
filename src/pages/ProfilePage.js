// jshint esversion:9

import { useContext, useState, useEffect } from "react";
import { AuthContext } from '../context/auth.context';
import { NavLink, useParams } from "react-router-dom";
import { getUser, getUsers } from './../api';
import { AddPost } from "../components/AddPost";
import { PostCard } from "../components/PostCard";

export const ProfilePage = () => {

  const [userProfile, setUserProfile] = useState(null);
  const [users, setUsers] = useState(null);
  const { user } = useContext(AuthContext);
  const { userId } = useParams();

  useEffect(()=>{

    (async()=>{

      let oneUser = await getUser(userId);
      let usersFromDB = await getUsers();
      setUserProfile(oneUser.data);
      setUsers(usersFromDB.data);

    })();

  },[userId]);

  return (
    <>
      {userProfile ? <div>
        <div className="profile-header">
          <img src={userProfile.imageUrl} alt={userProfile.username} style={{width: "50px"}}/>
          <span> {userProfile.username} </span>
          
          {user._id === userProfile._id ? <NavLink to={`/users/${userProfile._id}/edit`}><button>Edit Profile</button></NavLink>: <button>Follow</button>}
        </div> 
        <div>
          <h6>Connects</h6>
          {users && users.map(user => {
            return (
              
              <img src={user.imageUrl} alt={user.username} style={{width: "50px"}} key={user._id}/>
            );
          })}
          <div>See All</div>
        </div>
        {user._id === userProfile._id && <AddPost />}

        {userProfile.posts && userProfile.posts.map((onePost) => {

          return (

            <PostCard post={onePost} key={onePost._id} />
          )

        })}
      </div>: <p>Loading...</p>}
    </>
  )
}
