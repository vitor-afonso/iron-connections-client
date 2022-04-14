//jshint esversion:9

import { useContext, useState } from "react";
import { AuthContext } from '../context/auth.context';
import { addNewComment } from './../api';

export const AddComment = ({post, refreshAllPosts}) => {

    const { user } = useContext(AuthContext);
    const [content, setContent] = useState("");


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {
            
            let requestBody = {content, userId: user._id};
            await addNewComment(post._id, requestBody);
            setContent("");
            refreshAllPosts();
            

        } catch (error) {
            
            console.log("Error while adding comment to post =>", error);
        }
        
    };

  
  return (

    <div>
        <form onSubmit={handleSubmit}>    
            {user && <img src={user.imageUrl} alt="Author" style={{width: "30px"}}/>}
            
            <label>
                <input type="text" name="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write comment" style={{width: "250px"}}/>

            </label>

            <button type="submit">Comment</button>
        </form>
    </div>
  )
}
