//jshint esversion:8

import { useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import { Link } from 'react-router-dom';
import homeImg from '../icons/home_black_24dp.svg';
import signupImg from '../icons/app_registration_black_24dp.svg';
import loginImg from '../icons/login_black_24dp.svg';
import feedImg from '../icons/dynamic_feed_black_24dp.svg';
import profileImg from '../icons/account_circle_black_24dp.svg';
import allUsersImg from '../icons/people_black_24dp.svg';
import notificationsImg from '../icons/notifications_black_24dp.svg';
import logoutImg from '../icons/logout_black_24dp.svg';

export const MenuBar = ({ toggleNotifications }) => {
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);

  const MenuBarMobile = () => {
    return (
      <ul className='menu menu-horizontal rounded-box sm:hidden'>
        {!isLoggedIn && (
          <>
            <li>
              <Link to='/' className='hover:text-indigo-500 visited:bg-slate-400'>
                <img src={homeImg} alt='Home' className='h-6 w-6' />
              </Link>
            </li>
            <li>
              <Link to='/signup' className='hover:text-indigo-500 visited:bg-slate-400'>
                <img src={signupImg} alt='Signup' className='h-6 w-6' />
              </Link>
            </li>
            <li>
              <Link to='/login' className='hover:text-indigo-500 visited:bg-slate-400'>
                <img src={loginImg} alt='Login' className='h-6 w-6' />
              </Link>
            </li>
          </>
        )}

        {isLoggedIn && user && (
          <>
            <li>
              <Link to='/feed' className='hover:text-indigo-500 visited:bg-slate-400'>
                <img src={feedImg} alt='Feed' className='h-6 w-6' />
              </Link>
            </li>

            <li>
              <Link to={`/profile/${user._id}`} className='hover:text-indigo-500 visited:bg-slate-400'>
                <img src={profileImg} alt='Profile' className='h-6 w-6' />
              </Link>
            </li>

            <li>
              <Link to='/users' className='hover:text-indigo-500 visited:bg-slate-400'>
                <img src={allUsersImg} alt='Friends' className='h-6 w-6' />
              </Link>
            </li>

            <li>
              <div className='hover:text-indigo-500 visited:bg-slate-400'>
                <img src={notificationsImg} alt='Notifications' className='h-6 w-6 ' onClick={() => toggleNotifications()} />
              </div>
            </li>

            <li>
              <span onClick={logOutUser} className='hover:text-indigo-500 visited:bg-slate-400'>
                <img src={logoutImg} alt='Logout' className='h-6 w-6' />
              </span>
            </li>
          </>
        )}
      </ul>
    );
  };

  return (
    <nav className='sticky top-0 left-0 right-0 z-20 bg-white '>
      <ul className='menu menu-horizontal rounded-box hidden sm:flex justify-between'>
        <li className=''>
          <Link to='/' className='font-semibold visited:bg-slate-600'>
            <span className='text-indigo-500 inline'>IronConnections</span>
          </Link>
        </li>
        <div className='flex'>
          {!isLoggedIn && (
            <>
              <li>
                <Link to='/' className='hover:text-indigo-500 visited:bg-slate-400 '>
                  Home
                </Link>
              </li>
              <li>
                <Link to='/signup' className='hover:text-indigo-500 visited:bg-slate-400'>
                  Sign Up
                </Link>
              </li>
              <li>
                <Link to='/login' className='hover:text-indigo-500 visited:bg-slate-400'>
                  Login
                </Link>
              </li>
            </>
          )}

          {isLoggedIn && user && (
            <>
              <li>
                <Link to='/feed' className='hover:text-indigo-500 visited:bg-slate-400'>
                  Feed
                </Link>
              </li>

              <li>
                <Link to={`/profile/${user._id}`} className='hover:text-indigo-500 visited:bg-slate-400'>
                  Profile
                </Link>
              </li>

              <li>
                <Link to='/users' className='hover:text-indigo-500 visited:bg-slate-400'>
                  Users
                </Link>
              </li>

              <li>
                <div className='hover:text-indigo-500 visited:bg-slate-400 gap-2' onClick={() => toggleNotifications()}>
                  Notifications
                </div>
              </li>

              <li>
                <span onClick={logOutUser} className='hover:text-indigo-500 visited:bg-slate-400'>
                  Logout
                </span>
              </li>
            </>
          )}
        </div>
      </ul>

      <MenuBarMobile />
    </nav>
  );
};
