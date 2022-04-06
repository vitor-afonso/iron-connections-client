// jshint esversion:9

import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from '../context/auth.context';

import { login } from "../api";


export const LoginPage = (props) => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);
  
  const navigate = useNavigate();

  const { storeToken, authenticateUser } = useContext(AuthContext);

  
  const handleLoginSubmit = async (e) => {

    e.preventDefault();

    try {

      const requestBody = { email, password };

      let response = await login(requestBody);
  
      /* console.log('JWT token', response.data.token); */

      storeToken(response.data.authToken); 

      // Verify the token by sending a request 
      // to the server's JWT validation endpoint. 
      authenticateUser();  

      navigate("/");
        
    } catch (error) {

      const errorDescription = error.response.data.message;
      setErrorMessage(errorDescription);
    }
  };
  
  return (
    <div className="LoginPage">
      <h1>Login</h1>

      <form onSubmit={handleLoginSubmit}>
        <label>Email:</label>
        <input 
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label>Password:</label>
        <input
          type="password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Login</button>
      </form>
      { errorMessage && <p className="error-message">{errorMessage}</p> }

      <p>Don't have an account yet?</p>
      <Link to={"/signup"}> Sign Up</Link>
    </div>
  )
}
