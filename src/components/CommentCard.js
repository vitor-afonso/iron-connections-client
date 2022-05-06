//jshint esversion:9

import { Link } from 'react-router-dom';
import { deleteComment } from './../api';
import { useContext } from 'react';
import { AuthContext } from '../context/auth.context';

export const CommentCard = ({ postId, comment, refreshAllPosts, refreshProfileUser }) => {
  const { user } = useContext(AuthContext);

  let date = new Date(comment.createdAt);
  let dateYear = date.getFullYear();
  let dateMonth = date.getMonth() + 1;
  let dateDay = date.getDate();
  let commentDate = `${dateDay}-${dateMonth}-${dateYear}`;

  const handleDelete = async () => {
    await deleteComment(postId, comment._id);
    refreshAllPosts();
    refreshProfileUser();
  };

  return (
    <div className='w-full p-2 rounded-md mb-4 shadow-md bg-indigo-50'>
      {/* <!-- Card header --> */}
      <div className='flex justify-start items-center mb-3  '>
        {/* <!-- Icon --> */}

        <div className='avatar mr-3'>
          <div className='mask mask-squircle w-10 h-10 '>
            {comment.userId.imageUrl && (
              <Link to={`/profile/${comment.userId._id}`}>
                <img src={comment.userId.imageUrl} alt={comment.userId.username} />
              </Link>
            )}
          </div>
        </div>
        {/* <!-- Name & Date --> */}
        <div className='flex items-center w-full justify-between font-bold text-xs text-gray-900 truncate mb-1 sm:mb-0'>
          {comment.userId.username.split(' ')[0]} <span className='mr-3 text-gray-400'> {commentDate} </span>
          {user._id === comment.userId._id && (
            <button className='btn btn-active btn-ghost justify-self-end self-end' onClick={handleDelete}>
              x
            </button>
          )}
        </div>
      </div>
      {/* <!-- Card body --> */}
      <div className=''>
        {/* <!-- Paragraph --> */}
        <div className='text-slate-600 mb-4 '>
          <div className='flex justify-around '>
            <p className='mb-2 '>{comment.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
