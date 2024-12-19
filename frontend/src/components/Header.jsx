import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { LoginButton, LogoutButton } from "./LoginPage.jsx";
import PropTypes from "prop-types";
import { Link } from "react-router-dom"; // Import Link from react-router-dom

function Header({ loggedIn, logout, isUrbanPlanner }) {
  return (
      <Navbar className="header-navbar" bg="dark" fixed="top">
        <Container fluid className="px-3">
          <Navbar.Brand as={Link} to="/" className="align-middle">
            Kiruna Explorer
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              {loggedIn && isUrbanPlanner && (
                  <Nav.Link as={Link} to="/documents" className='align-middle'>
                    Documents
                  </Nav.Link>
              )}
              <Nav.Link as={Link} to="/map" className='align-middle'>
                Map
              </Nav.Link>
              <Nav.Link as={Link} to="/diagram" className='align-middle'>
                Diagram
              </Nav.Link>
            </Nav>
            <Nav className="ms-auto">
              {loggedIn ? (
                  <LogoutButton logout={logout} />
              ) : (
                  <LoginButton />
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
  );
}

Header.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  logout: PropTypes.func.isRequired,
  isUrbanPlanner: PropTypes.bool.isRequired
};

export default Header;