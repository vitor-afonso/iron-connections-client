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
import { useEffect, useRef, useState } from 'react';

function App() {
  let [rightPosition, setRightPosition] = useState('right-[-400px]');
  let [overlay, setOverlay] = useState('hidden');
  /* let location = useLocation(); */

  const toggleNotifications = () => {
    if (rightPosition === 'right-[-400px]') {
      setRightPosition('right-0');
      setOverlay('fixed');
    } else {
      setRightPosition('right-[-400px]');
      setOverlay('hidden');
    }
  };

  /* useEffect(() => {
    toggleNotifications();
  }, [location.pathname]); */

  return (
    <div className='App bg-slate-200 min-w-screen min-h-[calc(100vh_-_48px)] relative '>
      <MenuBar toggleNotifications={toggleNotifications} />
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
                <FeedPage />
              </IsPrivate>
            }
          />
          <Route
            path='/profile/:userId'
            element={
              <IsPrivate>
                <IsFriend>
                  <ProfilePage />
                </IsFriend>
              </IsPrivate>
            }
          />
          <Route
            path='/post/:postId/edit'
            element={
              <IsPrivate>
                <EditPostPage />
              </IsPrivate>
            }
          />
          <Route
            path='/profile/:userId/edit'
            element={
              <IsPrivate>
                <EditProfilePage />
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
      <div className={`${overlay} top-[48px] left-0 z-40 h-full w-full bg-black opacity-50 `} onClick={toggleNotifications}></div>
      <div className={`fixed top-[48px] ${rightPosition} bg-white h-[calc(100vh_-_48px)] z-50`}>
        <Notifications toggleNotifications={toggleNotifications} />
      </div>
    </div>
  );
}

export default App;
