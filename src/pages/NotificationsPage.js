// jshint esversion:9
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/auth.context';
import { deleteNotification, getUser, getUsers, removeUserNotification } from '../api';
import { Link } from 'react-router-dom';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useContext(AuthContext);

  const removeNotification = async (notificationId) => {
    let allUsers = await getUsers();

    allUsers = allUsers.data.filter((oneUser) => oneUser._id !== user._id);

    if (!allUsers.find((oneUser) => oneUser.notifications.includes(notificationId))) {
      let response = await deleteNotification(notificationId);
      console.log(response);
    }

    updateUserNotifications({ notificationId: notificationId }); //<= updates user notifications array
  };

  const updateUserNotifications = async (requestBody) => {
    // call users and filter the array of notifications
    await removeUserNotification(requestBody, user._id);

    getUpdatedUser();
  };

  const getUpdatedUser = async () => {
    try {
      if (user) {
        let currentUser = await getUser(user._id);

        currentUser = currentUser.data;

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
          console.log('have notifications');
          return (
            <div key={oneNotification._id}>
              <Link to={`/profile/${oneNotification.postId.userId}?postId=${oneNotification.postId._id}`}>
                {oneNotification.commentMessage || oneNotification.content.includes('liked') ? <span>{oneNotification.commentMessage}</span> : <span>{oneNotification.content}</span>}
              </Link>
              <button onClick={() => removeNotification(oneNotification._id)}>x</button>
            </div>
          );
        })}
    </div>
  );
};
