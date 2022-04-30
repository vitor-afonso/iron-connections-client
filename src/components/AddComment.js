//jshint esversion:9

import { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import { addNewComment, createNotification, getUser, updateUserNotification } from './../api';

export const AddComment = ({ post, refreshAllPosts, refreshProfileUser }) => {
  const { user } = useContext(AuthContext);
  const [content, setContent] = useState('');
  const [userImageUrl, setUserImageUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let requestBody = { content, userId: user._id };
      await addNewComment(post._id, requestBody);
      refreshAllPosts();
      setContent('');
      if (refreshProfileUser) {
        refreshProfileUser();
      }
      updateFollowersNotifications();
    } catch (error) {
      console.log('Error while adding comment to post =>', error);
    }
  };

  const handleContent = (e) => {
    setContent(e.target.value);
  };

  const updateFollowersNotifications = async () => {
    const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let date = new Date();
    let dateYear = date.getFullYear();
    let dateMonth = month[date.getMonth()];
    let dateDay = date.getDate();
    let postDate = `${dateDay}-${dateMonth}-${dateYear}`;

    try {
      let str = `${user.username} commented your post. ${postDate}`;
      let str2 = `${user.username} commented a post that you also commented. ${postDate}`;
      let newlyCreatedNotificationId;

      if (post.comments.length !== 0) {
        if (post.userId._id !== user._id) {
          let response = await createNotification({ commentMessage: str2, userId: user._id, postId: post._id });
          newlyCreatedNotificationId = response.data._id;
        }

        post.comments.forEach((oneComment) => {
          if (post.userId._id !== oneComment.userId._id) {
            updateUserNotification({ notificationId: newlyCreatedNotificationId }, oneComment.userId._id);
          }
        });

        let response = await createNotification({ content: str, userId: user._id, postId: post._id });
        await updateUserNotification({ notificationId: response.data._id }, post.userId._id);
      } else {
        if (post.userId._id !== user._id) {
          let response = await createNotification({ content: str, userId: user._id, postId: post._id });
          newlyCreatedNotificationId = response.data._id;
          updateUserNotification({ notificationId: newlyCreatedNotificationId }, post.userId._id);
        }
      }
    } catch (error) {
      console.log('Something went wrong while trying to update notification =>', error);
    }
  };

  useEffect(() => {
    (async () => {
      if (user) {
        let response = await getUser(user._id);
        setUserImageUrl(response.data.imageUrl);
      }
    })();
  }, [user, post]);

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {userImageUrl && (
          <Link to={`/profile/${post.userId._id}`} style={{ display: 'inline-block' }}>
            <img src={userImageUrl} alt='Author' style={{ width: '30px' }} />
          </Link>
        )}

        <label>
          <input type='text' name='content' value={content} onChange={handleContent} placeholder='Write comment' style={{ width: '250px' }} />
        </label>

        <button type='submit'>Comment</button>
      </form>
    </div>
  );
};
