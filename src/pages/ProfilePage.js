// jshint esversion:9

import { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/auth.context';
import { NavLink, useParams, useSearchParams } from 'react-router-dom';
import { getUser, getAllPosts } from './../api';
import { AddPost } from '../components/AddPost';
import { PostCard } from '../components/PostCard';
import Aos from 'aos';
import 'aos/dist/aos.css';

export const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);
  const [sortedListOfPosts, setSortedListOfPosts] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const { userId } = useParams();
  const postRef = useRef();

  const getOneUser = async () => {
    try {
      let oneUser = await getUser(userId);
      setUserProfile(oneUser.data);

      setSortedListOfPosts([...oneUser.data.posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))]);

      /* console.log('postId from query =>', searchParams.get('postId')); */
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

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (postRef.current) {
        postRef.current.scrollIntoView({ behavior: 'smooth' });
        postRef.current.style.border = '1px solid blue';
        postRef.current.style.borderRadius = '15px';
      }
    }, 1000);

    setTimeout(() => {
      if (postRef.current) {
        postRef.current.style.border = 'none';
      }
    }, 3000);
  }, [postRef]);

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

          {user._id === userProfile._id && <AddPost refreshUser={getOneUser} />}
          <div className='postCards-container'>
            {userProfile &&
              sortedListOfPosts.map((onePost) => {
                if (searchParams.get('postId') && searchParams.get('postId') === onePost._id) {
                  return (
                    <div ref={postRef} key={onePost._id}>
                      <PostCard id={`#${onePost._id}`} post={onePost} refreshUser={getOneUser} />
                    </div>
                  );
                }
                return (
                  <div key={onePost._id}>
                    <PostCard className={onePost._id} post={onePost} refreshUser={getOneUser} />
                  </div>
                );
              })}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
};
