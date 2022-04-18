// jshint esversion:9

import './App.css';
import { useEffect, useState } from "react";
import { getAllPosts, getUsers } from './api';
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


function App() {

  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);

  const getPosts = async () => {

    try {

      let response = await getAllPosts();
      setPosts(response.data);
      /* console.log('all posts =>', response.data); */
      
    } catch (error) {

      console.log("No posts... ",error);
    }
      
  };

  const getAllUsers = async () => {

    try {

      let response = await getUsers();
      setUsers(response.data);
      
    } catch (error) {

      console.log("No posts... ",error);
    }
  };

  
  return (
    <div className="App">

      <MenuBar />
      <Routes>      
        <Route path="/" element={ <IsAnon> <HomePage /> </IsAnon> } />
        <Route path="/feed" element={ <IsPrivate> <FeedPage refreshPosts={getPosts} posts={posts}/> </IsPrivate>} />
        <Route path="/profile/:userId" element={ <IsPrivate> <ProfilePage refreshPosts={getPosts}/> </IsPrivate> } />
        <Route path="/post/:postId/edit" element={ <IsPrivate> <EditPostPage /> </IsPrivate> }/>
        <Route path="/profile/:userId/edit" element={ <IsPrivate> <EditProfilePage /> </IsPrivate> }/>
        <Route path="/notifications" element={ <IsPrivate> <NotificationsPage /> </IsPrivate>} />
        <Route path="/users" element={ <IsPrivate> <UsersPage allUsers={users} refreshAllUsers={getAllUsers}/> </IsPrivate>} />
        <Route path="/signup" element={ <IsAnon> <SignupPage /> </IsAnon> } /> 
        <Route path="/login" element={  <IsAnon> <LoginPage /> </IsAnon> } />
      </Routes>
      
    </div>
  );
}

export default App;
