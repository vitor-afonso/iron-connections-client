//jshint esversion:9

import { useContext, useState, useEffect } from "react";
import { AuthContext } from '../context/auth.context';
import { addNewComment, getUser } from './../api';

export const AddComment = ({post, refreshAllPosts, refreshProfileUser}) => {

    const { user } = useContext(AuthContext);
    const [content, setContent] = useState("");
    const [userImageUrl, setUserImageUrl] = useState("");


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {
            
            let requestBody = {content, userId: user._id};
            await addNewComment(post._id, requestBody);
            refreshAllPosts();
            refreshProfileUser();
            setContent("");

        } catch (error) {
            
            console.log("Error while adding comment to post =>", error);
        }
        
    };

    useEffect(() => {
        
        (async()=>{
            let response = await getUser(user._id);
            setUserImageUrl(response.data.imageUrl);
        })();

    },[user]);

  
  return (

    <div>
        <form onSubmit={handleSubmit}>    
            {userImageUrl && <img src={userImageUrl} alt="Author" style={{width: "30px"}}/>}
            
            <label>
                <input type="text" name="content" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write comment" style={{width: "250px"}}/>

            </label>

            <button type="submit">Comment</button>
        </form>
    </div>
  )
}
