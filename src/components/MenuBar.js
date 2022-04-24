//jshint esversion:8

import { useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { Link, NavLink } from 'react-router-dom';

export const MenuBar = () => {
  // Subscribe to the AuthContext to gain access to
  // the values from AuthContext.Provider `value` prop
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);

  return (
    <Navbar bg='light' expand='lg'>
      <Container>
        <Navbar.Brand href='/'>Iron-Connections</Navbar.Brand>
        <Navbar.Toggle aria-controls='basic-navbar-nav' />
        <Navbar.Collapse id='basic-navbar-nav'>
          <Nav className='ms-auto'>
            {isLoggedIn && (
              <>
                <NavLink to='/feed'>Feed</NavLink>

                {user && <NavLink to={`/profile/${user._id}`}>Profile</NavLink>}

                <NavLink to='/users'> Users </NavLink>

                <Nav.Link href='/notifications'> Notifications </Nav.Link>

                <Nav.Link onClick={logOutUser}>Logout</Nav.Link>
              </>
            )}

            {!isLoggedIn && (
              <>
                <Link to='/'>Home</Link>
                <Link to='/signup'>Sign Up</Link>
                <Link to='/login'>Login</Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
