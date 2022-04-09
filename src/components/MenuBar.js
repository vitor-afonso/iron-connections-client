//jshint esversion:8

import { useContext } from "react";
import { AuthContext } from "../context/auth.context";
import { Navbar, Container, Nav, NavLink } from "react-bootstrap";


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
                <NavLink href="/feed"> Feed </NavLink>
                <NavLink href="/profile"> Profile </NavLink>
                <NavLink href="/notifications"> Notifications </NavLink>
                <NavLink onClick={logOutUser}>Logout</NavLink>
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
