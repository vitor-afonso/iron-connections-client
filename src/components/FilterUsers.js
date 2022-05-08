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
    setTimeout(() => Aos.init({ duration: 1000 }), 500);
  }, []);

  return (
    <div className='space-y-4 flex flex-col items-center  max-w-md mx-auto '>
      <label className='fixed top-[56px] z-20 w-full px-4 '>
        <input type='text' placeholder='Search connects' name='search' value={str} onChange={(e) => setStr(e.target.value)} className={`input  input-primary w-full max-w-md focus:outline-none `} />
      </label>

      <table className='table w-full max-w-md top-[46px] border-separate'>
        <tbody>
          {users.length !== 0 ? (
            users.map((oneUser) => {
              if (oneUser._id !== user._id) {
                return (
                  <tr data-aos='fade-up' key={oneUser._id}>
                    <td className='rounded-lg'>
                      <div className='flex items-center space-x-3 justify-between '>
                        <Link to={`/profile/${oneUser._id}`}>
                          <div className='flex items-center space-x-3'>
                            <div className='avatar'>
                              <div className='mask mask-squircle w-12 h-12'>
                                <img src={oneUser.imageUrl} alt={oneUser.username} />
                              </div>
                            </div>
                            <div>
                              <div className='font-bold'>{oneUser.username}</div>
                            </div>
                          </div>
                        </Link>

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
            })
          ) : (
            <tr>
              <td>
                <p>No users found.</p>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
