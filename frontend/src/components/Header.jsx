import { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { LoginButton, LogoutButton } from "./LoginPage.jsx";
import PropTypes from "prop-types";
import { Link, useLocation } from "react-router-dom";

function Header({ loggedIn, logout, isUrbanPlanner }) {
  const location = useLocation();
  const [expanded, setExpanded] = useState(false); // State to manage navbar expansion

  const handleSelect = () => {
    setExpanded(false); // Collapse navbar when a menu item is selected
  };

  return (
      <Navbar
          bg="dark"
          expand="lg"
          data-bs-theme="dark"
          fixed="top"
          className="header-navbar"
          expanded={expanded} // Controlled by state
      >
        <Container fluid>
          {/* Brand */}
          <Navbar.Brand
              as={Link}
              to="/"
              onClick={handleSelect} // Collapse navbar when brand is clicked
              className={`align-middle ${location.pathname === "/" ? "active" : ""} brand-bold`}
          >
            Kiruna Explorer
          </Navbar.Brand>

          {/* Toggle Button */}
          <Navbar.Toggle
              aria-controls="navbarScroll"
              onClick={() => setExpanded(!expanded)} // Toggle navbar expansion
          />

          {/* Collapsible Navbar */}
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto my-2 my-lg-0" navbarScroll>
              {loggedIn && isUrbanPlanner && (
                  <Nav.Link
                      as={Link}
                      to="/documents"
                      onClick={handleSelect} // Collapse navbar on item click
                      className={`${location.pathname === "/documents" ? "active" : ""}`}
                  >
                    Documents
                  </Nav.Link>
              )}
              <Nav.Link
                  as={Link}
                  to="/map"
                  onClick={handleSelect} // Collapse navbar on item click
                  className={`${location.pathname === "/map" ? "active" : ""}`}
              >
                Map
              </Nav.Link>
              <Nav.Link
                  as={Link}
                  to="/diagram"
                  onClick={handleSelect} // Collapse navbar on item click
                  className={`${location.pathname === "/diagram" ? "active" : ""}`}
              >
                Diagram
              </Nav.Link>
            </Nav>

            {/* Login/Logout */}
            <div className="d-flex">
              {loggedIn ? (
                  <LogoutButton logout={logout} />
              ) : (
                  <LoginButton />
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  );
}

Header.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  isUrbanPlanner: PropTypes.bool.isRequired,
};

export default Header;