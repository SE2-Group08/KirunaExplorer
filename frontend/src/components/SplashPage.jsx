import { Container, Row, Col, Card } from "react-bootstrap";
import "../App.scss";
import BackgroundImage from "../public/KX_BckG.webp";
import { FaFileAlt, FaMapMarkedAlt /*, FaUsers*/ } from "react-icons/fa";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import "./SplashPage.scss";

export default function HomePage({ loggedIn }) {
    const navigate = useNavigate();
    return (
        <div>
            <div
                className="homepage-hero d-flex align-items-center justify-content-center text-center position-relative"
                style={{
                    backgroundImage: `url(${BackgroundImage})`
                }}
            >
                <div className="homepage-hero-overlay"></div>
                <div className="homepage-hero-content">
                    <h1 className="homepage-hero-title">
                        Welcome to Kiruna Explorer
                    </h1>
                    <p className="homepage-hero-subtitle">
                        Discover, explore, and manage all the tools you need to navigate Kiruna&apos;s transformation.
                    </p>
                </div>
            </div>

<<<<<<< HEAD
            {/* Card Section */}
            <Container className="py-4">
                <Row className="text-center d-flex justify-content-center">
                    {loggedIn && (
                        <Col md={4} className="mb-3 mb-md-0">
                            <Card className="h-100 homepage-card">
                                <Card.Body>
                                    <FaFileAlt size={40} className="mb-3" />
                                    <Card.Title>Document Management</Card.Title>
                                    <Card.Text>
                                        Easily upload, manage, and access important documents related to the urban transformation of Kiruna.
                                    </Card.Text>
                                </Card.Body>
                                <a onClick={() => navigate("/documents")} className="stretched-link"></a>
                            </Card>
                        </Col>
                    )}
                    <Col md={4} className="mb-3 mb-md-0">
                        <Card className="h-100 homepage-card">
                            <Card.Body>
                                <FaMapMarkedAlt size={40} className="mb-3" />
                                <Card.Title>Map Integration</Card.Title>
                                <Card.Text>
                                    Visualize and analyze geolocated data through our interactive map tools.
                                </Card.Text>
                            </Card.Body>
                            <a onClick={() => navigate("/map")} className="stretched-link"></a>
                        </Card>
                    </Col>
                </Row>

            </Container>
        </div>
    );
=======
      {/* Sezione Card */}
      <Container className="py-4">
        <Row className="text-center d-flex justify-content-center">
          <Col md={3}>
            <Card className="h-100">
              <Card.Body>
                <FaFileAlt size={40} className="mb-3" />
                <Card.Title>Document Management</Card.Title>
                <Card.Text>
                  Easily upload, manage, and access important documents related
                  to the urban transformation of Kiruna.
                </Card.Text>
              </Card.Body>
              <a href="/documents" className="stretched-link"></a>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100">
              <Card.Body>
                <FaMapMarkedAlt size={40} className="mb-3" />
                <Card.Title>Map Integration</Card.Title>
                <Card.Text>
                  Visualize and analyze geolocated data through our interactive
                  map tools.
                </Card.Text>
              </Card.Body>
              <a href="/map" className="stretched-link"></a>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="h-100">
              <Card.Body>
                <FaMapMarkedAlt size={40} className="mb-3" />
                <Card.Title>Diagram tool</Card.Title>
                <Card.Text>
                  Generate and interact with the dynamic diagram to better
                  understand data and processes.
                </Card.Text>
              </Card.Body>
              <a href="/diagram" className="stretched-link"></a>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
>>>>>>> origin/dev
}

HomePage.propTypes = {
    loggedIn: PropTypes.bool,
};