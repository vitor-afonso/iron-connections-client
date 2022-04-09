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


function App() {
  return (
    <div className="App">

      <MenuBar />
      <Routes>      
        <Route exact path="/" element={ <IsAnon> <HomePage /> </IsAnon> } />
        <Route exact path="/feed" element={ <IsPrivate> <FeedPage /> </IsPrivate>} />
        <Route exact path="/profile" element={ <IsPrivate> <ProfilePage /> </IsPrivate> } />
        <Route exact path="/notifications" element={ <IsPrivate> <NotificationsPage /> </IsPrivate>} />
        <Route path="/signup" element={ <IsAnon> <SignupPage /> </IsAnon> } /> 
        <Route path="/login" element={  <IsAnon> <LoginPage /> </IsAnon> } />
      </Routes>
      
    </div>
  );
}

export default App;
