//jshint esversion:9

import { useEffect, useState } from "react";
import { getAllPosts } from "../api";
import { Container } from "react-bootstrap";
import { PostCard } from "../components/PostCard";
import { AddPost } from "../components/AddPost";

export const FeedPage = () => {
  const [posts, setPosts] = useState([]);

  const getPosts = async () => {
    try {
      let response = await getAllPosts();
      setPosts(response.data);
      /* console.log('all posts =>', response.data); */
    } catch (error) {
      console.log(
        "Something went wrong while trying to get posts from DB =>",
        error
      );
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <Container>
      <h3>FeedPage</h3>

      <AddPost refreshPosts={getPosts} />

      {posts &&
        posts.map((onePost) => {
          return (
            <PostCard
              post={onePost}
              key={onePost._id}
              refreshPosts={getPosts}
            />
          );
        })}
    </Container>
  );
};
