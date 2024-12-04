import PropTypes from "prop-types";
import { Modal, Button } from "react-bootstrap";
import { getIconUrlForDocument } from "../utils/iconMapping";
import "../App.scss";

export default function LegendModal({ show, onHide }) {
return (
    <Modal show={show} onHide={onHide} centered backdrop keyboard size="lg">
        <Modal.Header closeButton>
            <Modal.Title>Legend</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <ul>
          <li>
            <img
              src={getIconUrlForDocument("Informative document", ["LKAB"])}
              alt={`Informative document icon`}
              style={{ width: "30px", height: "30px" }}
              className="me-1"
            />
            Informative document
          </li>
          <li>
            <img
              src={getIconUrlForDocument("Design document", ["LKAB"])}
              alt={`Design document icon`}
              style={{ width: "30px", height: "30px" }}
              className="me-1"
            />
            Design document
          </li>
          <li>
            <img
              src={getIconUrlForDocument("Technical document", ["LKAB"])}
              alt={`Technical document icon`}
              style={{ width: "30px", height: "30px" }}
              className="me-1"
            />
            Technical document
          </li>
          <li>
            <img
              src={getIconUrlForDocument("Prescriptive document", ["LKAB"])}
              alt={`Prescriptive document icon`}
              style={{ width: "30px", height: "30px" }}
              className="me-1"
            />
            Prescriptive document
          </li>
          <li>
            <img
              src={getIconUrlForDocument("Material effect", ["LKAB"])}
              alt={`Material effect icon`}
              style={{ width: "30px", height: "30px" }}
              className="me-1"
            />
            Material effect
          </li>
        </ul>
        <div className="divider-vertical"></div>
        <ul>
          <li>
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
          <li>
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
          <li>
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
          <li>
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
        </ul>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

LegendModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
};
