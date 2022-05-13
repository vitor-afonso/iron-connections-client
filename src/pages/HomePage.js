//jshint esversion:9

import { Link } from 'react-router-dom';

export const HomePage = () => {
  return (
    <div className='relative bg-white overflow-hidden min-h-[calc(100vh_-_52px)] xs:flex xs:flex-col xs:justify-center lg:flex'>
      <main className=' mx-auto max-w-7xl p-4  sm:px-6 lg:mt-28 lg:px-8 '>
        <div className='sm:text-center lg:text-left'>
          <h1 className='text-3xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl'>
            <span className='block xl:inline'>IronConnections the place where</span> <span className='block text-indigo-600 xl:inline'>all your connections come true</span>
          </h1>
          <p className='mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0'>
            IronConnections helps you connect and share with those who are part of your life.
          </p>
          <div className='mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start'>
            <div className='rounded-md shadow'>
              <Link
                to='/signup'
                className='w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10'
              >
                Sign up
              </Link>
            </div>
            <div className='mt-3 sm:mt-0 sm:ml-3'>
              <Link
                to='/login'
                className='w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10'
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </main>
      <div className=''>
        <img className='h-full w-full lg:object-cover sm:h-full ' src='./images/landing-page.jpg' alt='' />
      </div>
    </div>
  );

  /* return (
    <div className='relative bg-white overflow-hidden min-h-[calc(100vh_-_52px)] xs:flex-col xs:justify-center flex'>
      <div className='hero bg-white flex flex-col sm:justify-start xs:justify-center'>
        <div className='hero-content flex-col-reverse lg:flex-row-reverse'>
          <img className='max-w-xl h-full w-full lg:object-cover sm:h-full ' src='./images/landing-page.jpg' alt='Main' />
          <div className='sm:px-4 '>
            <h1 className='text-4xl font-bold sm:font-extrabold'>
              <span className='block '>IronConnections the place where</span> <span className='block text-indigo-600 xl:inline'>all your connections come true</span>
            </h1>
            <p className='py-3 text-gray-500'>IronConnections helps you connect and share with those who are part of your life.</p>
            <div className='mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start'>
              <div className='rounded-md shadow'>
                <Link
                  to='/signup'
                  className='w-full flex items-center justify-center   border border-transparent  font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 py-4 text-lg px-10'
                >
                  Sign up
                </Link>
              </div>
              <div className='mt-3 sm:mt-0 sm:ml-3'>
                <Link
                  to='/login'
                  className='w-full flex items-center justify-center   border border-transparent  font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 py-4 text-lg px-10'
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  ); */
};
