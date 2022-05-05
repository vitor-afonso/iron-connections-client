//jshint esversion:9

import { useContext, useState, useEffect, useRef } from 'react';
import { addPost, uploadImage, getUser, updateUserNotification, createNotification } from './../api';
import { AuthContext } from '../context/auth.context';
import { useLocation } from 'react-router-dom';

export const AddPost = ({ refreshPosts, refreshUser }) => {
  const { user } = useContext(AuthContext);
  const [body, setBody] = useState('');
  const [tempImageUrl, setTempImageUrl] = useState('');
  const [objImageToUpload, setObjImageToUpload] = useState(null);
  const [currentUserImageUrl, setCurrentUserImageUrl] = useState('');
  const [userFollowers, setUserFollowers] = useState([]);
  const inputFileUpload = useRef(null);
  const location = useLocation();

  let addPostTopDistance = '';
  let addPostPosition = '';
  let addPostPaddingX = ''; // <= Needed on feedPage

  if (location.pathname.includes('feed')) {
    addPostTopDistance = 'top-12';
    addPostPaddingX = 'px-4';
    addPostPosition = 'fixed';
  } else {
    addPostPosition = 'relative';
  }

  const handleFileUpload = async (e) => {
    try {
      if (e.target.files.lenght !== 0) {
        setTempImageUrl(URL.createObjectURL(e.target.files[0]));
        setObjImageToUpload(e.target.files[0]);
      }
    } catch (error) {
      console.log('Error while uploading the file: ', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (objImageToUpload) {
        // imageUrl => this name has to be the same as in the model if we pass
        // req.body to .create() method when creating a new post in '/api/posts' POST route
        const uploadData = new FormData();

        uploadData.append('imageUrl', objImageToUpload);

        let response = await uploadImage(uploadData);

        // response carries "fileUrl" which we can use to update the state

        let newPost = await addPost({ body, userId: user._id, imageUrl: response.fileUrl });
        updateFollowersNotifications(newPost.data._id);
        setObjImageToUpload(null);
      } else {
        let newPost = await addPost({ body, userId: user._id });

        updateFollowersNotifications(newPost.data._id);
      }

      if (refreshPosts) {
        refreshPosts();
      }
      refreshUser();
      setBody('');
      setTempImageUrl('');
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

        setCurrentUserImageUrl(response.data.imageUrl);

        setUserFollowers(response.data.followers);
      }
    })();
  }, [user]);

  return (
    <div className={`AddPost z-10 ${addPostPosition} ${addPostTopDistance} ${addPostPaddingX} rounded-md  w-full max-w-[514px] `}>
      <form onSubmit={handleSubmit}>
        <div className='overflow-x-auto '>
          <table className='table w-full  '>
            <tbody>
              <tr>
                <td className='border-none pb-0'>
                  <div className='flex items-center space-x-3'>
                    <div className='avatar'>
                      <div className='mask mask-squircle w-12 h-12'>{currentUserImageUrl && <img src={currentUserImageUrl} alt='Author' />}</div>
                    </div>
                    <label className='w-full'>
                      <textarea type='textarea' name='body' value={body} onChange={(e) => setBody(e.target.value)} placeholder='Share your thoughts' />
                    </label>
                  </div>
                </td>
              </tr>
              {tempImageUrl && (
                <tr className='max-w-200px'>
                  <td>
                    <img src={`${tempImageUrl}`} alt='Uploaded file' />
                  </td>
                </tr>
              )}
              <tr>
                <td>
                  <div className='flex justify-between'>
                    <button type='button' onClick={() => inputFileUpload.current.click()} className='btn btn-active btn-ghost'>
                      Choose File
                    </button>
                    <input ref={inputFileUpload} className='hidden' type='file' onChange={(e) => handleFileUpload(e)} />
                    <button type='submit' className='btn btn-active btn-ghost justify-self-end'>
                      Add Post
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
