// jshint esversion:9
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/auth.context';
import { getNotifications } from '../api';
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
        let response = await getNotifications();
        console.log('getNotifications data =>', response.data);
        setNotifications(response.data);
      } catch (error) {
        console.log('Something went wrong while trying to get notifications =>', error);
      }
    })();
  }, []);
  return (
    <div>
      <h2>Notifications</h2>
      {notifications.length &&
        notifications.map((oneNotification) => {
          return (
            <div key={oneNotification._id}>
              <span>{oneNotification.content}</span>
              <button onClick={() => removeNotification(oneNotification._id)}>X</button>
            </div>
          );
        })}
    </div>
  );
};
