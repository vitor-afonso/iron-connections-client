//jshint esversion:9

import { useContext, useState, useEffect } from 'react';
import { getPost, getNotifications, uploadImage, updatePost, deletePost, removeUserNotification, getUsers, deleteNotification } from './../api';
import { AuthContext } from '../context/auth.context';
import { useParams, useNavigate, NavLink } from 'react-router-dom';

export const EditPostPage = () => {
  const { user } = useContext(AuthContext);
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  let navigate = useNavigate();

  const { postId } = useParams();

  const handleFileUpload = async (e) => {
    try {
      const uploadData = new FormData();

      uploadData.append('imageUrl', e.target.files[0]);

      let response = await uploadImage(uploadData);

      setImageUrl(response.fileUrl);
    } catch (error) {
      console.log('Error while uploading the file: ', error);
    }
  };

  const removePost = async () => {
    try {
      let response = await deletePost(postId);
      console.log(response.data.message);

      let res = await getNotifications();

      let postNotification = res.data.find((notification) => notification.postId === postId);

      let deleteMessage = await deleteNotification(postNotification._id);

      console.log('Message from deleting notification =>', deleteMessage.data.message);
      removeUsersNotification(postNotification._id);

      navigate(-1);
    } catch (error) {
      console.log('Something went wront while deleting post from API', error);
    }
  };

  const removeUsersNotification = async (notificationId) => {
    // call users and filter the array of notifications
    try {
      let response = await getUsers();
      let allUsers = response.data;
      allUsers.forEach((user) => {
        if (user.notifications.includes(notificationId)) {
          removeUserNotification({ notificationId: notificationId }, user._id);
        }
      });
    } catch (error) {
      console.log('Something went wront while deleting notification from users notifications', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let requestBody = { body, imageUrl };
      await updatePost(requestBody, postId);
      navigate(-1);
    } catch (error) {
      console.log('Something went wront while updating project in API', error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        let postFromDB = await getPost(postId);

        setBody(postFromDB.data.body);
        setImageUrl(postFromDB.data.imageUrl);
        console.log('postId of post to update/delete =>', postId);
      } catch (error) {
        console.log('error getting post to update from DB', error);
      }
    })();
  }, [postId]);
  return (
    <div className='AddPost'>
      {body ? (
        <form onSubmit={handleSubmit}>
          {user && <img src={user.imageUrl} alt='Author' style={{ width: '30px' }} />}

          <label>
            <textarea name='body' value={body} onChange={(e) => setBody(e.target.value)} placeholder='Share your thoughts' style={{ minWidth: '300px' }} />
          </label>

          {imageUrl && <img src={imageUrl} alt='Post' style={{ width: '300px' }} />}

          <label>
            <input type='file' onChange={(e) => handleFileUpload(e)} />
          </label>
          <br />
          <button type='submit'>Update Post</button>
        </form>
      ) : (
        <p>Loading...</p>
      )}
      <NavLink to='/feed'>
        <button onClick={() => navigate(-1)}>Back</button>
      </NavLink>
      <button onClick={removePost}>Delete</button>
    </div>
  );
};
