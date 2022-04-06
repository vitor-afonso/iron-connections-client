// jshint esversion:9

import './App.css';
import {Navbar} from "./components/Navbar";
import {Routes, Route} from "react-router-dom";
import {FeedPage} from "./pages/FeedPage";
import {HomePage} from "./pages/HomePage";
import {SignupPage} from "./pages/SignupPage";
import {LoginPage} from "./pages/LoginPage";
import {IsAnon} from "./components/IsAnon";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>      
        <Route exact path="/" element={ <IsAnon> <HomePage /> </IsAnon> } />
        <Route exact path="/feed" element={<FeedPage />} />
        <Route path="/signup" element={ <IsAnon> <SignupPage /> </IsAnon> } /> 
        <Route path="/login" element={  <IsAnon> <LoginPage /> </IsAnon> } />
      </Routes>
    </div>
  );
}

export default App;
