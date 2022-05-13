// jshint esversion:9

import './App.css';
import { MenuBar } from './components/MenuBar';
import { Routes, Route, useLocation } from 'react-router-dom';
import { FeedPage } from './pages/FeedPage';
import { HomePage } from './pages/HomePage';
import { SignupPage } from './pages/SignupPage';
import { LoginPage } from './pages/LoginPage';
import { IsAnon } from './components/IsAnon';
import { ProfilePage } from './pages/ProfilePage';
import { Notifications } from './components/Notifications';
import { IsPrivate } from './components/isPrivate';
import { EditPostPage } from './pages/EditPostPage';
import { EditProfilePage } from './pages/EditProfilePage';
import { UsersPage } from './pages/UsersPage';
import { FriendsPage } from './pages/FriendsPage';
import { IsFriend } from './components/isFriend';
import { useContext, useEffect, useState } from 'react';
import { Transition } from '@headlessui/react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import socketIOClient from 'socket.io-client';
import { AuthContext } from './context/auth.context';

function App() {
  const { user } = useContext(AuthContext);
  let [rightPosition, setRightPosition] = useState('right-[-400px]');
  let [overlay, setOverlay] = useState('hidden');
  let location = useLocation();
  const [isShowing, setIsShowing] = useState(false);

  const deletedPost = () => toast.info('Post successfully deleted!');
  const deletedCommentToast = () => toast.info('Comment successfully deleted!');
  const toastUpdated = () => toast.success('Post successfully updated!');
  const toastProfileUpdated = () => toast.success('Profile successfully updated!');

  const toggleNotifications = () => {
    if (rightPosition === 'right-[-400px]') {
      setRightPosition('right-0');
      setOverlay('fixed');
      setIsShowing(true);
    } else {
      setRightPosition('right-[-400px]');
      setOverlay('hidden');
      setIsShowing(false);
    }
  };

  useEffect(() => {
    if (rightPosition === 'right-0') {
      toggleNotifications();
    }
  }, [location.pathname]);

  useEffect(() => {
    const socket = socketIOClient(process.env.REACT_APP_PROJECT_API);
    socket.on('newNotification', (newNotification) => {
      /* console.log('newNotification =>', newNotification); */

      if (user && newNotification.userId._id !== user._id) {
        toast.info('You have a new notification!');
      }
    });
  }, []);

  return (
    <div className='App bg-slate-200 min-w-screen min-h-[calc(100vh_-_48px)] relative '>
      <MenuBar toggleNotifications={toggleNotifications} />
      <ToastContainer autoClose={2500} />
      <>
        <Routes>
          <Route
            path='/'
            element={
              <IsAnon>
                <HomePage />
              </IsAnon>
            }
          />
          <Route
            path='/feed'
            element={
              <IsPrivate>
                <FeedPage deletedCommentToast={deletedCommentToast} />
              </IsPrivate>
            }
          />
          <Route
            path='/profile/:userId'
            element={
              <IsPrivate>
                <IsFriend>
                  <ProfilePage deletedCommentToast={deletedCommentToast} />
                </IsFriend>
              </IsPrivate>
            }
          />
          <Route
            path='/post/:postId/edit'
            element={
              <IsPrivate>
                <EditPostPage toastDeleted={deletedPost} toastUpdated={toastUpdated} />
              </IsPrivate>
            }
          />
          <Route
            path='/profile/:userId/edit'
            element={
              <IsPrivate>
                <EditProfilePage toastProfileUpdated={toastProfileUpdated} />
              </IsPrivate>
            }
          />
          <Route
            path='/profile/:profileOwnerId/connects'
            element={
              <IsPrivate>
                <FriendsPage />
              </IsPrivate>
            }
          />
          <Route
            path='/users'
            element={
              <IsPrivate>
                <UsersPage />
              </IsPrivate>
            }
          />
          <Route
            path='/signup'
            element={
              <IsAnon>
                <SignupPage />
              </IsAnon>
            }
          />
          <Route
            path='/login'
            element={
              <IsAnon>
                <LoginPage />
              </IsAnon>
            }
          />
        </Routes>
      </>
      <Transition show={isShowing}>
        <Transition.Child
          enter='transition-opacity ease-linear duration-500 transform'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='transition-opacity ease-linear duration-500 transform'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className={`${overlay} top-[48px] left-0 z-40 h-full w-full bg-black opacity-50 `} onClick={toggleNotifications}></div>
        </Transition.Child>
        <Transition.Child
          enter='transition ease-in-out duration-1000 transform'
          enterFrom='-translate-x-[-400px]'
          enterTo='translate-x-0'
          leave='transition ease-in-out duration-1000 transform'
          leaveFrom='translate-x-0'
          leaveTo='-translate-x-[-400px]'
          className={`fixed top-[48px] ${rightPosition}  h-[calc(100vh_-_48px)] z-50`}
        >
          <div className={`fixed  ${rightPosition} bg-white h-[calc(100vh_-_48px)]`}>
            <Notifications toggleNotifications={toggleNotifications} />
          </div>
        </Transition.Child>
      </Transition>
    </div>
  );
}

export default App;
