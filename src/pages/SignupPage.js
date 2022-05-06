// jshint esversion:9

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../api';

export const SignupPage = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    try {
      const requestBody = { email, password, username };
      await signup(requestBody);
      navigate('/login');
    } catch (error) {
      const errorDescription = error.response.data.message;
      setErrorMessage(errorDescription);
    }
  };

  return (
    <div className='SignupPage min-h-screen bg-gray-100 flex flex-col justify-start py-12 px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>Create your account</h2>
        <p className='mt-2 text-center text-sm text-gray-600 max-w'>
          Already have an account?
          <Link to='/login' className='font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'>
            Sign in
          </Link>
        </p>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-6 shadow rounded-lg sm:px-10'>
          <form onSubmit={handleSignupSubmit} className='mb-0 space-y-6'>
            <div>
              <label for='email' className='block text-sm font-medium text-gray-700'>
                Email address
              </label>
              <div className='mt-1'>
                <input id='email' name='email' type='email' autocomplete='email' required className='' value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <div>
              <label for='password' className='block text-sm font-medium text-gray-700'>
                Password
              </label>
              <div className='mt-1'>
                <input id='password' name='password' type='password' autocomplete='current-password' required className='' value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>

            <div>
              <label for='username' className='block text-sm font-medium text-gray-700'>
                Username
              </label>
              <div className='mt-1'>
                <input id='username' name='username' type='text' autocomplete='current-username' required className='' value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
            </div>

            {errorMessage && <p className='error-message text-red-500'>{errorMessage}</p>}

            <div className='flex items-center'>
              <input id='terms-and-privacy' name='terms-and-privacy' type='checkbox' className='' />
              <label for='terms-and-privacy' className='ml-2 block text-sm text-gray-900'>
                I agree to the terms and privacy policy.
              </label>
            </div>

            <div>
              <button
                type='submit'
                className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              >
                Sign up
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
