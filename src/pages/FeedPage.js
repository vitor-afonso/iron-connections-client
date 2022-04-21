//jshint esversion:9

import { useContext, useEffect, useState } from 'react';
import { getAllPosts, getUser } from '../api';
import { Container } from 'react-bootstrap';
import { PostCard } from '../components/PostCard';
import { AddPost } from '../components/AddPost';
import { AuthContext } from '../context/auth.context';

export const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [followersPostsIds, setFollowersPostsIds] = useState([]);
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

  useEffect(() => {
    getPosts();

    (async () => {
      if (user) {
        let response = await getUser(user._id);
        let followersPosts = [...response.data.followers.map((oneUser) => oneUser.posts)];

        setFollowersPostsIds(followersPosts.flat(Infinity));
      }
    })();
  }, [user]);

  return (
    <Container>
      <h3>FeedPage</h3>

      <AddPost refreshPosts={getPosts} />

      {followersPostsIds &&
        posts &&
        posts.map((onePost) => {
          return <>{followersPostsIds.includes(onePost._id) && <PostCard post={onePost} key={onePost._id} refreshPosts={getPosts} />}</>;
        })}
    </Container>
  );
};
