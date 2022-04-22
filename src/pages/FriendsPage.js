//jshint esversion:9

import { useContext, useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import { addFollower, getUser, removeFollower } from './../api';

export const FriendsPage = () => {
  const { user } = useContext(AuthContext);
  const [followers, setFollowers] = useState([]);
  const [filteredFollowers, setFilteredFollowers] = useState([]);
  const [currentUserFollowersIds, setCurrentUserFollowersIds] = useState([]); //<= used to decide which button(follow/unfollow) to show
  const [str, setStr] = useState('');
  const { profileOwnerId } = useParams();
  const [flag, setFlag] = useState(false); //<= used to force refresh of currentUser list of followers

  const handleFilter = () => {
    if (str === '') {
      setFilteredFollowers(followers);
    } else {
      let filteredUsers = followers.filter((user) => user.username.toLowerCase().includes(str.toLowerCase()));
      setFilteredFollowers(filteredUsers);
    }
  };

  const handleAddFollower = async (followerId) => {
    if (currentUserFollowersIds.includes(followerId)) {
      return;
    }

    try {
      await addFollower(user._id, followerId);
      setFlag(!flag);
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
      setFlag(!flag);
    } catch (error) {
      console.log('Something went wrong while trying remove follower =>', error);
    }
  };

  useEffect(() => {
    if (str) {
      handleFilter();
      return;
    }

    (async () => {
      if (user) {
        let response = await getUser(user._id);
        let userInSession = response.data;
        let response2 = await getUser(profileOwnerId);
        let profileOwner = response2.data;

        setCurrentUserFollowersIds(userInSession.followers.map((follower) => follower._id));

        let sortedFollowers = profileOwner.followers.sort((a, b) => (a.username.toLowerCase() > b.username.toLowerCase() ? 1 : -1));

        setFollowers(sortedFollowers);
        setFilteredFollowers(sortedFollowers);
      }
    })();
  }, [profileOwnerId, user, str, flag]);

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
