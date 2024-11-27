import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function Header() {
  return (
    <Navbar style={{ backgroundColor: "#e7ebda" }} fixed="top">
      <Container fluid className="px-3">
        <Navbar.Brand href="/" className='align-middle'>Kiruna Explorer</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link className='align-middle' href="/documents">Documents</Nav.Link>
            <Nav.Link className='align-middle' href="/map">Map</Nav.Link>
          </Nav>
          <Nav className="ms-auto">
            <Nav.Link className='align-middle' href="/login">Login</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Header;
