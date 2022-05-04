// jshint esversion:9

import { useContext, useState, useEffect, useRef } from 'react';
import { AuthContext } from '../context/auth.context';
import { Link, NavLink, useParams, useSearchParams } from 'react-router-dom';
import { getUser } from './../api';
import { AddPost } from '../components/AddPost';
import { PostCard } from '../components/PostCard';
import Aos from 'aos';
import 'aos/dist/aos.css';

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
        <div className=' pt-16 flex flex-col justify-center items-center p-4 space-y-4'>
          {/* <!-- Card header --> */}
          <div className='flex justify-start items-center mb-3 w-full bg-slate-500 p-4 rounded-md max-w-[480px]'>
            {/* <!-- Icon --> */}
            <div className='avatar mr-3'>
              <div className='mask mask-squircle w-10 h-10'>{userProfile.imageUrl && <img src={userProfile.imageUrl} alt={userProfile.username} />}</div>
            </div>
            {/* <!-- Name & Button --> */}
            <div className='flex items-center w-full justify-between font-v+base text-lg text-gray-50 truncate mb-1 sm:mb-0'>
              {userProfile.username}
              {userProfile._id === user._id && (
                <Link to={`/profile/${userProfile._id}/edit`}>
                  <button className='btn btn-active btn-ghost'>Edit</button>
                </Link>
              )}
            </div>
          </div>

          {userProfile.followers.length && (
            <div className='flex flex-col '>
              <h6 className='self-start'>Connects</h6>
              <div className='flex'>
                {userProfile &&
                  userProfile.followers.slice(-3).map((user) => {
                    return <img src={user.imageUrl} alt={user.username} style={{ width: '50px' }} key={user._id} />;
                  })}
              </div>
              <NavLink to={`/profile/${userId}/connects`} className='self-end'>
                See All
              </NavLink>
            </div>
          )}

          {user._id === userProfile._id && (
            <div className='w-full max-w-[480px] flex '>
              <AddPost refreshUser={getOneUser} />
            </div>
          )}

          <div className='postCards-container mt-4 space-y-4'>
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
