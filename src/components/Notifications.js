//jshint esversion:9
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/auth.context';
import { deleteNotification, getUser, getUsers, removeUserNotification } from '../api';
import { Link } from 'react-router-dom';
import { SocketIoContext } from '../context/socket.context';

export const Notifications = ({ rightPosition, toggleNotifications, setHaveNotification }) => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketIoContext);

  const removeNotification = async (notificationId) => {
    let allUsers = await getUsers();

    allUsers = allUsers.data.filter((oneUser) => oneUser._id !== user._id);

    if (!allUsers.find((oneUser) => oneUser.notifications.includes(notificationId))) {
      let response = await deleteNotification(notificationId);
      console.log(response.data.message);
    }

    updateUserNotifications({ notificationId: notificationId }); //<= updates user notifications array
  };

  const updateUserNotifications = async (requestBody) => {
    // call users and filter the array of notifications
    await removeUserNotification(requestBody, user._id);

    getUserSetNotifications();
  };

  const getUserSetNotifications = async () => {
    try {
      if (user) {
        let currentUser = await getUser(user._id);

        setNotifications(currentUser.data.notifications);

        if (currentUser.data.notifications.length === 0) {
          if (rightPosition === 'right-0') {
            toggleNotifications();
          }
          setHaveNotification('');
        }
      }
    } catch (error) {
      console.log('Something went wrong while trying to get user and set notifications =>', error);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on('newNotification', (newNotification) => {
        getUserSetNotifications();
      });
    }
  }, [socket]);

  useEffect(() => {
    if (user) {
      getUserSetNotifications();
    }
  }, [user]);

  return (
    <div className='sm:max-w-md mx-auto max-w-[300px] '>
      <div className=' overflow-auto'>
        <table className='table  w-full border-separate overflow-x-scroll '>
          <tbody>
            {notifications.length !== 0 ? (
              notifications.map((oneNotification) => {
                if (oneNotification.postId) {
                  return (
                    <tr className='' key={oneNotification._id}>
                      <td className='flex justify-between items-center pr-0 bg-indigo-100 '>
                        <Link to={`/profile/${oneNotification.postId.userId}?postId=${oneNotification.postId._id}`} onClick={() => toggleNotifications()}>
                          {oneNotification.commentMessage ? (
                            <span className='text-xs sm:text-sm  '>{oneNotification.commentMessage}</span>
                          ) : (
                            <span className='text-xs sm:text-sm '>{oneNotification.content}</span>
                          )}
                        </Link>
                        <button onClick={() => removeNotification(oneNotification._id)} className='h-full text-red-600 w-10'>
                          x
                        </button>
                      </td>
                    </tr>
                  );
                } else {
                  return (
                    <tr key={oneNotification._id}>
                      <td className='space-x-3 flex justify-between items-center pr-0 bg-indigo-100 '>
                        <Link to={`/profile/${oneNotification.userId}`} onClick={() => toggleNotifications()}>
                          <span className='text-xs sm:text-sm'>{oneNotification.content}</span>
                        </Link>
                        <button onClick={() => removeNotification(oneNotification._id)} className='h-full text-red-600 w-10'>
                          x
                        </button>
                      </td>
                    </tr>
                  );
                }
              })
            ) : (
              <tr>
                <td className='space-x-3 flex justify-between items-center pr-0  min-w-[250px]'></td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
