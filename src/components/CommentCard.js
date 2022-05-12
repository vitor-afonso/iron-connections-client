//jshint esversion:9

import { Link } from 'react-router-dom';
import { deleteComment, deletePostComment, getUsers, removeUserNotification } from './../api';
import { useContext } from 'react';
import { AuthContext } from '../context/auth.context';

export const CommentCard = ({ postId, comment, refreshAllPosts, refreshProfileUser }) => {
  const { user } = useContext(AuthContext);

  let date = new Date(comment.createdAt);
  let dateYear = date.getFullYear();
  let dateMonth = date.getMonth() + 1;
  let dateDay = date.getDate();
  let commentDate = `${dateDay}-${dateMonth}-${dateYear}`;

  const handleDelete = async () => {
    try {
      await deleteComment(comment._id);

      await deletePostComment(postId, comment._id);

      if (refreshAllPosts) {
        refreshAllPosts();
      }

      if (refreshProfileUser) {
        refreshProfileUser();
      }
      removeUsersNotification(comment._id);
    } catch (error) {
      console.log('Something went wrong while trying to delete comment =>', error);
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

  return <div className='w-full p-2 rounded-md mb-4 shadow-md bg-indigo-50'></div>;
};
