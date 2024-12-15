import { useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import {
  Row,
  Col,
  Button,
  OverlayTrigger,
  Tooltip,
  Modal,
} from "react-bootstrap";
import dayjs from "dayjs";
import DocumentResources from "./DocumentResources";
import ListDocumentLinks from "./ListDocumentLinks";
import FeedbackContext from "../contexts/FeedbackContext";
import DocumentFormComponent from "./DocumentForm";
import API from "../API";
// import { getIconUrlForDocument } from "../utils/iconMapping";

export default function DocumentDescriptionComponent({
  document,
  show,
  onHide,
  onLinkToClick,
  onSnippetClick,
}) {
  const [isSliderOpened, setIsSliderOpened] = useState(false);
  const [editDocument, setEditDocument] = useState(false);

  const handleListLinksClick = () => {
    setIsSliderOpened(!isSliderOpened);
  };

  const handleCloseSlider = () => {
    setIsSliderOpened(false);
  };

  const handleLinkToClick = () => {
    onLinkToClick(document);
    onHide();
  };

  const handleSnippetClick = (snippet) => {
    onSnippetClick(snippet);
    setIsSliderOpened(false);
  };

  const handleEditClick = () => {
    setEditDocument(true);
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      className="docuemnt-modal"
      size="lg"
    >
      <Modal.Header closeButton className="modal-header">
        <Modal.Title>
          {/* <img
            src={getIconUrlForDocument(document.type, document.stakeholders)}
            alt={`${document.type} icon`}
            style={{ width: "40px", height: "40px", marginRight: "10px" }}
          /> */}
          {document.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <DocumentDescriptionFields document={document} />
      </Modal.Body>
      <Modal.Footer className="mt-3">
        <div className="d-flex align-items-center">
          <Button
            title="List connections"
            variant="primary"
            onClick={handleListLinksClick}
            className="me-2"
          >
            Connections
          </Button>
          <Button
            title="Connect"
            variant="primary"
            onClick={handleLinkToClick}
            className="me-2"
          >
            <i className="bi bi-box-arrow-up-right"></i>
          </Button>
          <Button
            title="Edit"
            variant="primary"
            onClick={handleEditClick}
            className="me-2"
          >
            <i className="bi bi-pencil-square"></i>
          </Button>
        </div>
      </Modal.Footer>
      <ListDocumentLinks
        documentId={document.id}
        isOpen={isSliderOpened && !editDocument}
        onClose={handleCloseSlider}
        onSnippetClick={handleSnippetClick}
        document={document}
      />
      <DocumentFormComponent
        document={document}
        show={editDocument}
        onHide={() => {
          setEditDocument(false);
          onHide();
        }}
      />
    </Modal>
  );
}

DocumentDescriptionComponent.propTypes = {
  document: PropTypes.object.isRequired,
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  onLinkToClick: PropTypes.func.isRequired,
  onSnippetClick: PropTypes.func.isRequired,
};

function DocumentDescriptionFields({ document }) {
  const [viewMode, setViewMode] = useState("list");
  const [existingFiles, setExistingFiles] = useState([]);
  const { setFeedbackFromError } = useContext(FeedbackContext);

  useEffect(() => {
    if (document?.id) {
      API.getDocumentFiles(document.id)
        .then((files) => {
          setExistingFiles(files);
        })
        .catch((error) => setFeedbackFromError(error));
    }
  }, [document, setFeedbackFromError]);

  const handleDownload = async (id, name, extension) => {
    try {
      await API.downloadFile(id, name, extension);
    } catch (error) {
      setFeedbackFromError(error);
    }
  };

  const formatIssuanceDate = (issuanceDate) => {
    if (issuanceDate.length === 4) {
      return dayjs(issuanceDate).format("YYYY");
    } else if (issuanceDate.length === 7) {
      return dayjs(issuanceDate).format("MM/YYYY");
    } else {
      return dayjs(issuanceDate).format("DD/MM/YYYY");
    }
  };

  const formatGeolocation = (geolocation) => {
    if (geolocation.latitude && geolocation.longitude) {
      return `${geolocation.latitude}, ${geolocation.longitude}`;
    } else if (geolocation.municipality) {
      return geolocation.municipality;
    } else {
      return null;
    }
  };

  return (
    <div className="modal-body-component">
      <Row>
        <Col md={6}>
          <div className="info-section">
            <div className="info-item">
              <label>Stakeholders:</label>
              <span>
                {document.stakeholders ? document.stakeholders.join(", ") : ""}
              </span>
            </div>
            <div className="divider"></div>
            <div className="info-item">
              <label>Scale:</label>
              <span>{document.scale}</span>
            </div>
            <div className="divider"></div>
            <div className="info-item">
              <label>Issuance Date:</label>
              <span>{formatIssuanceDate(document.issuanceDate) || "-"}</span>
            </div>
            <div className="divider"></div>
            <div className="info-item">
              <label>Type:</label>
              <span>{document.type}</span>
            </div>
            <div className="divider"></div>
            <div className="info-item">
              <label>Connections:</label>
              <span>
                {document.nrConnections === 0 ? (
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip>
                        This document has no links yet. Remember to add them.
                      </Tooltip>
                    }
                  >
                    <i className="bi bi-exclamation-triangle"></i>
                  </OverlayTrigger>
                ) : (
                  document.nrConnections
                )}
              </span>
            </div>
            <div className="divider"></div>
            <div className="info-item">
              <label>Language:</label>
              <span>{document.language || "-"}</span>
            </div>
            <div className="divider"></div>

            <div className="info-item">
              <label>Pages:</label>
              <span>{document.nrPages || "-"}</span>
            </div>
            <div className="divider"></div>
            <div className="info-item">
              <label>Location:</label>
              <span>
                {document.geolocation ? (
                  formatGeolocation(document.geolocation)
                ) : (
                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip>
                        This document hasn&apos;t been geolocated yet. Remember
                        to add it.
                      </Tooltip>
                    }
                  >
                    <i className="bi bi-exclamation-triangle"></i>
                  </OverlayTrigger>
                )}
              </span>
            </div>
          </div>
        </Col>
        <Col md={6}>
          <div className="description-area">
            <label>Description:</label>
            <p>{document.description}</p>
          </div>
        </Col>
      </Row>
      <div className="divider"></div>
      <Row className="mt-4">
        <Col>
          <div className="document-resources-section">
            <div className="info-item d-flex justify-content-between align-items-center mb-3">
              <label>Original resources: </label>
              {existingFiles.length > 0 ? (
                <Button
                  onClick={() =>
                    setViewMode((prev) => (prev === "list" ? "grid" : "list"))
                  }
                  title={`Switch to ${
                    viewMode === "list" ? "grid" : "list"
                  } view`}
                >
                  <i
                    className={`bi ${
                      viewMode === "list" ? "bi-grid" : "bi-list-task"
                    }`}
                  ></i>
                </Button>
              ) : (
                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip>
                      This document has no resources yet. Modify the document to
                      add them.
                    </Tooltip>
                  }
                >
                  <i className="bi bi-exclamation-triangle"></i>
                </OverlayTrigger>
              )}
            </div>
            <DocumentResources
              resources={existingFiles}
              onDelete={() => {}} // Deleting files is not allowed in view mode
              onDownload={handleDownload}
              viewMode={viewMode}
              isEditable={false} // Editing files is not allowed in view mode
            />
          </div>
        </Col>
      </Row>
    </div>
  );
}

DocumentDescriptionFields.propTypes = {
  document: PropTypes.object.isRequired,
};
