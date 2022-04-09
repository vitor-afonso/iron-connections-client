//jshint esversion:9

import { useState, useEffect } from "react";
import { getAllPosts } from './../api';
import { Container } from "react-bootstrap";

export const FeedPage = () => {

  const [posts, setPosts] = useState([]);

  const getPosts = async () => {

    try {

      let response = await getAllPosts();
      setPosts(response.data);
      /* console.log('all posts =>', response.data); */
      
    } catch (error) {

      console.log("No posts... ",error);
    }
      
  };

  // We set this effect will run only once, after the initial render
  // by setting the empty dependency array - []
  useEffect(() => {

    getPosts();
  }, [] );

  return (
    <Container>
      <h3>FeedPage</h3>
      {posts && posts.map((post) => {

        return (
          <div key={post._id}>
            <h5>{post.title}</h5>
            <p>{post.body}</p>
          </div>
        )
      })}
    </Container>
  )
}
