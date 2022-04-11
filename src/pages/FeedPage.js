//jshint esversion:9

import { useState, useEffect } from "react";
import { getAllPosts } from './../api';
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

      <AddPost refreshPosts={getPosts}/>

      {posts && posts.map((onePost) => {

        return (

          <PostCard post={onePost} key={onePost._id}/>
        )

      })}

    </Container>
  )
}
