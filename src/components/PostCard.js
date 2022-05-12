//jshint esversion:9

import { useContext, useEffect, useRef, useState } from 'react';
import { AuthContext } from '../context/auth.context';
import { Link, useLocation } from 'react-router-dom';

import { AddComment } from './AddComment';
import { CommentCard } from './CommentCard';
import {
  createNotification,
  deleteNotification,
  getNotifications,
  getUsers,
  removeUserNotification,
  updatePostLikesAdd,
  updatePostLikesRemove,
  updateUserLikesAdd,
  updateUserLikesRemove,
  updateUserNotification,
} from '../api';
import useOnScreen from '../hooks/useOnScreen';

export const PostCard = ({ post, refreshPosts, refreshUser, deletedCommentToast }) => {
  const ref = useRef();
  const isVisible = useOnScreen(ref);

  const { user } = useContext(AuthContext);
  const toggleComments = useRef(null);
  const location = useLocation();
  const [disableLike, setDisableLike] = useState(false);

  let date = new Date(post.createdAt);
  let dateYear = date.getFullYear();
  let dateMonth = date.getMonth() + 1;
  let dateDay = date.getDate();
  let postDate = `${dateDay}-${dateMonth}-${dateYear}`;

  let likesNum = post.likes.length;

  let postCardMarginX = ''; // <= Needed on feedPage only

  if (location.pathname.includes('feed')) {
    postCardMarginX = 'mx-4';
  }

  const handleLike = async (e) => {
    try {
      setDisableLike(true);
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
          let str = `${user.username.split(' ')[0]} liked your post. ${postDate}`;

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

        let response = await getNotifications();

        if (response.data.find((notification) => notification.postId === post._id)) {
          let postNotification = response.data.find((notification) => notification.postId === post._id);

          await deleteNotification(postNotification._id);

          await removeUsersNotification(postNotification._id);
        }

        if (refreshPosts) {
          refreshPosts();
        }
        if (refreshUser) {
          refreshUser();
        }
      }

      setDisableLike(false);
    } catch (error) {
      console.log('Something went wrong while trying to update likes =>', error);
    }
  };

  const removeUsersNotification = async (notificationId) => {
    // call users and update the array of notifications
    try {
      let response = await getUsers();
      let allUsers = response.data;
      allUsers.forEach((user) => {
        if (user.notifications.includes(notificationId)) {
          removeUserNotification({ notificationId: notificationId }, user._id);
        }
      });
    } catch (error) {
      console.log('Something went wront while deleting notification from users notifications', error);
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

  const LikeComentBtns = () => {
    return (
      <div className='flex-shrink-0 flex items-center space-x-3 '>
        <button
          onClick={() => handleLike(post._id)}
          disabled={disableLike}
          className='likeBtn flex items-center text-left text-sm font-medium text-indigo-500 hover:text-indigo-400 group focus:outline-none focus-visible:border-b focus-visible:border-indigo-600'
        >
          {post.likes.includes(user._id) ? (
            <svg xmlns='http://www.w3.org/2000/svg' className='h-4 w-4' viewBox='0 0 20 20' fill='currentColor'>
              <path fillRule='evenodd' d='M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z' clipRule='evenodd' />
            </svg>
          ) : (
            <svg className='w-4 h-4 flex-shrink-0 mr-2 fill-current text-indigo-600 group-hover:text-indigo-400' viewBox='0 0 16 16'>
              <path d='M14.682 2.318A4.485 4.485 0 0 0 11.5 1 4.377 4.377 0 0 0 8 2.707 4.383 4.383 0 0 0 4.5 1a4.5 4.5 0 0 0-3.182 7.682L8 15l6.682-6.318a4.5 4.5 0 0 0 0-6.364Zm-1.4 4.933L8 12.247l-5.285-5A2.5 2.5 0 0 1 4.5 3c1.437 0 2.312.681 3.5 2.625C9.187 3.681 10.062 3 11.5 3a2.5 2.5 0 0 1 1.785 4.251h-.003Z' />
            </svg>
          )}
          <span>
            {likesNum} <span className='sr-only'>likes</span>
          </span>
        </button>
        <button className='flex items-center text-left text-sm font-medium text-indigo-500 hover:text-indigo-400 group focus:outline-none focus-visible:border-b focus-visible:border-indigo-600'>
          <svg onClick={showComments} className='w-4 h-4 flex-shrink-0 mr-2 fill-current text-indigo-600 group-hover:text-indigo-400' viewBox='0 0 16 16'>
            <path d='M8 0C3.6 0 0 3.1 0 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7Zm4 10.8v2.3L8.9 12H8c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8Z' />
          </svg>
          <span>
            {post.comments.length} <span className='sr-only'>comments</span>
          </span>
        </button>
      </div>
    );
  };
  return (
    <div className={`PostCard  ${postCardMarginX} slideIn ${isVisible && 'open'}`} ref={ref}>
      <section className='flex flex-col justify-center antialiased '>
        {/* <!-- Card --> */}
        <div className=' mx-auto shadow-md bg-white rounded-lg min-w-full max-w-lg'>
          <div className='px-4 py-5 '>
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
                  <div className='flex items-center w-full justify-between font-bold text-xs sm:text-sm text-gray-800 truncate mb-1 sm:mb-0'>
                    {post.userId.username.split(' ')[0]} <span className='mr-3 text-gray-400'> {postDate} </span>
                    {post.userId._id === user._id && (
                      <Link to={`/post/${post._id}/edit`}>
                        <button className='btn border-2 btn-primary border-indigo-600 shadow-sm bg-white text-indigo-600 hover:text-gray-100 '>Edit</button>
                      </Link>
                    )}
                  </div>
                </div>
                {/* <!-- Card body --> */}
                <div className='flex flex-col justify-between whitespace-normal'>
                  {/* <!-- Paragraph --> */}
                  <div className='max-w-md text-gray-800 flex flex-col items-center mb-4'>
                    <p className='mb-2'>{post.body}</p>

                    {post.imageUrl && <img src={post.imageUrl} alt='Post' style={{ width: '300px' }} />}
                  </div>

                  {/* <!-- Like and comment buttons --> */}
                  <LikeComentBtns />

                  <div className='comment-area max-w-[280px] mx-auto' ref={toggleComments}>
                    <AddComment post={post} refreshAllPosts={refreshPosts} refreshProfileUser={refreshUser} />

                    {post.comments.map((oneComment) => {
                      return (
                        <CommentCard
                          postId={post._id}
                          comment={oneComment}
                          key={oneComment._id}
                          refreshAllPosts={refreshPosts}
                          refreshProfileUser={refreshUser}
                          deletedCommentToast={deletedCommentToast}
                        />
                      );
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
