//jshint esversion:9

import { useContext, useState, useEffect } from 'react';
import { addPost, uploadImage, getUser, updateUserNotification } from './../api';
import { AuthContext } from '../context/auth.context';

export const AddPost = ({ refreshPosts, refreshUser }) => {
  const { user } = useContext(AuthContext);
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [userImageUrl, setUserImageUrl] = useState('');
  const [userFollowers, setUserFollowers] = useState([]);

  // ******** this method handles the file upload ********
  const handleFileUpload = async (e) => {
    try {
      const uploadData = new FormData();

      // imageUrl => this name has to be the same as in the model if we pass
      // req.body to .create() method when creating a new post in '/api/posts' POST route

      uploadData.append('imageUrl', e.target.files[0]);

      let response = await uploadImage(uploadData);
      /* console.log("response is: ", response); */
      // response carries "fileUrl" which we can use to update the state
      setImageUrl(response.fileUrl);
    } catch (error) {
      console.log('Error while uploading the file: ', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let newPost = { body, userId: user._id, imageUrl };
      await addPost(newPost);
      refreshPosts();
      refreshUser();
      setBody('');
      setImageUrl('');
      updateFollowersNotifications();
    } catch (error) {
      console.log('Something went wrong while trying to add new post =>', error);
    }
  };

  const updateFollowersNotifications = () => {
    const month = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    let date = new Date();
    let dateYear = date.getFullYear();
    let dateMonth = month[date.getMonth()];
    let dateDay = date.getDate();
    let postDate = `${dateDay}-${dateMonth}-${dateYear}`;

    try {
      userFollowers.forEach((follower) => {
        let str = `${user.username} have a new post. ${postDate}`;

        updateUserNotification({ notification: str }, follower._id);
      });
    } catch (error) {
      console.log('Something went wrong while trying to update notification =>', error);
    }
  };

  useEffect(() => {
    (async () => {
      if (user) {
        let response = await getUser(user._id);

        setUserImageUrl(response.data.imageUrl);

        setUserFollowers(response.data.followers);
      }
    })();
  }, [user]);

  return (
    <div className='AddPost'>
      <form onSubmit={handleSubmit}>
        {userImageUrl && <img src={userImageUrl} alt='Author' style={{ width: '30px' }} />}

        <label>
          <input type='text' name='body' value={body} onChange={(e) => setBody(e.target.value)} placeholder='Share your thoughts' style={{ width: '250px' }} />
          <span style={{ marginLeft: '-35px', marginRight: '18px' }}>📷</span>
        </label>

        <label>
          <input type='file' onChange={(e) => handleFileUpload(e)} />
        </label>
        <button type='submit'>Create Post</button>
      </form>
    </div>
  );
};
