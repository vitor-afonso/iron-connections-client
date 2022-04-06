// jshint esversion:9

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { signup } from "../api";


export const SignupPage = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  
  const handleSignupSubmit = async (e) => {

    e.preventDefault();

    try {

      const requestBody = {email, password, name};
      await signup(requestBody);
      navigate('/login');

    } catch (error) {

      const errorDescription = error.response.data.message;
      setErrorMessage(errorDescription);
    }
  };

  
  return (
    <div className="SignupPage">
      <h1>Sign Up</h1>

      <form onSubmit={handleSignupSubmit}>
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

        <label>Name:</label>
        <input 
          type="text"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <button type="submit">Sign Up</button>
      </form>

      { errorMessage && <p className="error-message">{errorMessage}</p> }

      <p>Already have account?</p>
      <Link to={"/login"}> Login</Link>
    </div>
  )
}

