//jshint esversion:9

import { useContext, useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import { addFollower, createNotification, getUser, removeFollower, updateUserNotification } from './../api';

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
    if (str) {
      handleFilter();
      return;
    }

    (async () => {
      if (user && followers.length === 0) {
        refreshFollowers();
      }
    })();
  }, [profileOwnerId, user, str, followers]);

  return (
    <div>
      <label>
        <input type='text' name='search' value={str} onChange={(e) => setStr(e.target.value)} placeholder='Search user by name' />
      </label>
      {filteredFollowers.length &&
        filteredFollowers.map((oneUser) => {
          return (
            <div key={oneUser._id}>
              {oneUser._id !== user._id && (
                <>
                  <NavLink to={`/profile/${oneUser._id}`}>
                    <img src={oneUser.imageUrl} alt={oneUser.username} style={{ width: '50px' }} />
                  </NavLink>

                  <span>{oneUser.username}</span>

                  {user._id !== oneUser._id && !currentUserFollowersIds.includes(oneUser._id) ? (
                    <button onClick={() => handleAddFollower(oneUser._id)}>Follow</button>
                  ) : (
                    <button onClick={() => handleRemoveFollower(oneUser._id)}>Unfollow</button>
                  )}
                </>
              )}
            </div>
          );
        })}
    </div>
  );
};
