//jshint esversion:9

import { useContext, useState, useEffect } from 'react';
import { getUser, uploadImage, updateUser, deleteUser } from './../api';
import { AuthContext } from '../context/auth.context';
import { useParams, useNavigate, NavLink } from 'react-router-dom';

export const EditProfilePage = () => {
  const { user } = useContext(AuthContext);
  const [username, setUsername] = useState('');
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [objImageToUpload, setObjImageToUpload] = useState(null);
  let navigate = useNavigate();
  const { userId } = useParams();

  const handleFileUpload = async (e) => {
    try {
      if (e.target.files.lenght !== 0) {
        setTempImageUrl(URL.createObjectURL(e.target.files[0]));
        setObjImageToUpload(e.target.files[0]);
      }
    } catch (error) {
      console.log('Error while uploading the file: ', error);
    }
  };

  const removeUser = async () => {
    try {
      let response = await deleteUser(userId);

      navigate(`/profile/${userId}`);
    } catch (error) {
      console.log('Something went wront while deleting user from API', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (objImageToUpload) {
        const uploadData = new FormData();

        uploadData.append('imageUrl', objImageToUpload);

        let response = await uploadImage(uploadData);

        let requestBody = { username, imageUrl: response.fileUrl };

        await updateUser(requestBody, userId);
      } else {
        let requestBody = { username };
        await updateUser(requestBody, userId);
      }

      navigate(`/profile/${userId}`);
    } catch (error) {
      console.log('Something went wront while updating User', error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        let userFromDB = await getUser(userId);
        setUsername(userFromDB.data.username);
        setTempImageUrl(userFromDB.data.imageUrl);
      } catch (error) {
        console.log('Something went wront while getting user from DB to update =>', error);
      }
    })();
  }, [userId]);

  return (
    <div className='EditProfilePage'>
      {username ? (
        <form onSubmit={handleSubmit}>
          <label>
            Username:
            <input type='text' name='username' value={username} onChange={(e) => setUsername(e.target.value)} />
          </label>

          <label>
            <input type='file' onChange={(e) => handleFileUpload(e)} />
          </label>

          {tempImageUrl && <img src={tempImageUrl} alt='User' style={{ width: '100px' }} />}

          <br />
          <button type='submit'>Update User</button>
        </form>
      ) : (
        <p>Loading...</p>
      )}

      <NavLink to={`/profile/${userId}`}>
        <button>Back</button>
      </NavLink>

      <button onClick={removeUser}>Delete</button>
    </div>
  );
};
