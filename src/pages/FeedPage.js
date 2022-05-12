//jshint esversion:9

import { useContext, useEffect, useState, React } from 'react';
import { getAllPosts, getUser } from '../api';
import { PostCard } from '../components/PostCard';
import { AddPost } from '../components/AddPost';
import { AuthContext } from '../context/auth.context';

export const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [allPostsIdsToDisplay, setAllPostsIdsToDisplay] = useState([]);
  const { user } = useContext(AuthContext);

  const getPosts = async () => {
    try {
      let response = await getAllPosts();
      setPosts(response.data);
      console.log('all posts =>', response.data);
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
    }
  };

  useEffect(() => {
    getPosts();
    getOneUser();
  }, [user]);

  return (
    <div className='FeedPage pt-20 flex justify-center min-h-[calc(100vh_-_48px)] pb-4'>
      <div className='fixed top-12 w-full z-10 h-3 bg-slate-200'></div>
      <AddPost refreshPosts={getPosts} refreshUser={getOneUser} />

      <div className='pt-1 space-y-4 w-full max-w-lg'>
        {allPostsIdsToDisplay &&
          posts &&
          posts.map((onePost) => {
            return (
              <div key={onePost._id} className='first:mt-28'>
                {allPostsIdsToDisplay.includes(onePost._id) && <PostCard post={onePost} refreshPosts={getPosts} />}
              </div>
            );
          })}
      </div>
    </div>
  );
};
