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
        setNotifications(currentUser.data.notifications);
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
    <div className='max-w-md mx-auto p-2'>
      {notifications.length !== 0 &&
        notifications.map((oneNotification) => {
          if (oneNotification.postId) {
            return (
              <div class='overflow-x-auto' key={oneNotification._id}>
                <table class='table table-zebra w-full border-separate'>
                  <tbody>
                    <tr>
                      <td className='space-x-3 flex justify-between items-center'>
                        <Link to={`/profile/${oneNotification.postId.userId}?postId=${oneNotification.postId._id}`}>
                          {oneNotification.commentMessage ? (
                            <span className='text-xs sm:text-sm'>{oneNotification.commentMessage}</span>
                          ) : (
                            <span className='text-xs sm:text-sm'>{oneNotification.content}</span>
                          )}
                        </Link>
                        <button onClick={() => removeNotification(oneNotification._id)} className='btn btn-error'>
                          x
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          } else {
            return (
              <div className='overflow-x-auto ' key={oneNotification._id}>
                <table class='table table-zebra w-full'>
                  <tbody>
                    <tr>
                      <td className='space-x-3 flex justify-between items-center'>
                        <Link to={`/profile/${oneNotification.userId}`}>
                          <span className='text-xs sm:text-sm'>{oneNotification.content}</span>
                        </Link>
                        <button onClick={() => removeNotification(oneNotification._id)} className='btn btn-error'>
                          x
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          }
        })}
    </div>
  );
};
