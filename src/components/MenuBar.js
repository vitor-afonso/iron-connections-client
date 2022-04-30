//jshint esversion:8

import { useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import { Link, NavLink } from 'react-router-dom';

export const MenuBar = () => {
  // Subscribe to the AuthContext to gain access to
  // the values from AuthContext.Provider `value` prop
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);

  return (
    <nav>
      <ul className='menu menu-horizontal bg-primary-content rounded-box flex'>
        <li className='flex-1'>
          <Link to='/'>Iron-Connections</Link>
        </li>

        {!isLoggedIn && (
          <>
            <li>
              <Link to='/'>Home</Link>
            </li>
            <li>
              <Link to='/signup'>Sign Up</Link>
            </li>
            <li>
              <Link to='/login'>Login</Link>
            </li>
          </>
        )}

        {isLoggedIn && user && (
          <>
            <li>
              <Link to='/feed'>Feed</Link>
            </li>

            <li>
              <Link to={`/profile/${user._id}`}>Profile</Link>
            </li>

            <li>
              <Link to='/users'> Users </Link>
            </li>

            <li>
              <Link href='/notifications'> Notifications </Link>
            </li>

            <li>
              <Link onClick={logOutUser}>Logout</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};
