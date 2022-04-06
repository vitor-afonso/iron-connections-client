//jshint esversion:8
import { Link } from "react-router-dom";
import { useContext } from "react";                  
import { AuthContext } from "../context/auth.context"; 

export const Navbar = () => {

  // Subscribe to the AuthContext to gain access to
  // the values from AuthContext.Provider `value` prop
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);

  //  Update the rendering logic to display different content 
  //  depending on the user being logged in or not
  return (

    <nav>
      {isLoggedIn && (
        <>
          <Link to="/feed"> <button> Feed </button> </Link>        
          <button onClick={logOutUser}> Logout </button>
          <span>{user && user.username}</span>
        </>
      )}
      {!isLoggedIn && (
        <>
          <Link to="/"> <button>Home</button></Link>
          <Link to="/signup"> <button>Sign Up</button> </Link>
          <Link to="/login"> <button>Login</button> </Link>
        </>
      )}
    </nav>
  );
}

