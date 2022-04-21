//jshint esversion:9

import { useContext, useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import { addFollower, getUser, removeFollower } from './../api';

export const FriendsPage = () => {
  const [followers, setFollowers] = useState([]);
  const [str, setStr] = useState('');
  const [currentUserFollowersIds, setCurrentUserFollowersIds] = useState('');
  const { user } = useContext(AuthContext);
  const { profileOwnerId } = useParams();
  const [flag, setFlag] = useState(true); //to force it to refresh the user followers after pressing button

  const getOneUser = async () => {
    try {
      if (user) {
        let response = await getUser(profileOwnerId);

        let followers = response.data.followers.filter((oneUser) => oneUser._id !== user._id);

        setFollowers(followers.sort((a, b) => (a.username.toLowerCase() > b.username.toLowerCase() ? 1 : -1)));
      }
    } catch (error) {
      console.log('Something went wrong while trying to get user from DB =>', error);
    }
  };

  const handleFilter = (e) => {
    setStr(e.target.value);

    (async () => {
      let response = await getUser(profileOwnerId);

      if (str === '') {
        setFollowers(response.data);
      } else {
        let filteredUsers = response.data.followers.filter((user) => user.username.toLowerCase().includes(str.toLowerCase()));
        setFollowers(filteredUsers);
      }
    })();
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
    //Call to get profile owner and display its friends
    getOneUser();

    //Call to get the user in session and make a list of followers id's
    //to decide on which user to show the follow/unfollow button
    (async () => {
      if (user) {
        let response = await getUser(user._id);

        setCurrentUserFollowersIds(response.data.followers.map((follower) => follower._id));
      }
    })();
  }, [str, profileOwnerId, user, flag]);

  return (
    <div>
      FriendsPage
      <label>
        <input type='text' name='search' value={str} onChange={handleFilter} />
      </label>
      {followers.length &&
        followers.map((oneUser) => {
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
