// jshint esversion:9
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/auth.context';
import { deleteNotification, getNotifications, getUser, removeUserNotification } from '../api';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useContext(AuthContext);

  const removeNotification = async (notificationId) => {
    // delete the notification
    let response = await deleteNotification(notificationId);
    console.log(response.data.message);
    deleteUserNotification(notificationId); //<= updates user notifications array
  };

  const deleteUserNotification = async (notificationId) => {
    // call users and filter the array of notifications
    let response2 = await removeUserNotification(notificationId, user._id);
    console.log(response2.data.message);
    getUpdatedUser();
  };

  const getUpdatedUser = async () => {
    try {
      if (user) {
        let currentUser = await getUser(user._id);
        currentUser = currentUser.data;
        let response = await getNotifications();
        let userNotifications = response.data.filter((oneNotification) => currentUser.notifications.includes(oneNotification._id));
        setNotifications(userNotifications);
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
              {oneNotification.commentMessage ? <span>{oneNotification.commentMessage}</span> : <span>{oneNotification.content}</span>}
              <button onClick={() => removeNotification(oneNotification._id)}>x</button>
            </div>
          );
        })}
    </div>
  );
};
