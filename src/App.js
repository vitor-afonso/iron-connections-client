// jshint esversion:9

import './App.css';
import {MenuBar} from "./components/MenuBar";
import {Routes, Route} from "react-router-dom";
import {FeedPage} from "./pages/FeedPage";
import {HomePage} from "./pages/HomePage";
import {SignupPage} from "./pages/SignupPage";
import {LoginPage} from "./pages/LoginPage";
import {IsAnon} from "./components/IsAnon";
import { ProfilePage } from './pages/ProfilePage';
import { NotificationsPage } from './pages/NotificationsPage';
import { IsPrivate } from './components/isPrivate';
import { EditPostPage } from './pages/EditPostPage';
import { EditProfilePage } from './pages/EditProfilePage';
import { UsersPage } from './pages/UsersPage';
import { FriendsPage } from './pages/FriendsPage';


function App() {

  return (
    <div className="App">

      <MenuBar />
      <Routes>      
        <Route path="/" element={ <IsAnon> <HomePage /> </IsAnon> } />
        <Route path="/feed" element={ <IsPrivate> <FeedPage /> </IsPrivate>} />
        <Route path="/profile/:userId" element={ <IsPrivate> <ProfilePage /> </IsPrivate> } />
        <Route path="/post/:postId/edit" element={ <IsPrivate> <EditPostPage /> </IsPrivate> }/>
        <Route path="/profile/:userId/edit" element={ <IsPrivate> <EditProfilePage /> </IsPrivate> }/>
        <Route path="/profile/:profileOwnerId/connects" element={ <IsPrivate> <FriendsPage /> </IsPrivate> }/>
        <Route path="/notifications" element={ <IsPrivate> <NotificationsPage /> </IsPrivate>} />
        <Route path="/users" element={ <IsPrivate> <UsersPage /> </IsPrivate>} />
        <Route path="/signup" element={ <IsAnon> <SignupPage /> </IsAnon> } /> 
        <Route path="/login" element={  <IsAnon> <LoginPage /> </IsAnon> } />
      </Routes>
      
    </div>
  );
}

export default App;
