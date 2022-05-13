//jshint esversion:9

import { useRef } from 'react';
import { Link } from 'react-router-dom';
import useOnScreen from '../hooks/useOnScreen';

export const UserFilterTableData = ({ currentUser, oneUser, userFollowersIds, handleAddFollower, handleRemoveFollower }) => {
  const ref = useRef();
  const isVisible = useOnScreen(ref);

  return (
    <td className={`rounded-lg slideIn ${isVisible && 'open'}`} ref={ref}>
      <div className='flex items-center space-x-3 justify-between'>
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
  );
};
