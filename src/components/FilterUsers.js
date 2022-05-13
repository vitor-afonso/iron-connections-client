//jshint esversion:9

import { useContext, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { SpinnerCircular } from 'spinners-react';
import { AuthContext } from '../context/auth.context';
import { UserFilterTableData } from './UserFilterTableData';

export const FilterUsers = ({ usersList, userFollowersIds, currentUser, handleAddFollower, handleRemoveFollower }) => {
  const [users, setUsers] = useState([]);
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

  return (
    <div className={`space-y-4 flex flex-col items-center max-w-md mx-auto min-h-[calc(100vh_-_48px)] pb-4`}>
      <label className='sticky top-[60px] z-20 w-full px-4 sm:px-0 pb-2'>
        <input type='text' placeholder='Search connects' name='search' value={str} onChange={(e) => setStr(e.target.value)} className={`input input-primary w-full max-w-md focus:outline-none`} />
      </label>

      {usersList.length !== 0 ? (
        <table className='table w-full max-w-md border-separate '>
          <tbody>
            {users.length !== 0 ? (
              users.map((oneUser) => {
                if (oneUser._id !== user._id) {
                  return (
                    <tr key={oneUser._id}>
                      <UserFilterTableData
                        currentUser={currentUser}
                        oneUser={oneUser}
                        userFollowersIds={userFollowersIds}
                        handleAddFollower={handleAddFollower}
                        handleRemoveFollower={handleRemoveFollower}
                      />
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
      ) : (
        <div style={{ marginTop: '60px' }}>
          <SpinnerCircular size={90} thickness={115} speed={100} color='rgb(86,13,248)' secondaryColor='rgba(57, 146, 172, 0.48)' />
        </div>
      )}
    </div>
  );
};
