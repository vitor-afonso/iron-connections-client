// jshint esversion:9
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/auth.context';
import { getNotifications, getUser } from '../api';
import { Container } from 'react-bootstrap';

export const NotificationsPage = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useContext(AuthContext);

  const removeNotification = (notificationId) => {
    // delete the notification
    // call removeUserNotification
  };

  const removeUserNotification = (notificationId) => {
    // call users and filter the array of notifications
  };

  useEffect(() => {
    (async () => {
      try {
        if (user) {
          let currentUser = await getUser(user._id);
          currentUser = currentUser.data;
          let response = await getNotifications();
          let userNotifications = response.data.filter((oneNotification) => currentUser.notifications.includes(oneNotification._id));
          setNotifications(userNotifications);
        }
      } catch (error) {
        console.log('Something went wrong while trying to get notifications =>', error);
      }
    })();
  }, [user]);
  return (
    <div>
      <h2>Notifications</h2>
      {notifications.length &&
        notifications.map((oneNotification) => {
          return (
            <div key={oneNotification._id}>
              {oneNotification.commentMessage ? <span>{oneNotification.commentMessage}</span> : <span>{oneNotification.content}</span>}
              <button onClick={() => removeNotification(oneNotification._id)}>X</button>
            </div>
          );
        })}
    </div>
  );
};
