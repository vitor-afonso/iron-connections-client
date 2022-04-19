//jshint esversion:8

import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { Navbar, Container, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
/* import { NavLink, Link } from "react-router-dom"; */

export const MenuBar = () => {
  // Subscribe to the AuthContext to gain access to
  // the values from AuthContext.Provider `value` prop
  const { isLoggedIn, user, logOutUser } = useContext(AuthContext);
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">Iron-Connections</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {isLoggedIn && (
              <>
                <Nav.Link href="/feed"> Feed </Nav.Link>
                {user && (
                  <Nav.Link href={`/profile/${user._id}`}>
                    Profile {user.username}
                  </Nav.Link>
                )}

                <Link to="/users">
                  <Nav.Link href="/users"> Users </Nav.Link>
                </Link>

                <Nav.Link href="/notifications"> Notifications </Nav.Link>
                <Nav.Link onClick={logOutUser}>Logout</Nav.Link>
              </>
            )}

            {!isLoggedIn && (
              <>
                <Nav.Link href="/">Home</Nav.Link>
                <Nav.Link href="/signup">Sign Up</Nav.Link>
                <Nav.Link href="/login">Login</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
