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
import { AuthContext } from './context/auth.context';
import { SocketIoContext } from './context/socket.context';

function App() {
  const { user } = useContext(AuthContext);
  const { socket } = useContext(SocketIoContext);
  let [rightPosition, setRightPosition] = useState('right-[-400px]');
  let [overlay, setOverlay] = useState('hidden');
  let location = useLocation();
  const [isShowing, setIsShowing] = useState(false);
  const [haveNotification, setHaveNotification] = useState('');

  const deletedPost = () => toast.info('Post successfully deleted!');
  const deletedCommentToast = () => toast.info('Comment successfully deleted!');
  const toastUpdated = () => toast.info('Post successfully updated!');
  const toastProfileUpdated = () => toast.info('Profile successfully updated!');
  const toastNotification = () => toast.info('You have a new notification!');

  useEffect(() => {
    if (socket) {
      const onNewNotification = (newNotification) => {
        if (newNotification.userId !== user._id && haveNotification !== 'bg-indigo-500') {
          setHaveNotification('bg-indigo-500');
          toastNotification();
        }
      };
      socket.on('newNotification', onNewNotification);

      return () => {
        socket.off('newNotification', onNewNotification);
      };
    }
  }, [socket, user]);

  useEffect(() => {
    if (rightPosition === 'right-0') {
      toggleNotifications();
    }
  }, [location.pathname]);

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

  return (
    <div className='App bg-slate-200 min-w-screen min-h-[calc(100vh_-_48px)] relative '>
      <MenuBar toggleNotifications={toggleNotifications} setHaveNotification={setHaveNotification} haveNotification={haveNotification} />
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
                  <ProfilePage deletedCommentToast={deletedCommentToast} key={Date.now()} />
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
          <div className={`fixed  ${rightPosition} bg-white h-[calc(100vh_-_48px)] overflow-y-auto`}>
            <Notifications toggleNotifications={toggleNotifications} setHaveNotification={setHaveNotification} />
          </div>
        </Transition.Child>
      </Transition>
    </div>
  );
}

export default App;
