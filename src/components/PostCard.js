//jshint esversion:9

import { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../context/auth.context';
import { NavLink } from 'react-router-dom';

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

          let notification = await createNotification({ content: str, userId: user._id });
          updateUserNotification({ notificationId: notification.data._id }, post.userId._id);
        }
        refreshPosts();
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
    <div style={{ marginTop: '30px' }}>
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
          {' '}
          <b>Comment</b>{' '}
        </span>
        <span>{post.comments.length}</span>
        <span>
          {' '}
          <b>Share</b>{' '}
        </span>
      </div>

      <div className='comment-area' ref={toggleComments}>
        <AddComment post={post} refreshAllPosts={refreshPosts} refreshProfileUser={refreshUser} />

        {post.comments.map((oneComment) => {
          return <CommentCard postId={post._id} comment={oneComment} key={oneComment._id} refreshAllPosts={refreshPosts} refreshProfileUser={refreshUser} />;
        })}
      </div>

      <hr />
    </div>
  );
};
