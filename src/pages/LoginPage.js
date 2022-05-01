// jshint esversion:9

import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import { login } from '../api';

export const LoginPage = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

      navigate('/feed');
    } catch (error) {
      const errorDescription = error.response.data.message;
      setErrorMessage(errorDescription);
    }
  };

  return (
    <div className='LoginPage min-h-screen bg-gray-100 flex flex-col justify-center py-12 px-6 lg:px-8'>
      <div className='sm:mx-auto sm:w-full sm:max-w-md'>
        <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>Login</h2>
        <p className='mt-2 text-center text-sm text-gray-600 max-w'>
          New to IronConnections?
          <Link to='/signup' className='font-medium text-indigo-600 hover:text-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500'>
            Sign up
          </Link>
        </p>
      </div>

      <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
        <div className='bg-white py-8 px-6 shadow rounded-lg sm:px-10'>
          <form onSubmit={handleLoginSubmit} className='mb-0 space-y-6'>
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

            {errorMessage && <p className='error-message text-red-500'>{errorMessage}</p>}

            <div>
              <button
                type='submit'
                className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
