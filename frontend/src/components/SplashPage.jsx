import { Button, Col, Container, Row } from "react-bootstrap";
import "../App.css";
import PropTypes from "prop-types";

export default function SplashPage({loggedIn, user}) {
  return (
    <div className="splash-background">
      <Container className="d-flex flex-column justify-content-center">
        <Row className="text-center mb-4">
          <Col>
            <h1 className="splash-title">Kiruna eXplorer</h1>
          </Col>
        </Row>
        { loggedIn && user.Role === "Urban Planner" &&<Row className="text-center">
          <Col>
            <Button href="/documents" variant="light">
              Explore Documents
            </Button>
          </Col>
        </Row>}
      </Container>
    </div>
  );
}

SplashPage.propTypes = {
  loggedIn: PropTypes.bool,
  user: PropTypes.object
}
