//jshint esversion:9

import { useContext, useState, useEffect, useRef } from 'react';
import {
  getUser,
  uploadImage,
  updateUser,
  deleteUser,
  getAllPosts,
  updatePost,
  getNotifications,
  getUsers,
  deleteNotification,
  getAllComments,
  deleteComment,
  deletePostComment,
  removeFollower,
  deletePost,
} from './../api';
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
      let allUsers = await getUsers();
      let allNotifications = await getNotifications();
      let allPosts = await getAllPosts();
      let allComments = await getAllComments();

      await removeUserLikeFromPosts(allPosts.data);

      await updateFollowersNotifications(allNotifications.data);

      await deleteAllNotificationsGeneratedByUser(allNotifications.data);

      await getAllUserCommentsAndPosts(allPosts.data, allComments.data);

      await UpdateUsersFollowers(allUsers.data);

      await deleteUserPosts(allPosts.data);

      /* await deleteUser(userId); */
      /* logOutUser(); */
    } catch (error) {
      console.log('Something went wront while deleting user from API', error);
    }
  };

  const deleteUserPosts = async (allPosts) => {
    console.log('allPosts', allPosts);
    allPosts.forEach(async (post) => {
      if (post.userId._id === userId) {
        await deletePost(post._id);
      }
    });
  };

  const UpdateUsersFollowers = async (allUsers) => {
    allUsers.forEach(async (user) => {
      if (user.followers.includes(userId)) {
        await removeFollower(user._id, userId);
      }
    });
  };

  const getAllUserCommentsAndPosts = async (allPosts, allComments) => {
    let filteredCommentsFromUser = allComments.filter((oneComment) => oneComment.userId._id === userId);
    if (filteredCommentsFromUser) {
      filteredCommentsFromUser.forEach((comment) => checkEachPost(allPosts, comment._id));
    }
  };

  const checkEachPost = async (allPosts, commentId) => {
    allPosts.forEach((post) => {
      deleteUserCommentFromPost(post, commentId);
    });
  };

  const deleteUserCommentFromPost = (post, userCommentId) => {
    post.comments.forEach(async (oneComment) => {
      if (oneComment._id === userCommentId) {
        let filteredComments = post.comments.filter((comment) => comment._id !== userCommentId);
        await updatePost({ comments: filteredComments }, post._id);

        await deleteComment(userCommentId);
      }
    });
  };

  const deleteAllNotificationsGeneratedByUser = async (allNotifications) => {
    let filteredNotifications = allNotifications.filter((oneNotification) => oneNotification.userId._id === userId);

    filteredNotifications.forEach(async (notification) => await deleteNotification(notification._id));
  };

  const updateFollowersNotifications = async (allNotifications) => {
    let filteredNotifications = allNotifications.filter((oneNotification) => oneNotification.userId._id === userId);

    if (filteredNotifications) {
      filteredNotifications.forEach((oneNotification) => removeNotificationFromUser(oneNotification._id));
    }
  };

  const removeNotificationFromUser = async (notificationId) => {
    let allUsers = await getUsers();

    allUsers.data.forEach(async (follower) => {
      let filteredNotifications = follower.notifications.filter((oneNotificationId) => oneNotificationId !== notificationId);

      await updateUser({ notifications: filteredNotifications }, follower._id);
    });
  };

  const removeUserLikeFromPosts = async (allPosts) => {
    try {
      let filteredPostsToRemoveLike = allPosts.filter((onePost) => onePost.likes.includes(userId));

      if (filteredPostsToRemoveLike) {
        filteredPostsToRemoveLike.forEach(async (post) => {
          removeUserLike(post);

          let filteredLikes = post.likes.filter((likeID) => likeID !== userId);
          await updatePost({ likes: filteredLikes }, post._id);
        });
      }
    } catch (error) {
      console.log('Something went wrong while trying to remove like from posts =>', error);
    }
  };

  const removeUserLike = async (post) => {
    let currentUser = await getUser(userId);
    let filteredUserLikes = currentUser.data.likes.filter((postId) => postId !== post._id);
    let response = await updateUser({ likes: filteredUserLikes }, userId);
    console.log('postId deleted from user likes =>', response.data);
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
