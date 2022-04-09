// jshint esversion:9

import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/auth.context";
import { login } from "../api";
import { Container, Row, Col, Form, Button  } from "react-bootstrap";


export const LoginPage = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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

      navigate("/feed");

    } catch (error) {

      const errorDescription = error.response.data.message;
      setErrorMessage(errorDescription);

    }
  };

  return (
    <div className="LoginPage ">
      <Container className="flex align-items-center">
        <Row>
          <Col>
            <h1 className="mt-3">Login</h1>
          </Col>
        </Row>
        <Row className="flex-column  mt-3">
          <Col className="w-50  mx-auto" >
            <Form onSubmit={handleLoginSubmit}>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="loginEmail">
                    <Form.Label>Email address</Form.Label>
                    <Form.Control
                      className="text-center"
                      size="md"
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="loginPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      className="text-center"
                      size="md"
                      type="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Button className="my-3" variant="primary" type="submit">
                    Login
                  </Button>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
        <Row>
          <Col>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
          </Col>
        </Row>

        <Row>
          <Col>
            <p className="my-3">Don't have an account yet?</p>
            <Link  to={"/signup"}> Signup </Link>
          </Col>
        </Row>
      </Container>  

    </div>
  );
};
