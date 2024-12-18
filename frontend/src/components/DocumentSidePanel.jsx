import { Card } from "react-bootstrap";
import PropTypes from "prop-types";
import "./DocumentSidePanel.css";
import { DocumentDescriptionFields } from "./DocumentDescription.jsx";

const DocumentSidePanel = ({ document, onClose }) => {
  return (
    <div className="document-side-panel active">
      <Card className="document-card-panel">
        <Card.Title className="document-card-title-panel">
          {document.title}
        </Card.Title>
        <div className="close-icon" onClick={onClose}>
          &#x2715;
        </div>
        <Card.Body>
          <DocumentDescriptionFields document={document} vertical />
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
