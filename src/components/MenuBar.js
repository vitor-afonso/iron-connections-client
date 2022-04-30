//jshint esversion:8

import { useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import { Link } from 'react-router-dom';

export const MenuBar = () => {
  // Subscribe to the AuthContext to gain access to
  // the values from AuthContext.Provider `value` prop
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);

  return (
    <nav>
      <ul className='menu menu-horizontal rounded-box flex '>
        <li className='flex-1'>
          <Link to='/' className='font-semibold'>
            <span className='text-indigo-500 inline'>IronConnections</span>
          </Link>
        </li>

        {!isLoggedIn && (
          <>
            <li>
              <Link to='/' className='hover:text-indigo-500'>
                Home
              </Link>
            </li>
            <li>
              <Link to='/signup' className='hover:text-indigo-500'>
                Sign Up
              </Link>
            </li>
            <li>
              <Link to='/login' className='hover:text-indigo-500'>
                Login
              </Link>
            </li>
          </>
        )}

        {isLoggedIn && user && (
          <>
            <li>
              <Link to='/feed' className='hover:text-indigo-500'>
                Feed
              </Link>
            </li>

            <li>
              <Link to={`/profile/${user._id}`} className='hover:text-indigo-500'>
                Profile
              </Link>
            </li>

            <li>
              <Link to='/users' className='hover:text-indigo-500'>
                Users
              </Link>
            </li>

            <li>
              <Link to='/notifications' className='hover:text-indigo-500'>
                Notifications
              </Link>
            </li>

            <li>
              <span onClick={logOutUser} className='hover:text-indigo-500'>
                Logout
              </span>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};
