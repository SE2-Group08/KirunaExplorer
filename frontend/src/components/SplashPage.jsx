import { Container, Row, Col, Card } from "react-bootstrap";
import "../App.scss";
import BackgroundImage from "../public/KX_BckG.webp";
import { FaFileAlt, FaMapMarkedAlt/*, FaUsers*/ } from "react-icons/fa";

export default function HomePage() {
  return (
    <div>
      <div
        className="d-flex align-items-center justify-content-center text-center position-relative"
        style={{
          height: "55vh",
          backgroundImage: `url(${BackgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div
          className="overlay"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.4)",
          }}
        ></div>

        <div>
          <h1
            style={{
              fontSize: "50px",
              zIndex: 2,
              position: "relative",
              color: "white",
            }}
          >
            Welcome to Kiruna Explorer
          </h1>
          <p
            style={{
              fontSize: "25px",
              zIndex: 2,
              position: "relative",
              color: "white",
            }}
          >
            Discover, explore, and manage all the tools you need to navigate
            Kiruna&apos;s transformation.
          </p>
        </div>
      </div>

      {/* Sezione Card */}
      <Container className="py-4">
        <Row className="text-center d-flex justify-content-center">
          <Col md={4}>
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
          <Col md={4}>
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
          {/* <Col md={4}>
            <Card className="h-100">
              <Card.Body>
                <FaUsers size={40} className="mb-3" />
                <Card.Title>Community Insights</Card.Title>
                <Card.Text>
                  Collaborate with stakeholders and share insights to build a
                  sustainable future for Kiruna.
                </Card.Text>
              </Card.Body>
            </Card>
          </Col> */}
        </Row>
      </Container>
    </div>
  );
}
