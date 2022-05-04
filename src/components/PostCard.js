//jshint esversion:9

import { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/auth.context';
import { NavLink, Link } from 'react-router-dom';

import { AddComment } from './AddComment';
import { CommentCard } from './CommentCard';
import { createNotification, updatePostLikesAdd, updatePostLikesRemove, updateUserLikesAdd, updateUserLikesRemove, updateUserNotification } from '../api';

export const PostCard = ({ post, refreshPosts, refreshUser }) => {
  const { user } = useContext(AuthContext);
  const toggleComments = useRef(null);

  let date = new Date(post.createdAt);
  let dateYear = date.getFullYear();
  let dateMonth = date.getMonth() + 1;
  let dateDay = date.getDate();
  let postDate = `${dateDay}-${dateMonth}-${dateYear}`;

  let likesNum = post.likes.length;

  const handleLike = async () => {
    try {
      if (!post.likes.includes(user._id)) {
        await updateUserLikesAdd({ postId: post._id }, user._id);
        await updatePostLikesAdd({ userId: user._id }, post._id);

        if (post.userId._id !== user._id) {
          const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
          let date = new Date();
          let dateYear = date.getFullYear();
          let dateMonth = month[date.getMonth()];
          let dateDay = date.getDate();
          let postDate = `${dateDay}-${dateMonth}-${dateYear}`;
          let str = `${user.username} liked your post. ${postDate}`;

          let notification = await createNotification({ content: str, userId: user._id, postId: post._id });
          updateUserNotification({ notificationId: notification.data._id }, post.userId._id);
        }
        if (refreshPosts) {
          refreshPosts();
        }
        if (refreshUser) {
          refreshUser();
        }
      } else {
        await updateUserLikesRemove({ postId: post._id }, user._id);
        await updatePostLikesRemove({ userId: user._id }, post._id);
        refreshPosts();
        if (refreshUser) {
          refreshUser();
        }
      }
    } catch (error) {
      console.log('Something went wrong while trying to update likes =>', error);
    }
  };

  useEffect(() => {
    toggleComments.current.style.display = 'none';
  }, []);

  const showComments = () => {
    if (toggleComments.current.style.display === 'none') {
      toggleComments.current.style.display = 'block';
    } else {
      toggleComments.current.style.display = 'none';
    }
  };
  return (
    <div className='PostCard  sm:max-w-2xl px-4' data-aos='fade-up'>
      <section className='flex flex-col justify-center antialiased text-gray-600  '>
        {/* <!-- Card --> */}
        <div className=' mx-auto bg-slate-800 shadow-lg rounded-lg min-w-full'>
          <div className='px-4 py-5'>
            <div className='flex '>
              {/* <!-- Card content --> */}
              <div className='flex-grow '>
                {/* <!-- Card header --> */}
                <div className='flex justify-start items-center mb-3'>
                  {/* <!-- Icon --> */}

                  <div className='avatar mr-3'>
                    <div className='mask mask-squircle w-10 h-10'>
                      {post.userId.imageUrl && (
                        <Link to={`/profile/${post.userId._id}`}>
                          <img src={post.userId.imageUrl} alt={post.userId.username} />
                        </Link>
                      )}
                    </div>
                  </div>
                  {/* <!-- Name & Date --> */}
                  <div className='flex items-center w-full justify-between font-bold text-xs text-gray-50 truncate mb-1 sm:mb-0'>
                    {post.userId.username.split(' ')[0]} <span className='mr-3'> {postDate} </span>
                    {post.userId._id === user._id && (
                      <Link to={`/post/${post._id}/edit`}>
                        <button className='btn btn-active btn-ghost'>Edit</button>
                      </Link>
                    )}
                  </div>
                </div>
                {/* <!-- Card body --> */}
                <div className='flex flex-col justify-between whitespace-normal'>
                  {/* <!-- Paragraph --> */}
                  <div className='max-w-md text-indigo-100 flex flex-col items-center mb-4'>
                    <p className='mb-2'>{post.body}</p>

                    {post.imageUrl && <img src={post.imageUrl} alt='Post' style={{ width: '300px' }} />}
                  </div>
                  {/* <!-- Like and comment buttons --> */}
                  <div className='flex-shrink-0 flex items-center space-x-3 sm:ml-2'>
                    <button className='flex items-center text-left text-sm font-medium text-indigo-100 hover:text-white group focus:outline-none focus-visible:border-b focus-visible:border-indigo-100'>
                      <svg onClick={() => handleLike(post._id)} className='w-4 h-4 flex-shrink-0 mr-2 fill-current text-gray-300 group-hover:text-gray-200' viewBox='0 0 16 16'>
                        <path d='M14.682 2.318A4.485 4.485 0 0 0 11.5 1 4.377 4.377 0 0 0 8 2.707 4.383 4.383 0 0 0 4.5 1a4.5 4.5 0 0 0-3.182 7.682L8 15l6.682-6.318a4.5 4.5 0 0 0 0-6.364Zm-1.4 4.933L8 12.247l-5.285-5A2.5 2.5 0 0 1 4.5 3c1.437 0 2.312.681 3.5 2.625C9.187 3.681 10.062 3 11.5 3a2.5 2.5 0 0 1 1.785 4.251h-.003Z' />
                      </svg>
                      <span>
                        {likesNum} <span className='sr-only'>likes</span>
                      </span>
                    </button>
                    <button className='flex items-center text-left text-sm font-medium text-indigo-100 hover:text-white group focus:outline-none focus-visible:border-b focus-visible:border-indigo-100'>
                      <svg onClick={showComments} className='w-4 h-4 flex-shrink-0 mr-2 fill-current text-gray-300 group-hover:text-gray-200' viewBox='0 0 16 16'>
                        <path d='M8 0C3.6 0 0 3.1 0 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7Zm4 10.8v2.3L8.9 12H8c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8Z' />
                      </svg>
                      <span>
                        {post.comments.length} <span className='sr-only'>comments</span>
                      </span>
                    </button>
                  </div>
                  <div className='comment-area' ref={toggleComments}>
                    <AddComment post={post} refreshAllPosts={refreshPosts} refreshProfileUser={refreshUser} />

                    {post.comments.map((oneComment) => {
                      return <CommentCard postId={post._id} comment={oneComment} key={oneComment._id} refreshAllPosts={refreshPosts} refreshProfileUser={refreshUser} />;
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
