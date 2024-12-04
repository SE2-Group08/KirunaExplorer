import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import {LoginButton, LogoutButton} from "./LoginPage.jsx";
import PropTypes from "prop-types";

function Header({loggedIn, logout}) {
  return (
    <Navbar style={{ backgroundColor: "#e7ebda" }} fixed="top">
      <Container fluid className="px-3">
        <Navbar.Brand href="/" className='align-middle'>Kiruna Explorer</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {loggedIn && user.role === "Urban Planner" && <Nav.Link className='align-middle' href="/documents">Documents</Nav.Link> }
            <Nav.Link className='align-middle' href="/map">Map</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            {loggedIn ? (
                <LogoutButton logout={logout} />
            ) : (
                <LoginButton  />
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
  user: PropTypes.object
}

export default Header;
