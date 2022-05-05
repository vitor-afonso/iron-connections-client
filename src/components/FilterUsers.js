//jshint esversion:9

import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import Aos from 'aos';
import 'aos/dist/aos.css';
import { AuthContext } from '../context/auth.context';

export const FilterUsers = ({ usersList, userFollowersIds, currentUser, handleAddFollower, handleRemoveFollower }) => {
  const [users, setUsers] = useState('');
  const [str, setStr] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    let sortedUsersList = usersList.sort((a, b) => (a.username.toLowerCase() > b.username.toLowerCase() ? 1 : -1));

    if (str === '') {
      setUsers(sortedUsersList);
    } else {
      let filteredUsers = sortedUsersList.filter((user) => user.username.toLowerCase().includes(str.toLowerCase()));
      setUsers(filteredUsers);
    }
  }, [str, usersList, currentUser]);

  useEffect(() => {
    Aos.init({ duration: 1000 });
  }, []);

  return (
    <div className='mt-16 space-y-4 flex flex-col items-center max-w-md mx-auto '>
      <label className='w-full'>
        <input type='text' placeholder='Search people' name='search' value={str} onChange={(e) => setStr(e.target.value)} className={`input input-bordered input-primary w-full max-w-md`} />
      </label>
      <table className='table w-full max-w-md'>
        <tbody>
          {users.length &&
            users.map((oneUser) => {
              if (oneUser._id !== user._id) {
                return (
                  <tr>
                    <td className='border-b-2 border-indigo-600 '>
                      <div class='flex items-center space-x-3 justify-between '>
                        <div className='flex items-center space-x-3'>
                          <div class='avatar'>
                            <Link to={`/profile/${oneUser._id}`} className='mask mask-squircle w-12 h-12'>
                              <img src={oneUser.imageUrl} alt={oneUser.username} />
                            </Link>
                          </div>
                          <div>
                            <div class='font-bold'>{oneUser.username}</div>
                          </div>
                        </div>

                        {currentUser._id !== oneUser._id && !userFollowersIds.includes(oneUser._id) ? (
                          <button className='btn justify-self-end' onClick={() => handleAddFollower(oneUser._id)}>
                            Follow
                          </button>
                        ) : (
                          <button className='btn' onClick={() => handleRemoveFollower(oneUser._id)}>
                            Unfollow
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              }
            })}
        </tbody>
      </table>
    </div>
  );
};
