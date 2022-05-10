// jshint esversion:9

import { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/auth.context';
import { Link, NavLink, useParams, useSearchParams } from 'react-router-dom';
import { getUser } from './../api';
import { AddPost } from '../components/AddPost';
import { PostCard } from '../components/PostCard';

export const ProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [userProfile, setUserProfile] = useState(null);
  const [sortedListOfPosts, setSortedListOfPosts] = useState([]);
  const [searchParams] = useSearchParams();
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
    setTimeout(() => {
      if (postRef.current) {
        postRef.current.scrollIntoView({ behavior: 'smooth' });
        postRef.current.style.border = '5px solid #570DF8';
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
    <div className='ProfilePage min-h-[calc(100vh_-_48px)] pb-4'>
      {userProfile ? (
        <div className=' flex flex-col justify-start items-center pt-4 px-4 space-y-4 '>
          {/* <!-- Card header --> */}
          <div className='flex justify-start items-center shadow-md w-full border-2 border-indigo-600 bg-indigo-100 p-4 rounded-md max-w-lg'>
            {/* <!-- Icon --> */}
            <div className='avatar mr-3'>
              <div className='mask mask-squircle w-10 h-10'>{userProfile.imageUrl && <img src={userProfile.imageUrl} alt={userProfile.username} />}</div>
            </div>
            {/* <!-- Name & Button --> */}
            <div className='flex items-center w-full justify-between text-lg text-gray-800 font-semibold mb-1 sm:mb-0'>
              {userProfile.username}
              {userProfile._id === user._id && (
                <Link to={`/profile/${userProfile._id}/edit`}>
                  <button className='btn border-2 btn-primary border-indigo-600 shadow-sm bg-white text-indigo-600 hover:text-gray-100 '>Edit</button>
                </Link>
              )}
            </div>
          </div>
          {/* <!-- Followers --> */}
          {userProfile.followers.length !== 0 && (
            <div className='flex flex-col w-full max-w-lg shadow-md border-2 border-indigo-600 bg-white p-4 rounded-md text-indigo-600 font-base text-lg'>
              <h6 className='self-start'>{userProfile.username.split(' ')[0]} connections</h6>
              <div className='flex self-center py-4'>
                {userProfile &&
                  userProfile.followers.slice(-3).map((user) => {
                    return (
                      <div className='avatar mr-3' key={user._id}>
                        <div className='mask mask-squircle w-12 h-12'>{userProfile.imageUrl && <img src={user.imageUrl} alt={user.username} />}</div>
                      </div>
                    );
                  })}
              </div>
              <NavLink to={`/profile/${userId}/connects`} className='self-end'>
                See All
              </NavLink>
            </div>
          )}

          {user._id === userProfile._id && (
            <div className='w-full max-w-lg flex z-0 '>
              <AddPost refreshUser={getOneUser} />
            </div>
          )}

          <div className='postCards-container mt-4 space-y-4 w-full max-w-lg mb-4'>
            {userProfile &&
              sortedListOfPosts.map((onePost) => {
                if (searchParams.get('postId') && searchParams.get('postId') === onePost._id) {
                  return (
                    <div ref={postRef} key={onePost._id}>
                      <PostCard id={`#${onePost._id}`} post={onePost} refreshUser={getOneUser} />
                    </div>
                  );
                } else {
                  return (
                    <div key={onePost._id}>
                      <PostCard className={onePost._id} post={onePost} refreshUser={getOneUser} />
                    </div>
                  );
                }
              })}
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};
