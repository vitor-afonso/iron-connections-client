//jshint esversion:9

import { useEffect } from "react";
import { Container } from "react-bootstrap";
import { PostCard } from "../components/PostCard";
import { AddPost } from "../components/AddPost";


export const FeedPage = ({posts, refreshPosts}) => {
  
  useEffect(() => {

    refreshPosts();

  }, [] );

  return (

    <Container>

      <h3>FeedPage</h3>

      <AddPost refreshPosts={refreshPosts}/>

      {posts && posts.map((onePost) => {

        return (

          <PostCard post={onePost} key={onePost._id} refreshPosts={refreshPosts} />
        )

      })}

    </Container>
  )
}
