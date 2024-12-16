import PropTypes from "prop-types";
import { Modal, Row, Col } from "react-bootstrap";
import { getIconUrlForDocument } from "../utils/iconMapping";
import "../App.scss";

export default function LegendModal({ diagram, show, onHide }) {
  return (
    <Modal show={show} onHide={onHide} centered backdrop keyboard size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Legend</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Col>
          <Row>
            <strong>Document types:</strong>
          </Row>
          <Row>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              <li style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={getIconUrlForDocument("Informative document", ["LKAB"])}
                  alt={`Informative document icon`}
                  style={{ width: "30px", height: "30px" }}
                  className="me-1"
                />
                Informative document
              </li>
              <li style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={getIconUrlForDocument("Design document", ["LKAB"])}
                  alt={`Design document icon`}
                  style={{ width: "30px", height: "30px" }}
                  className="me-1"
                />
                Design document
              </li>
              <li style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={getIconUrlForDocument("Technical document", ["LKAB"])}
                  alt={`Technical document icon`}
                  style={{ width: "30px", height: "30px" }}
                  className="me-1"
                />
                Technical document
              </li>
              <li style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={getIconUrlForDocument("Prescriptive document", ["LKAB"])}
                  alt={`Prescriptive document icon`}
                  style={{ width: "30px", height: "30px" }}
                  className="me-1"
                />
                Prescriptive document
              </li>
              <li style={{ display: "flex", alignItems: "center" }}>
                <img
                  src={getIconUrlForDocument("Material effect", ["LKAB"])}
                  alt={`Material effect icon`}
                  style={{ width: "30px", height: "30px" }}
                  className="me-1"
                />
                Material effect
              </li>
            </ul>
          </Row>
        </Col>
        <div className="divider-vertical"></div>
        <Col>
          <Row>
            <strong>Stakeholders:</strong>
          </Row>
          <Row>
            <ul style={{ listStyleType: "none", padding: 0 }}>
              <li style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: "#1A1B1D",
                  }}
                  className="me-1"
                ></div>
                LKAB
              </li>
              <li style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: "#7C615D",
                  }}
                  className="me-1"
                ></div>
                Municipality
              </li>
              <li style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: "#5B272E",
                  }}
                  className="me-1"
                ></div>
                Central authority
              </li>
              <li style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: "#AAA598",
                  }}
                  className="me-1"
                ></div>
                Architecture firms
              </li>
              <li style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: "#ACC9CC",
                  }}
                  className="me-1"
                ></div>
                Residents
              </li>
              <li style={{ display: "flex", alignItems: "center" }}>
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    backgroundColor: "#869B9E",
                  }}
                  className="me-1"
                ></div>
                Others
              </li>
            </ul>
          </Row>
        </Col>
        <div className="divider-vertical"></div>
        <Col>
          <Row>
            <strong>Link type:</strong>
          </Row>
          <Row>
            <ul style={{ listStyleType: "none", padding: 0 }}>
            {diagram ? (
                <>
                  <li style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: "50px",
                        borderTop: "2px solid black",
                      }}
                      className="me-1"
                    ></div>
                    Direct Consequence
                  </li>
                  <li style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: "50px",
                        borderTop: "2px dashed black",
                      }}
                      className="me-1"
                    ></div>
                    Collateral Consequence
                  </li>
                  <li style={{ display: "flex", alignItems: "center" }}>
                    <div
                      style={{
                        width: "50px",
                        borderTop: "2px dotted black",
                      }}
                      className="me-1"
                    ></div>
                    Projection
                  </li>
                  <li style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      width: "50px",
                      height: "2px",
                      backgroundImage:
                        "repeating-linear-gradient(to right, black 10px, black 15px, transparent 15px, transparent 20px, black 20px, black 21px, transparent 21px, transparent 25px)",
                    }}
                    className="me-1"
                  ></div>
                  Update 
                </li>
                </>
              ) : (
                <>
                <li style={{ display: "flex", alignItems: "center" }}>
                <strong
                  style={{
                    backgroundColor: "#e9ecef",
                    borderRadius: "4px",
                    padding: "2px 6px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                  className="me-1"
                >
                  P
                </strong>
                Prevision
              </li>
              <li style={{ display: "flex", alignItems: "center" }}>
                <strong
                  style={{
                    backgroundColor: "#e9ecef",
                    borderRadius: "4px",
                    padding: "2px 6px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                  className="me-1"
                >
                  DC
                </strong>
                Direct Consequence
              </li>
              <li style={{ display: "flex", alignItems: "center" }}>
                <strong
                  style={{
                    backgroundColor: "#e9ecef",
                    borderRadius: "4px",
                    padding: "2px 6px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                  className="me-1"
                >
                  CC
                </strong>
                Collateral Consequence
              </li>
              <li style={{ display: "flex", alignItems: "center" }}>
                <strong
                  style={{
                    backgroundColor: "#e9ecef",
                    borderRadius: "4px",
                    padding: "2px 6px",
                    fontSize: "12px",
                    fontWeight: "bold",
                  }}
                  className="me-1"
                >
                  U
                </strong>
                Update
              </li>
              </>
              )}
            </ul>
          </Row>
        </Col>
      </Modal.Body>
    </Modal>
  );
}

LegendModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};
