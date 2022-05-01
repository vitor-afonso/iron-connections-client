//jshint esversion:9

import { useContext, useState, useEffect, useRef } from 'react';
import { addPost, uploadImage, getUser, updateUserNotification, createNotification } from './../api';
import { AuthContext } from '../context/auth.context';

export const AddPost = ({ refreshPosts, refreshUser }) => {
  const { user } = useContext(AuthContext);
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [postImageUrl, setPostImageUrl] = useState('');
  const [userFollowers, setUserFollowers] = useState([]);
  const inputFileUpload = useRef(null);

  const handleFileUpload = async (e) => {
    try {
      const uploadData = new FormData();

      // imageUrl => this name has to be the same as in the model if we pass
      // req.body to .create() method when creating a new post in '/api/posts' POST route

      /* if (e.target.files.lenght !== 0) {
        setTempImageUrl(URL.createObjectURL(e.target.files[0]));
      } */

      uploadData.append('imageUrl', e.target.files[0]);

      let response = await uploadImage(uploadData);

      // response carries "fileUrl" which we can use to update the state
      setImageUrl(response.fileUrl);
    } catch (error) {
      console.log('Error while uploading the file: ', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let requestBody = { body, userId: user._id, imageUrl };
      let newPost = await addPost(requestBody);
      if (refreshPosts) {
        refreshPosts();
      }
      refreshUser();
      setBody('');
      setImageUrl('');
      updateFollowersNotifications(newPost.data._id);
    } catch (error) {
      console.log('Something went wrong while trying to add new post =>', error);
    }
  };

  const updateFollowersNotifications = async (newPostId) => {
    const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    let date = new Date();
    let dateYear = date.getFullYear();
    let dateMonth = month[date.getMonth()];
    let dateDay = date.getDate();
    let postDate = `${dateDay}-${dateMonth}-${dateYear}`;

    try {
      let str = `${user.username} have a new post. ${postDate}`;

      let response = await createNotification({ content: str, userId: user._id, postId: newPostId });

      userFollowers.forEach((follower) => {
        updateUserNotification({ notificationId: response.data._id }, follower._id);
      });
    } catch (error) {
      console.log('Something went wrong while trying to update notification =>', error);
    }
  };

  useEffect(() => {
    (async () => {
      if (user) {
        let response = await getUser(user._id);

        setPostImageUrl(response.data.imageUrl);

        setUserFollowers(response.data.followers);
      }
    })();
  }, [user]);

  return (
    <div className='AddPost fixed top-12 z-10 rounded-md min-w-96 w-full px-4 max-w-md  sm:max-w-lg sm-left-auto sm-right-auto'>
      <form onSubmit={handleSubmit}>
        <div className='overflow-x-auto w-full'>
          <table className='table w-full  '>
            <tbody>
              <tr>
                <td className='border-none'>
                  <div className='flex items-center space-x-3'>
                    <div className='avatar'>
                      <div className='mask mask-squircle w-12 h-12'>{postImageUrl && <img src={postImageUrl} alt='Author' />}</div>
                    </div>
                    <label className='w-full'>
                      <textarea type='textarea' name='body' value={body} onChange={(e) => setBody(e.target.value)} placeholder='Share your thoughts' />
                    </label>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div className='flex'>
                    <button onClick={() => inputFileUpload.current.click()} className='btn btn-active btn-ghost mr-4'>
                      Choose File
                    </button>
                    <input ref={inputFileUpload} className='hidden' type='file' onChange={(e) => handleFileUpload(e)} />
                    <button type='submit' className='btn btn-outline btn-primary justify-self-end'>
                      Create Post
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </form>
    </div>
  );
};
