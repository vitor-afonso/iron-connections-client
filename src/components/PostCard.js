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

  /* useEffect(() => {
    toggleComments.current.style.display = 'none';
  }, []); */

  const showComments = () => {
    if (toggleComments.current.style.display === 'none') {
      toggleComments.current.style.display = 'block';
    } else {
      toggleComments.current.style.display = 'none';
    }
  };
  return (
    <div className='PostCard' data-aos='fade-up'>
      <section className='flex flex-col justify-center antialiased bg-gray-50 text-gray-600 min-h-screen p-4'>
        <div className='h-full'>
          <table className='table w-full  '>
            <tbody>
              <tr>
                <td className='border-none'>
                  <div className='flex items-center space-x-3'>
                    <div className='avatar'>
                      <div className='mask mask-squircle w-8 h-8'>
                        {post.userId.imageUrl && (
                          <Link to={`/profile/${post.userId._id}`}>
                            <img src={post.userId.imageUrl} alt={post.userId.username} />
                          </Link>
                        )}
                      </div>
                    </div>

                    <span> {post.userId.username} </span>
                    <span> {postDate} </span>
                    {post.userId._id === user._id && (
                      <Link to={`/post/${post._id}/edit`}>
                        <button className='btn btn-active btn-ghost'>Edit</button>
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          {/* <!-- Card --> */}
          <div className='max-w-2xl mx-auto bg-indigo-600 shadow-lg rounded-lg'>
            <div className='px-6 py-5'>
              <div className='flex items-start'>
                {/* <!-- Icon --> */}
                <svg className='fill-current flex-shrink-0 mr-5' width='30' height='30' viewBox='0 0 30 30'>
                  <path className='text-indigo-300' d='m16 14.883 14-7L14.447.106a1 1 0 0 0-.895 0L0 6.883l16 8Z' />
                  <path className='text-indigo-200' d='M16 14.619v15l13.447-6.724A.998.998 0 0 0 30 22V7.619l-14 7Z' />
                  <path className='text-indigo-500' d='m16 14.619-16-8V21c0 .379.214.725.553.895L16 29.619v-15Z' />
                </svg>
                {/* <!-- Card content --> */}
                <div className='flex-grow truncate'>
                  {/* <!-- Card header --> */}
                  <div className='w-full sm:flex justify-between items-center mb-3'>
                    {/* <!-- Title --> */}
                    <h2 className='text-2xl leading-snug font-extrabold text-gray-50 truncate mb-1 sm:mb-0'>Simple Design Tips</h2>
                    {/* <!-- Like and comment buttons --> */}
                    <div className='flex-shrink-0 flex items-center space-x-3 sm:ml-2'>
                      <button className='flex items-center text-left text-sm font-medium text-indigo-100 hover:text-white group focus:outline-none focus-visible:border-b focus-visible:border-indigo-100'>
                        <svg className='w-4 h-4 flex-shrink-0 mr-2 fill-current text-gray-300 group-hover:text-gray-200' viewBox='0 0 16 16'>
                          <path d='M14.682 2.318A4.485 4.485 0 0 0 11.5 1 4.377 4.377 0 0 0 8 2.707 4.383 4.383 0 0 0 4.5 1a4.5 4.5 0 0 0-3.182 7.682L8 15l6.682-6.318a4.5 4.5 0 0 0 0-6.364Zm-1.4 4.933L8 12.247l-5.285-5A2.5 2.5 0 0 1 4.5 3c1.437 0 2.312.681 3.5 2.625C9.187 3.681 10.062 3 11.5 3a2.5 2.5 0 0 1 1.785 4.251h-.003Z' />
                        </svg>
                        <span>
                          498 <span className='sr-only'>likes</span>
                        </span>
                      </button>
                      <button className='flex items-center text-left text-sm font-medium text-indigo-100 hover:text-white group focus:outline-none focus-visible:border-b focus-visible:border-indigo-100'>
                        <svg className='w-4 h-4 flex-shrink-0 mr-2 fill-current text-gray-300 group-hover:text-gray-200' viewBox='0 0 16 16'>
                          <path d='M8 0C3.6 0 0 3.1 0 7s3.6 7 8 7h.6l5.4 2v-4.4c1.2-1.2 2-2.8 2-4.6 0-3.9-3.6-7-8-7Zm4 10.8v2.3L8.9 12H8c-3.3 0-6-2.2-6-5s2.7-5 6-5 6 2.2 6 5c0 2.2-2 3.8-2 3.8Z' />
                        </svg>
                        <span>
                          64 <span className='sr-only'>comments</span>
                        </span>
                      </button>
                    </div>
                  </div>
                  {/* <!-- Card body --> */}
                  <div className='flex items-end justify-between whitespace-normal'>
                    {/* <!-- Paragraph --> */}
                    <div className='max-w-md text-indigo-100'>
                      <p className='mb-2'>Lorem ipsum dolor sit amet, consecte adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore.</p>
                    </div>
                    {/* <!-- More link --> */}
                    <Link
                      to=''
                      className='flex-shrink-0 flex items-center justify-center text-indigo-600 w-10 h-10 rounded-full bg-gradient-to-b from-indigo-50 to-indigo-100 hover:from-white hover:to-indigo-50 focus:outline-none focus-visible:from-white focus-visible:to-white transition duration-150 ml-2'
                    >
                      <span className='block font-bold'>
                        <span className='sr-only'>Read more</span> ->
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
  /* return (
    <div className='postCard-container' data-aos='fade-up'>
      <div className='post-header'>
        <small>
          <NavLink to={`/profile/${post.userId._id}`}>
            <img src={post.userId.imageUrl} alt='Author' style={{ width: '30px' }} />
          </NavLink>
          <span> {post.userId.username} </span>
          <span> {postDate} </span>
          {post.userId._id === user._id && (
            <NavLink to={`/post/${post._id}/edit`}>
              <button>Edit</button>
            </NavLink>
          )}
        </small>
      </div>

      <p>{post.body}</p>

      {post.imageUrl && <img src={post.imageUrl} alt='Post' style={{ width: '300px' }} />}

      <div>
        <span onClick={() => handleLike(post._id)}>💙 </span>
        <span>{likesNum}</span>
        <span onClick={showComments}>
          <b>Comment</b>
        </span>
        <span>{post.comments.length}</span>
        <span>
          <b>Share</b>
        </span>
      </div>

      <div className='comment-area' ref={toggleComments}>
        <AddComment post={post} refreshAllPosts={refreshPosts} refreshProfileUser={refreshUser} />

        {post.comments.map((oneComment) => {
          return <CommentCard postId={post._id} comment={oneComment} key={oneComment._id} refreshAllPosts={refreshPosts} refreshProfileUser={refreshUser} />;
        })}
      </div>
    </div>
  ); */
};
