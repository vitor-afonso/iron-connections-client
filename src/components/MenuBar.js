//jshint esversion:8

import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/auth.context';
import { Link } from 'react-router-dom';

export const MenuBar = () => {
  // Subscribe to the AuthContext to gain access to
  // the values from AuthContext.Provider `value` prop
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);

  return (
    <nav className='fixed top-0 left-0 right-0 bg-white z-10'>
      <ul className='menu menu-horizontal rounded-box hidden sm:flex'>
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

      <ul className='menu menu-horizontal rounded-box sm:hidden'>
        {!isLoggedIn && (
          <>
            <li>
              <Link to='/' className='hover:text-indigo-500'>
                <img src='./icons/home_black_24dp.svg' alt='Home' className='h-6 w-6' />
              </Link>
            </li>
            <li>
              <Link to='/signup' className='hover:text-indigo-500'>
                <img src='./icons/app_registration_black_24dp.svg' alt='Signup' className='h-6 w-6' />
              </Link>
            </li>
            <li>
              <Link to='/login' className='hover:text-indigo-500'>
                <img src='./icons/login_black_24dp.svg' alt='Login' className='h-6 w-6' />
              </Link>
            </li>
          </>
        )}

        {isLoggedIn && user && (
          <>
            <li>
              <Link to='/feed' className='hover:text-indigo-500'>
                <img src='./icons/dynamic_feed_black_24dp.svg' alt='Feed' className='h-6 w-6' />
              </Link>
            </li>

            <li>
              <Link to={`/profile/${user._id}`} className='hover:text-indigo-500'>
                <img src='./icons/account_circle_black_24dp.svg' alt='Profile' className='h-6 w-6' />
              </Link>
            </li>

            <li>
              <Link to='/users' className='hover:text-indigo-500'>
                <img src='./icons/people_black_24dp.svg' alt='Friends' className='h-6 w-6' />
              </Link>
            </li>

            <li>
              <Link to='/notifications' className='hover:text-indigo-500'>
                <img src='./icons/notifications_black_24dp.svg' alt='Notifications' className='h-6 w-6' />
              </Link>
            </li>

            <li>
              <span onClick={logOutUser} className='hover:text-indigo-500'>
                <img src='./icons/logout_black_24dp.svg' alt='Logout' className='h-6 w-6' />
              </span>
            </li>

            <li>
              <button data-toggle-theme='dark,light' data-act-class='ACTIVECLASS'></button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};
