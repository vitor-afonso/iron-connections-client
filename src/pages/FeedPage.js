//jshint esversion:9

import { useContext, useEffect, useState } from 'react';
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
    <div className='postCards-container'>
      <AddPost refreshPosts={getPosts} refreshUser={getOneUser} />

      {allPostsIdsToDisplay &&
        posts &&
        posts.map((onePost) => {
          return (
            <div className='postCard-container' data-aos='fade-up' key={onePost._id}>
              {allPostsIdsToDisplay.includes(onePost._id) && <PostCard post={onePost} refreshPosts={getPosts} />}
            </div>
          );
        })}
    </div>
  );
};
