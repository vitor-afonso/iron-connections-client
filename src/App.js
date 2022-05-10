// jshint esversion:9

import './App.css';
import { MenuBar } from './components/MenuBar';
import { Routes, Route } from 'react-router-dom';
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
import { useRef } from 'react';

function App() {
  const toggleNotifications = useRef(null);
  return (
    <div className='App bg-slate-200 min-w-screen min-h-[calc(100vh_-_48px)] '>
      <MenuBar />
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
    </div>
  );
  /* return (
    <div className='App bg-slate-200 min-w-screen mt-[48px] min-h-[calc(100vh_-_48px)] '>
      <MenuBar toggleNotifications={toggleNotifications} />
      <div className='drawer drawer-end '>
        <input id='my-drawer-4' type='checkbox' className='drawer-toggle' />
        <div className='drawer-content scrollbar-hide'>
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
          <label htmlFor='my-drawer-4' className='drawer-button btn btn-primary hidden' ref={toggleNotifications}>
            Open drawer
          </label>
        </div>
        <div className='drawer-side'>
          <label htmlFor='my-drawer-4' className='drawer-overlay'></label>
          <div className='menu overflow-y-0 min-w-88 bg-base-100 text-base-content max-h-[calc(100vh_-_48px)]'>
            <Notifications toggleNotifications={toggleNotifications} />
          </div>
        </div>
      </div>
    </div>
  ); */
}

export default App;
