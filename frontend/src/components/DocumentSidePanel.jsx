import { Card } from "react-bootstrap";
import PropTypes from "prop-types";
import "./DocumentSidePanel.css";

const DocumentSidePanel = ({ document, onClose }) => {
  return (
    <div className="document-side-panel active">
      <Card className="document-card-panel">
        {/* Close Button */}
          <Card.Title className="document-card-title-panel" >
            {document.title}
          </Card.Title>
        <div className="close-icon" onClick={onClose}>
        
          &#x2715;
        </div>
        <div className="divider" />
        <Card.Body>
          
          {/* Stakeholders */}
          <Card.Text>
            <strong>Stakeholders:</strong> {document.stakeholders.join(", ")}
          </Card.Text>
          <div className="divider" />
          {/* Scale */}
          <Card.Text>
            <strong>Scale:</strong> {document.scale}
          </Card.Text>
          <div className="divider" />
          {/* Issuance Date */}
          <Card.Text>
            <strong>Issuance Date:</strong> {document.issuanceDate}
          </Card.Text>
          <div className="divider" />
          {/* Type */}
          <Card.Text>
            <strong>Type:</strong> {document.type}
          </Card.Text>
          <div className="divider" />
          {/* Connections */}
          <Card.Text>
            <strong>Connections:</strong> {document.nrConnections || "No connections"}
          </Card.Text>
          <div className="divider" />
          {/* Language */}
          <Card.Text>
            <strong>Language:</strong> {document.language || "-"}
          </Card.Text>
          <div className="divider" />
          {/* Pages */}
          <Card.Text>
            <strong>Pages:</strong> {document.nrPages > 0 ? document.nrPages : "-"}
          </Card.Text>
          <div className="divider" />
          {/* Geolocation */}
          <Card.Text>
            <strong>Geolocation:</strong> <span>{document.geolocation.municipality ? document.geolocation.municipality : document.geolocation.latitude + ", " + document.geolocation.longitude } </span>
          </Card.Text>
          <div className="divider" />
          {/* Description */}
          <Card.Text className="mt-4">
            <strong>Description:</strong> <br />{document.description}
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
};

DocumentSidePanel.propTypes = {
  document: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DocumentSidePanel;
