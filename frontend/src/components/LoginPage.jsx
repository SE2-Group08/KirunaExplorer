import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PropTypes from "prop-types";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Alert } from "react-bootstrap";

const LoginComponent = (props) => {

  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
   const [username, setUsername] = useState("");
   const [password, setPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const credentials = { username, password };
    console.log("LoginForm.handleSubmit", credentials);
    props.login(credentials)
      .then(() => navigate("/"))
      .catch((err) => {
        if (err.message === "Unauthorized")
          setErrorMessage("Invalid username and/or password");
        else
          setErrorMessage(err.message);
        setShow(true);
      });
  };

  return (
    <div 
    className="d-flex justify-content-center align-items-center vh-100 bg-light"
    style={{marginTop: "-50px"}}
    >
      <div className="card shadow p-4" style={{ width: "400px" }}>
        <h3 className="card-title text-center mb-4">Login</h3>
        <form onSubmit={handleSubmit}>
            <Alert
                dismissible
                show={show}
                onClose={() => setShow(false)}
                variant="danger">
                {errorMessage}
              </Alert>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              className="form-control"
              id="username"
              name="username"
              value={username}
              placeholder="Example: johnDoe"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-4">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

LoginComponent.propTypes = {
  login: PropTypes.func,
};

function LogoutButton(props) {
  return (
    <Button variant="outline-light" onClick={props.logout}>Logout</Button>
  )
}

LogoutButton.propTypes = {
  logout: PropTypes.func
}

function LoginButton() {
  const navigate = useNavigate();
  return (
    <Button variant="outline-light" onClick={() => navigate('/login')}>Login</Button>
  )
}

export { LoginComponent, LogoutButton, LoginButton };