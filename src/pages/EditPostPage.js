//jshint esversion:9

import { useContext, useState, useEffect, useRef } from 'react';
import { getPost, getNotifications, uploadImage, updatePost, deletePost, removeUserNotification, getUsers, deleteNotification, deleteComment } from './../api';
import { AuthContext } from '../context/auth.context';
import { useParams, useNavigate, Link } from 'react-router-dom';

export const EditPostPage = ({ toastDeleted, toastUpdated }) => {
  const { user } = useContext(AuthContext);
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [postComments, setPostComments] = useState([]);
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
      //comment needs to have a post to be deleted
      // that way comments must be removed before post deletion

      if (postComments.length !== 0) {
        postComments.forEach(async (commentId) => await deleteComment(commentId._id));
      }
      await deletePost(postId);

      let response = await getNotifications();

      let postNotifications = response.data.filter((notification) => notification.postId === postId);
      if (postNotifications) {
        postNotifications.forEach(async (onePostNotification) => {
          await deleteNotification(onePostNotification._id);

          await removeUsersNotification(onePostNotification._id);
        });
      }
      toastDeleted();
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
      allUsers.forEach(async (user) => {
        if (user.notifications.includes(notificationId)) {
          try {
            await removeUserNotification({ notificationId: notificationId }, user._id);
          } catch (error) {
            console.log('Unable to remove notification from user notifications array =>', error);
          }
        }
      });
    } catch (error) {
      console.log('Something went wrong while deleting notification from users notifications', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let requestBody = { body, imageUrl };
      await updatePost(requestBody, postId);
      toastUpdated();
      navigate(-1);
    } catch (error) {
      console.log('Something went wront while updating project in API', error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        let postFromDB = await getPost(postId);
        /* console.log('post to edit =>', postFromDB.data); */
        setBody(postFromDB.data.body);
        setImageUrl(postFromDB.data.imageUrl);
        setPostComments(postFromDB.data.comments);
      } catch (error) {
        console.log('error getting post to update from DB', error);
      }
    })();
  }, [postId]);
  return (
    <div className='EditPost min-h-[calc(100vh_-_48px)]'>
      <div className='card card-compact w-96 bg-base-100 shadow-xl mx-auto top-10 p-2 space-y-4'>
        <div className='card-body'>
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
              <div className='card-actions flex justify-between'>
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
    </div>
  );
};
