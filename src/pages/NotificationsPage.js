// jshint esversion:9
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/auth.context';
import { deleteNotification, getNotifications, getUser, removeUserNotification } from '../api';
import { Link } from 'react-router-dom';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useContext(AuthContext);

  const removeNotification = async (notificationId) => {
    await deleteNotification(notificationId);
    updateUserNotifications({ notificationId: notificationId }, user._id); //<= updates user notifications array
  };

  const updateUserNotifications = async (notificationId) => {
    // call users and filter the array of notifications
    await removeUserNotification(notificationId, user._id);

    getUpdatedUser();
  };

  const getUpdatedUser = async () => {
    try {
      if (user) {
        let currentUser = await getUser(user._id);
        console.log('currentUser', currentUser.data);

        currentUser = currentUser.data;
        /* let response = await getNotifications();
        let userNotifications = response.data.filter((oneNotification) => currentUser.notifications.includes(oneNotification._id)); */

        setNotifications(currentUser.notifications);
      }
    } catch (error) {
      console.log('Something went wrong while trying to get user and set notifications =>', error);
    }
  };

  useEffect(() => {
    if (user) {
      getUpdatedUser();
    }
  }, [user]);

  return (
    <div>
      <h2>Notifications</h2>
      {notifications.length !== 0 &&
        notifications.map((oneNotification) => {
          return (
            <div key={oneNotification._id}>
              {oneNotification.commentMessage || oneNotification.content.includes('liked') ? (
                <Link to={`/profile/${oneNotification.postId.userId}`}>
                  <span>{oneNotification.commentMessage}</span>
                </Link>
              ) : (
                <Link to={`/profile/${oneNotification.userId}`}>
                  <span>{oneNotification.content}</span>
                </Link>
              )}
              <button onClick={() => removeNotification(oneNotification._id)}>x</button>
            </div>
          );
        })}
    </div>
  );
};
