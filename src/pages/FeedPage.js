//jshint esversion:9

import { useContext, useEffect, useState, React } from 'react';
import { getAllPosts, getUser } from '../api';
import { PostCard } from '../components/PostCard';
import { AddPost } from '../components/AddPost';
import { AuthContext } from '../context/auth.context';
import Aos from 'aos';
import 'aos/dist/aos.css';

export const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [allPostsIdsToDisplay, setAllPostsIdsToDisplay] = useState([]);
  const { user } = useContext(AuthContext);

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
    }
  };

  useEffect(() => {
    getPosts();
    getOneUser();
  }, [user]);

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  return (
    <div className='FeedPage pt-28 flex justify-center'>
      <AddPost refreshPosts={getPosts} refreshUser={getOneUser} />
      <div className='t-20 space-y-4'>
        {allPostsIdsToDisplay &&
          posts &&
          posts.map((onePost) => {
            return (
              <div key={onePost._id} className='first:mt-28 last:pb-4'>
                {allPostsIdsToDisplay.includes(onePost._id) && <PostCard post={onePost} refreshPosts={getPosts} />}
              </div>
            );
          })}
      </div>
    </div>
  );
};
