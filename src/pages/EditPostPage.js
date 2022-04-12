//jshint esversion:9

import { useContext, useState, useEffect } from "react";
import { getPost, uploadImage, updatePost, deletePost } from './../api';
import { AuthContext } from '../context/auth.context';
import { useParams, useNavigate, NavLink } from "react-router-dom";

export const EditPostPage = () => {

    const { user } = useContext(AuthContext);
    const [body, setBody] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    let navigate = useNavigate();
    const { postId } = useParams();

    useEffect( () => {

        (async()=>{

            try {
                
                let postFromDB = await getPost(postId);
                console.log('postFromDB =>', postFromDB);
                setBody(postFromDB.data.body);
                setImageUrl(postFromDB.data.imageUrl);

            } catch (error) {
                
                console.log('error getting post to update from DB', error);
            }

        })();

    }, [postId]);


    const handleFileUpload = async (e) => {
        
        try {

            const uploadData = new FormData();

            uploadData.append("imageUrl", e.target.files[0]);

            let response = await uploadImage(uploadData);
            
            setImageUrl(response.fileUrl);

        } catch (error) {

            console.log("Error while uploading the file: ", error);
        }

    };

    const removePost = async () => {                    

        try {

            let response = await deletePost(postId);
            console.log(response.data.message);
            navigate("/feed");

        } catch (error) {

            console.log('Something went wront while deleting project from API', error);
        }
        
    }; 

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {
            
            let requestBody = {body, imageUrl};
            await updatePost(requestBody, postId);
            navigate(`/feed`);

        } catch (error) {

            console.log('Something went wront while updating project in API', error);
        }

    };

    return (

        <div className="AddPost">

            {body ? <form onSubmit={handleSubmit}>    
            {user && <img src={user.imageUrl} alt="Author" style={{width: "30px"}}/>}
                
            <label>
                <textarea name="body" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Share your thoughts" style={{ minWidth: "300px"}} />
            </label>

            {imageUrl && <img src={imageUrl} alt="Post" style={{width:"300px"}}/>}

            <label>
                <input type="file" onChange={(e) => handleFileUpload(e)} />
            </label>
            <br/>
            <button type="submit">Update Post</button> 
            
            </form>: <p>Loading...</p>}
            <NavLink to="/feed"><button>Back</button></NavLink>
            <button onClick={removePost}>Delete</button>
        </div>
    )
}
