//jshint esversion:9

import { Link } from 'react-router-dom';

export const UserFilterTableData = ({ currentUser, oneUser, userFollowersIds, handleAddFollower, handleRemoveFollower }) => {
  return (
    <td className={`rounded-lg `}>
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
