//jshint esversion:9

import { useContext, useState } from "react";
import { addPost, uploadImage } from './../api';
import { AuthContext } from '../context/auth.context';


export const AddPost = ({refreshPosts}) => {

    const { user } = useContext(AuthContext);
    
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    
    
    // ******** this method handles the file upload ********
    const handleFileUpload = async (e) => {
        
        try {
            
            const uploadData = new FormData();
             
            // imageUrl => this name has to be the same as in the model if we pass
            // req.body to .create() method when creating a new post in '/api/posts' POST route

            uploadData.append("imageUrl", e.target.files[0]);

            let response = await uploadImage(uploadData);
            /* console.log("response is: ", response); */
            // response carries "fileUrl" which we can use to update the state
            setImageUrl(response.fileUrl);

        } catch (error) {

            console.log("Error while uploading the file: ", error);
        }

    };

    const handleSubmit = async (e) => {

        e.preventDefault();
        let newPost = {title, body, userId: user._id, imageUrl};
        await addPost(newPost);
        refreshPosts();
        setTitle("");
        setBody("");
        setImageUrl("");

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

            <label>
                <input type="file" onChange={(e) => handleFileUpload(e)} />
            </label>
    
            <button type="submit">Create Post</button>
            </form>
        </div>
    )
}
