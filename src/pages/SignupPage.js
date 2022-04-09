// jshint esversion:9

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { signup } from "../api";
import { Container, Row, Col, Form, Button } from "react-bootstrap";

export const SignupPage = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [errorMessage, setErrorMessage] = useState(undefined);

  const navigate = useNavigate();

  const handleSignupSubmit = async (e) => {
    e.preventDefault();

    try {
      const requestBody = { email, password, username };
      await signup(requestBody);
      navigate("/login");
    } catch (error) {
      const errorDescription = error.response.data.message;
      setErrorMessage(errorDescription);
    }
  };

  return (
    <div className="SignupPage">
      <Container className="">
        <Row>
          <Col>
            <h1 className="mt-3">Sign Up</h1>
          </Col>
        </Row>
        <Row className="flex-column  mt-3">
          <Col className="w-50  mx-auto" >
            <Form onSubmit={handleSignupSubmit}>
              <Row>
                <Col>
                  <Form.Group className="mb-3" controlId="signupEmail">
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
                  <Form.Group className="mb-3" controlId="signupPassword">
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
                  <Form.Group className="mb-3" controlId="signupUsername">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      className="text-center"
                      size="md"
                      type="text"
                      name="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col>
                  <Button className="my-3" variant="primary" type="submit">
                    Signup
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
            <p className="my-3">Already have account?</p>
            <Link  to={"/login"}> Login</Link>
          </Col>
        </Row>
      </Container>
    </div>
  );
};
