// jshint esversion:9

import { useState, useContext, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/auth.context';
import { login } from '../api';
import { SpinnerCircular } from 'spinners-react';
import showLoadingMessage from '../utils/app.utils';

export const LoginPage = () => {
  const { storeToken, authenticateUser } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const msgRef = useRef(null);

  useEffect(() => {
    if (isLoading && msgRef) {
      setTimeout(() => {
        showLoadingMessage(msgRef, 0, 100);
      }, 4000);
    }
  }, [isLoading, msgRef]);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='LoginPage min-h-screen bg-gray-100 flex flex-col justify-start py-12 px-6 lg:px-8'>
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
              <label htmlFor='email' className='block text-sm font-medium text-gray-700'>
                Email address
              </label>
              <div className='mt-1'>
                <input id='email' name='email' type='email' autoComplete='email' required className='' value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
            </div>

            <div>
              <label htmlFor='password' className='block text-sm font-medium text-gray-700'>
                Password
              </label>
              <div className='mt-1'>
                <input id='password' name='password' type='password' autoComplete='current-password' required className='' value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>

            {errorMessage && <p className='error-message text-red-500'>{errorMessage}</p>}

            <div className='flex justify-center'>
              {!isLoading ? (
                <button
                  type='submit'
                  className='w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                >
                  Login
                </button>
              ) : (
                <div>
                  <div className='flex justify-center'>
                    <SpinnerCircular size={90} thickness={115} speed={100} color='rgb(86,13,248)' secondaryColor='rgba(57, 146, 172, 0.48)' />
                  </div>
                  <p ref={msgRef} className='mt-4'></p>
                </div>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
