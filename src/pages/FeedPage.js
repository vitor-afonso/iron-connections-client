//jshint esversion:9

import { useState, useEffect } from "react";
import { getAllPosts } from './../api';

export const FeedPage = () => {

    const [posts, setPosts] = useState([]);

  const getPosts = async () => {

    try {

      let response = await getAllPosts();
      setPosts(response.data);
      console.log('all posts =>', response.data);
      
    } catch (error) {

      console.log(error);
    }
      
  };

  // We set this effect will run only once, after the initial render
  // by setting the empty dependency array - []
  useEffect(() => {
    getPosts();
  }, [] );

  return (
    <div>
        <h3>FeedPage</h3>
    {posts.map((post) => {

        return (

            <>
                <h5>{post.title}</h5>
                <p>{post.body}</p>
            </>
        )
    }  )}
    </div>
  )
}
