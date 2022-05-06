//jshint esversion:9
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/auth.context';
import { addFollower, createNotification, getUser, getUsers, removeFollower, updateUserNotification } from './../api';
import { FilterUsers } from '../components/FilterUsers';

export const UsersPage = () => {
  const { user } = useContext(AuthContext);
  const [currentUser, setCurrentUser] = useState({});
  const [allUsers, setAllUsers] = useState([]);
  const [userFollowersId, setUserFollowersId] = useState([]);

  const getAllUsers = async () => {
    try {
      let response = await getUsers();
      setAllUsers(response.data);
    } catch (error) {
      console.log('Something went wrong while trying to get users from DB =>', error);
    }
  };

  const getOneUser = async () => {
    try {
      let response = await getUser(user._id);
      setCurrentUser(response.data);
      setUserFollowersId(response.data.followers.map((user) => user._id));
    } catch (error) {
      console.log('Something went wrong while trying to get user from DB =>', error);
    }
  };

  const updateFollowersNotifications = async (followerId) => {
    const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    let date = new Date();
    let dateYear = date.getFullYear();
    let dateMonth = month[date.getMonth()];
    let dateDay = date.getDate();
    let postDate = `${dateDay}-${dateMonth}-${dateYear}`;

    try {
      let str = `${user.username} started following you. ${postDate}`;

      let response = await createNotification({ content: str, userId: user._id });

      updateUserNotification({ notificationId: response.data._id }, followerId);
    } catch (error) {
      console.log('Something went wrong while trying to update notification =>', error);
    }
  };

  const handleAddFollower = async (followerId) => {
    if (userFollowersId.includes(followerId)) {
      return;
    }

    try {
      await addFollower(user._id, followerId);

      getOneUser();
      getAllUsers();
      updateFollowersNotifications(followerId);
    } catch (error) {
      console.log('Something went wrong while trying add follower =>', error);
    }
  };

  const handleRemoveFollower = async (followerId) => {
    if (!userFollowersId.includes(followerId)) {
      return;
    }

    try {
      await removeFollower(user._id, followerId);

      getOneUser();
      getAllUsers();
    } catch (error) {
      console.log('Something went wrong while trying remove follower =>', error);
    }
  };

  useEffect(() => {
    if (user) {
      getAllUsers();
      getOneUser();
    }
  }, [user]);

  return (
    <div className='max-w-lg mx-auto '>
      <div className='fixed top-12 w-full z-10 h-3 bg-slate-200'></div>
      {<FilterUsers usersList={allUsers} currentUser={currentUser} userFollowersIds={userFollowersId} handleAddFollower={handleAddFollower} handleRemoveFollower={handleRemoveFollower} />}
    </div>
  );
};
