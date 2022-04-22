// jshint esversion:9

import { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/auth.context';
import { NavLink, useParams } from 'react-router-dom';
import { getUser, getUsers, getAllPosts } from './../api';
import { AddPost } from '../components/AddPost';
import { PostCard } from '../components/PostCard';

export const ProfilePage = () => {
  const { user } = useContext(AuthContext);

  const [userProfile, setUserProfile] = useState(null);
  const [sortedListOfPosts, setSortedListOfPosts] = useState([]);

  const { userId } = useParams();
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    try {
      let response = await getAllPosts();
      setPosts(response.data);
      /* console.log('all posts =>', response.data); */
    } catch (error) {
      console.log('Something went wrong while trying to get posts from DB =>', error);
    }
  };

  const getOneUser = async () => {
    try {
      let oneUser = await getUser(userId);

      setUserProfile(oneUser.data);

      setSortedListOfPosts([...oneUser.data.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))]);
    } catch (error) {
      console.log('Something went wrong while trying to get user in profile =>', error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        getOneUser();
      } catch (error) {
        console.log('Something went wrong while trying to get user in profile =>', error);
      }
    })();
  }, [userId]);

  return (
    <>
      {userProfile ? (
        <div>
          <div className='profile-header'>
            <img src={userProfile.imageUrl} alt={userProfile.username} style={{ width: '50px' }} />
            <span> {userProfile.username} </span>

            {user._id === userProfile._id && (
              <NavLink to={`/profile/${userProfile._id}/edit`}>
                <button>Edit Profile</button>
              </NavLink>
            )}
          </div>

          {userProfile.followers.length && (
            <div>
              <h6>Connects</h6>
              {userProfile &&
                userProfile.followers.slice(-3).map((user) => {
                  return <img src={user.imageUrl} alt={user.username} style={{ width: '50px' }} key={user._id} />;
                })}
              <NavLink to={`/profile/${userId}/connects`}>See All</NavLink>
            </div>
          )}

          {user._id === userProfile._id && <AddPost refreshPosts={getPosts} refreshUser={getOneUser} />}

          {userProfile &&
            sortedListOfPosts.map((onePost) => {
              return <PostCard post={onePost} key={onePost._id} refreshPosts={getPosts} refreshUser={getOneUser} />;
            })}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};
