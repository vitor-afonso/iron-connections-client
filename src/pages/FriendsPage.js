//jshint esversion:9

import { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import { addFollower, createNotification, getUser, removeFollower, updateUserNotification } from './../api';
import { FilterUsers } from '../components/FilterUsers';

export const FriendsPage = () => {
  const { user } = useContext(AuthContext);
  const [followers, setFollowers] = useState([]);
  const [filteredFollowers, setFilteredFollowers] = useState([]);
  const [currentUserFollowersIds, setCurrentUserFollowersIds] = useState([]); //<= used to decide which button(follow/unfollow) to show
  const [str, setStr] = useState('');
  const { profileOwnerId } = useParams();

  const handleFilter = () => {
    if (str === '') {
      setFilteredFollowers(followers);
    } else {
      let filteredUsers = followers.filter((user) => user.username.toLowerCase().includes(str.toLowerCase()));
      setFilteredFollowers(filteredUsers);
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
    if (currentUserFollowersIds.includes(followerId)) {
      return;
    }

    try {
      await addFollower(user._id, followerId);
      refreshFollowers();
      updateFollowersNotifications(followerId);
    } catch (error) {
      console.log('Something went wrong while trying add follower =>', error);
    }
  };

  const handleRemoveFollower = async (followerId) => {
    if (!currentUserFollowersIds.includes(followerId)) {
      return;
    }

    try {
      await removeFollower(user._id, followerId);
      refreshFollowers();
    } catch (error) {
      console.log('Something went wrong while trying remove follower =>', error);
    }
  };

  const refreshFollowers = async () => {
    let response = await getUser(user._id);
    let userInSession = response.data;
    let response2 = await getUser(profileOwnerId);
    let profileOwner = response2.data;

    setCurrentUserFollowersIds(userInSession.followers.map((follower) => follower._id));
    if (followers.length === 0) {
      let sortedFollowers = profileOwner.followers.sort((a, b) => (a.username.toLowerCase() > b.username.toLowerCase() ? 1 : -1));

      setFollowers(sortedFollowers);
      setFilteredFollowers(sortedFollowers);
    }
  };

  useEffect(() => {
    (async () => {
      if (user && followers.length === 0) {
        refreshFollowers();
      }
    })();
  }, [profileOwnerId, user]);

  useEffect(() => {
    handleFilter();
  }, [str]);

  return (
    <div className='max-w-lg mx-auto'>
      <div className='fixed top-12 w-full z-10 h-3 bg-slate-200 '></div>
      {<FilterUsers usersList={filteredFollowers} currentUser={user} userFollowersIds={currentUserFollowersIds} handleAddFollower={handleAddFollower} handleRemoveFollower={handleRemoveFollower} />}
    </div>
  );
};
