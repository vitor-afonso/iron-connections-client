//jshint esversion:9

import { useContext, useEffect, useState, React } from 'react';
import { getAllPosts, getUser } from '../api';
import { PostCard } from '../components/PostCard';
import { AddPost } from '../components/AddPost';
import { AuthContext } from '../context/auth.context';
import { SpinnerCircular } from 'spinners-react';
import { useNavigate } from 'react-router-dom';

export const FeedPage = ({ deletedCommentToast }) => {
  const [posts, setPosts] = useState([]);
  const [isNewUser, setIsNewUser] = useState(true);
  const [allPostsIdsToDisplay, setAllPostsIdsToDisplay] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

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
    if (user) {
      let response = await getUser(user._id);
      let currentUserPostsIds = response.data.posts.map((onePost) => onePost._id);
      let followersPosts = [...response.data.followers.map((oneUser) => oneUser.posts)];
      setAllPostsIdsToDisplay([...currentUserPostsIds, ...followersPosts.flat(Infinity)]);

      if (response.data.followers.length === 0 && response.data.posts.length === 0) {
        setIsNewUser(true);
        setTimeout(() => navigate('/users'), 10000);
      }
      if (response.data.followers.length !== 0 || response.data.posts.length !== 0) {
        setIsNewUser(false);
      }
    }
  };

  useEffect(() => {
    getPosts();
    getOneUser();
  }, [user]);

  return (
    <div className='FeedPage pt-20 flex justify-center min-h-[calc(100vh_-_48px)] pb-4'>
      <div className='fixed top-12 w-full z-10 h-3 bg-slate-200 '></div>
      <AddPost refreshPosts={getPosts} refreshUser={getOneUser} />
      {isNewUser && (
        <p className='fixed mx-4 max-w-[480px] shadow-md border-2 border-indigo-600 bg-white p-4 rounded-md text-indigo-600 font-base text-lg mt-28'>
          New to IronConnections?! Please consider starting by following any of the existing users for a better user experience.
          <br /> <small className='text-gray-500'>You will soon be redirected.</small>
        </p>
      )}
      {posts.length !== 0 ? (
        <div className='pt-1 space-y-4 w-full max-w-lg'>
          {allPostsIdsToDisplay &&
            posts &&
            posts.map((onePost) => {
              return (
                <div key={onePost._id} className='first:mt-28'>
                  {allPostsIdsToDisplay.includes(onePost._id) && <PostCard post={onePost} refreshPosts={getPosts} deletedCommentToast={deletedCommentToast} />}
                </div>
              );
            })}
        </div>
      ) : (
        <SpinnerCircular size={90} thickness={115} speed={100} color='rgb(86,13,248)' secondaryColor='rgba(57, 146, 172, 0.48)' className='' />
      )}
    </div>
  );
};
