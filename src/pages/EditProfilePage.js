//jshint esversion:9

import { useContext, useState, useEffect } from "react";
import { getUser, uploadImage, updateUser, deleteUser } from './../api';
import { AuthContext } from '../context/auth.context';
import { useParams, useNavigate, NavLink } from "react-router-dom";

export const EditProfilePage = () => {

    const { user } = useContext(AuthContext);
    const [username, setUsername] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    let navigate = useNavigate();
    const { userId } = useParams();


    const handleFileUpload = async (e) => {
        
        try {

            const uploadData = new FormData();

            uploadData.append("imageUrl", e.target.files[0]);

            let response = await uploadImage(uploadData);
            
            setImageUrl(response.fileUrl);

        } catch (error) {

            console.log("Error while uploading the file to update user =>", error);
        }

    };
    
    const removeUser = async () => {                    

        try {

            let response = await deleteUser(userId);
            console.log(response.data.message);
            navigate(`/profile/${userId}`);

        } catch (error) {

            console.log('Something went wront while deleting user from API', error);
        }
        
    }; 

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {
            
            let requestBody = {username, imageUrl};
            await updateUser(requestBody, userId);
            navigate(`/profile/${userId}`);

        } catch (error) {

            console.log('Something went wront while updating User', error);
        }

    };

    useEffect( () => {
        
        (async()=>{

            try {
                
                let userFromDB = await getUser(userId);
                setUsername(userFromDB.data.username);
                setImageUrl(userFromDB.data.imageUrl);

            } catch (error) {
                
                console.log('Something went wront while getting user from DB to update =>', error);
            }

        })();

    }, [userId]);




  return (
    <div className="EditProfilePage">

            {username ? <form onSubmit={handleSubmit}>    
                
                <label>Username:
                    <input type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value)} />
                </label>

                <label>
                    <input type="file" onChange={(e) => handleFileUpload(e)} />
                </label>

                {imageUrl && <img src={imageUrl} alt="User" style={{width:"100px"}}/>}

                <br/>
                <button type="submit">Update User</button> 
            
            </form>: <p>Loading...</p>}

            <NavLink to="/feed" ><button>Back</button></NavLink>

            <button onClick={removeUser}>Delete</button>
        </div>
  )
}
