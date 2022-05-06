//jshint esversion:9

import { useContext, useState, useEffect, useRef } from 'react';
import { getPost, getNotifications, uploadImage, updatePost, deletePost, removeUserNotification, getUsers, deleteNotification } from './../api';
import { AuthContext } from '../context/auth.context';
import { useParams, useNavigate, Link } from 'react-router-dom';

export const EditPostPage = () => {
  const { user } = useContext(AuthContext);
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  let navigate = useNavigate();
  const inputFileUpload = useRef(null);
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

      await deleteNotification(postNotification._id);

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
    <div className='EditPost '>
      <div class='card card-compact w-96 bg-base-100 shadow-xl mx-auto top-10 p-2 space-y-4'>
        <div class='card-body'>
          <div className='flex items-center space-x-3 '>
            <div className='avatar'>
              <Link to={`/profile/${user._id}`} className='mask mask-squircle w-10 h-10'>
                <img src={user.imageUrl} alt={user.username} />
              </Link>
            </div>
            <div>
              <div className='font-bold'>{user.username}</div>
            </div>
          </div>
          {body || imageUrl ? (
            <form onSubmit={handleSubmit} className='space-y-2'>
              <label>
                <textarea name='body' value={body} onChange={(e) => setBody(e.target.value)} placeholder='Share your thoughts' />
              </label>
              <figure>{imageUrl && <img src={imageUrl} alt='Post' />}</figure>
              <div class='card-actions flex justify-between'>
                <button type='button' className='btn btn-error' onClick={removePost}>
                  Delete
                </button>

                <button type='submit' className='btn btn-primary'>
                  Update
                </button>
              </div>
            </form>
          ) : (
            <p>Loading...</p>
          )}
          <div class='card-actions flex justify-between'>
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
    </div>
  );
};
