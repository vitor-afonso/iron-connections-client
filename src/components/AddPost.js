//jshint esversion:9

import { useState } from "react";
import { addPost } from './../api';
import { useContext } from "react";
import { AuthContext } from '../context/auth.context';


export const AddPost = ({refreshPosts}) => {

    
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  const { user } = useContext(AuthContext);

  const handleSubmit = async (e) => {

    e.preventDefault();
    let newPost = {title, body, userId: user._id};
    await addPost(newPost);
    refreshPosts();
    setTitle("");
    setBody("");

  };

  return (
    <div className="AddPost">
        <form onSubmit={handleSubmit}>    
          {user && <img src={user.imageUrl} alt="Author" style={{width: "30px"}}/>}
          <label>
            <input type="text" name="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Post title" />
          </label>   
             
          <label>
            <input type="text" name="body" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Post body" />
          </label>
   
          <button type="submit">Create Post</button>
        </form>
      </div>
  )
}
