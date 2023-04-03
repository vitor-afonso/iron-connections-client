//jshint esversion:9
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/auth.context';
import { deleteNotification, getUser, getUsers, removeUserNotification } from '../api';
import { Link } from 'react-router-dom';
import { SpinnerCircular } from 'spinners-react';

export const Notifications = ({ toggleNotifications, setHaveNotification }) => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      getUserSetNotifications();
    }
  }, [user]);

  const removeNotification = async (notificationId) => {
    try {
      let allUsers = await getUsers();

      allUsers = allUsers.data.filter((oneUser) => oneUser._id !== user._id);

      // delete notification only if it does not existe anymore in any user
      if (!allUsers.find((oneUser) => oneUser.notifications.includes(notificationId))) {
        await deleteNotification(notificationId);
      }

      updateUserNotifications({ notificationId: notificationId });
    } catch (error) {
      console.error('Something went wrong while trying to delete notification.', error);
    }
  };

  const updateUserNotifications = async (requestBody) => {
    // call users and filter the array of notifications
    try {
      setIsLoading(true);
      const { data } = await removeUserNotification(requestBody, user._id);

      setNotifications(data.response.notifications);

      if (data.response.notifications.length === 0) {
        setHaveNotification('');
      }
    } catch (error) {
      console.error('Something went wrong while trying to update user notifications.', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserSetNotifications = async () => {
    try {
      if (user) {
        setIsLoading(true);
        let currentUser = await getUser(user._id);

        setNotifications(currentUser.data.notifications);

        if (currentUser.data.notifications.length === 0) {
          setHaveNotification('');
        }
      }
    } catch (error) {
      console.log('Something went wrong while trying to get user and set notifications =>', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleNotifications = (notificationId) => {
    toggleNotifications();
    removeNotification(notificationId);
    if (notifications.length === 1) {
      setHaveNotification('');
    }
  };

  const getNotificationMessage = (notification) => {
    return notification.commentMessage ? notification.commentMessage : notification.content;
  };

  return (
    <div className='sm:max-w-md mx-auto max-w-[300px] '>
      <div className=' overflow-auto'>
        <table className='table  w-full border-separate overflow-x-scroll '>
          <tbody>
            {notifications.length > 0 ? (
              notifications.map((oneNotification) => {
                if (oneNotification.postId) {
                  return (
                    <tr key={oneNotification._id}>
                      <td className='flex justify-between items-center pr-0 bg-indigo-100 '>
                        <Link to={`/profile/${oneNotification.postId.userId}?postId=${oneNotification.postId._id}`} onClick={() => handleToggleNotifications(oneNotification._id)}>
                          <span className='text-xs sm:text-sm  '>{getNotificationMessage(oneNotification)}</span>
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
                        <Link to={`/profile/${oneNotification.userId}`} onClick={handleToggleNotifications(oneNotification._id)}>
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
                <td className='space-x-3 flex justify-between items-center pr-0  min-w-[250px]'>
                  {isLoading ? (
                    <SpinnerCircular size={50} thickness={70} speed={100} color='rgb(86,13,248)' secondaryColor='rgba(57, 146, 172, 0.48)' className='mx-auto mt-10' />
                  ) : (
                    'No new notifications'
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
