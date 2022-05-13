//jshint esversion:9

import { useContext, useState, useEffect, useRef } from 'react';
import { getUser, uploadImage, updateUser, deleteUser } from './../api';
import { AuthContext } from '../context/auth.context';
import { useParams, useNavigate } from 'react-router-dom';
import { SpinnerCircular } from 'spinners-react';

export const EditProfilePage = ({ toastProfileUpdated }) => {
  const { logOutUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [objImageToUpload, setObjImageToUpload] = useState(null);
  let navigate = useNavigate();
  const { userId } = useParams();
  const inputFileUpload = useRef(null);

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
      /* await deleteUser(userId); */
      logOutUser();
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

        let requestBody = { username, email, imageUrl: response.fileUrl };

        await updateUser(requestBody, userId);
      } else {
        let requestBody = { username, email };
        await updateUser(requestBody, userId);
      }
      toastProfileUpdated();
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
        setEmail(userFromDB.data.email);
        setTempImageUrl(userFromDB.data.imageUrl);
      } catch (error) {
        console.log('Something went wront while getting user from DB to update =>', error);
      }
    })();
  }, [userId]);

  return (
    <div className='EditProfilePage min-h-[calc(100vh_-_48px)]'>
      {username ? (
        <div className='card card-compact w-96 bg-base-100 shadow-xl mx-auto top-10 p-2 space-y-4'>
          <div className='card-body'>
            <form onSubmit={handleSubmit} className='space-y-2'>
              <figure className='w-20 h-20 mask mask-squircle'>{tempImageUrl && <img src={tempImageUrl} alt='Post' />}</figure>
              <label>
                <span>Username</span>
                <input type='text' name='username' value={username} onChange={(e) => setUsername(e.target.value)} className={`input  input-primary w-full max-w-md focus:outline-none `} />
              </label>
              <label>
                Email
                <input type='email' name='email' value={email} onChange={(e) => setEmail(e.target.value)} className={`input  input-primary w-full max-w-md focus:outline-none `} />
              </label>
              <div className='card-actions flex justify-between'>
                <button type='button' className='btn btn-error' onClick={removeUser}>
                  Delete
                </button>

                <button type='submit' className='btn btn-primary'>
                  Update
                </button>
              </div>
            </form>

            <div className='card-actions flex justify-between'>
              <input ref={inputFileUpload} className='hidden' type='file' onChange={(e) => handleFileUpload(e)} />
              <button type='button' className='btn btn-active btn-ghost' onClick={() => navigate(-1)}>
                Back
              </button>
              <button type='button' onClick={() => inputFileUpload.current.click()} className='btn btn-active btn-ghost'>
                Choose File
              </button>
            </div>
          </div>
        </div>
      ) : (
        <SpinnerCircular size={90} thickness={115} speed={100} color='rgb(86,13,248)' secondaryColor='rgba(57, 146, 172, 0.48)' className='mx-auto mt-20' />
      )}
    </div>
  );
};
