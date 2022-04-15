// jshint esversion:9

import { useContext, useState, useEffect } from "react";
import { AuthContext } from '../context/auth.context';
import { NavLink, useParams } from "react-router-dom";
import { getUser, getUsers } from './../api';
import { AddPost } from "../components/AddPost";
import { PostCard } from "../components/PostCard";

export const ProfilePage = ({refreshPosts}) => {

  const [userProfile, setUserProfile] = useState(null);
  const [users, setUsers] = useState(null);
  const { user } = useContext(AuthContext);
  const { userId } = useParams();
  const [sortedListOfPosts, setSortedListOfPosts] = useState([]);

  const getOneUser = async () => {

    try {

      let oneUser = await getUser(userId);

      setUserProfile(oneUser.data);

      setSortedListOfPosts([...oneUser.data.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))]);
      
      
    } catch (error) {

      console.log('Something went wrong while trying to get user in profile =>', error);
    }
      
  };

  useEffect(()=>{

    (async()=>{
      
      try {

        let usersFromDB = await getUsers();
        setUsers(usersFromDB.data);
        getOneUser();

      } catch (error) {
        
        console.log('Something went wrong while trying to get user in profile =>', error);

      }

    })();

  },[]);


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
    
        {user._id === userProfile._id && <AddPost refreshPosts={refreshPosts} refreshUser={getOneUser}/>}

        {userProfile && sortedListOfPosts.map((onePost) => {

          return (

            <PostCard post={onePost} key={onePost._id} />
          )

        })}
      </div>: <p>Loading...</p>}
    </>
  )
}
