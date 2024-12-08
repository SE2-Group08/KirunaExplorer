import { Card, Button } from "react-bootstrap";
import PropTypes from "prop-types";
import "./DocumentSidePanel.css";
import DocumentResources from "./DocumentResources.jsx";
import {useEffect, useState} from "react";
import API from "../API.mjs";

const DocumentSidePanel = ({ document, onClose }) => {
  const [resources, setResources] = useState([]);
  const [viewMode, setViewMode] = useState("list"); // Default view mode

  useEffect(() => {
    API.getDocumentFiles(document.id)
        .then(setResources)
  }, [document]);


  const handleDownload = async (id, name, extension) => {
    try {
      await API.downloadFile(id, name, extension);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
      <div className="document-side-panel active">
        <Card className="document-card-panel">
          <Card.Title className="document-card-title-panel">{document.title}</Card.Title>
          <div className="close-icon" onClick={onClose}>
            &#x2715;
          </div>
          <Card.Body>
            {/* Document Details */}
            <Card.Text>
              <strong>Stakeholders:</strong> {document.stakeholders.join(", ")}
            </Card.Text>
            <div className="divider"/>
            <Card.Text>
              <strong>Scale:</strong> {document.scale}
            </Card.Text>
            <div className="divider"/>
            <Card.Text>
              <strong>Issuance Date:</strong> {document.issuanceDate}
            </Card.Text>
            <div className="divider"/>
            <Card.Text>
              <strong>Type:</strong> {document.type}
            </Card.Text>
            <div className="divider"/>
            <Card.Text>
              <strong>Connections:</strong> {document.nrConnections || "No connections"}
            </Card.Text>
            <div className="divider"/>
            <Card.Text>
              <strong>Language:</strong> {document.language || "-"}
            </Card.Text>
            <div className="divider"/>
            <Card.Text>
              <strong>Pages:</strong> {document.nrPages > 0 ? document.nrPages : "-"}
            </Card.Text>
            <div className="divider"/>
            <Card.Text>
              <strong>Geolocation:</strong>{" "}
              <span>
              {document.geolocation.municipality
                  ? document.geolocation.municipality
                  : `${document.geolocation.latitude}, ${document.geolocation.longitude}`}
            </span>
            </Card.Text>
            <div className="divider"/>
            <Card.Text>
              <strong>Description:</strong> <br/>
              {document.description}
            </Card.Text>
            <div className="divider"/>

            <div className="d-flex justify-content-between align-items-center mb-3">
              <strong>Resources: </strong>
              <Button
                  onClick={() => setViewMode((prev) => (prev === "list" ? "grid" : "list"))}
                  title={`Switch to ${viewMode === "list" ? "grid" : "list"} view`}
              >
                <i className={`bi ${viewMode === "list" ? "bi-grid" : "bi-list-task"}`}></i>
              </Button>
            </div>

            <div className="resources-section">
              <DocumentResources
                  resources={resources}
                  onDownload={handleDownload}
                  viewMode={viewMode} // Pass the current view mode
                  isEditable={false}
              />
            </div>
          </Card.Body>
        </Card>
      </div>
);
};

DocumentSidePanel.propTypes = {
  document: PropTypes.object.isRequired,
      onClose
:
  PropTypes.func.isRequired,
};

export default DocumentSidePanel;
