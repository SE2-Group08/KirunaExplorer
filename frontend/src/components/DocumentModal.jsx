import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Button, Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import ListDocumentLinks from "./ListDocumentLinks.jsx";
import dayjs from "dayjs";
import "../App.scss";
import DocumentFormComponent from "./DocumentForm.jsx";

import customParseFormat from "dayjs/plugin/customParseFormat";
import getKirunaArea from "./KirunaArea.jsx";
dayjs.extend(customParseFormat);
// import { useMap } from "react-leaflet";

export default function DocumentModal(props) {
  // Initialize Leaflet marker icon defaults
  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
  });

  const kirunaBorderCoordinates = getKirunaArea();
  const [isEditable, setIsEditable] = useState(false);
  const [isSliderOpen, setSliderOpen] = useState(false);

  const [document, setDocument] = useState({
    title: "",
    stakeholders: [],
    scale: "",
    issuanceDate: "",
    day: "",
    month: "",
    year: "",
    type: "",
    nrConnections: 0,
    language: "",
    nrPages: 0,
    geolocation: {
      latitude: "",
      longitude: "",
      municipality: "Entire municipality",
    },
    description: "",
  });
  const [errors, setErrors] = useState({});

  // Update the state when the document prop changes
  useEffect(() => {
    if (props.document) {
      setIsEditable(props.document.isEditable || false);
      setDocument({
        title: props.document.title || "",
        stakeholders: props.document.stakeholders || [],
        scale: props.document.scale || "",
        issuanceDate: props.document.issuanceDate || "",
        day: props.document.issuanceDate
          ? props.document.issuanceDate.split("-")[2] || ""
          : "",
        month: props.document.issuanceDate
          ? props.document.issuanceDate.split("-")[1] || ""
          : "",
        year: props.document.issuanceDate
          ? props.document.issuanceDate.split("-")[0] || ""
          : "",
        type: props.document.type || "",
        nrConnections: props.document.nrConnections || 0,
        language: props.document.language || "",
        nrPages: props.document.nrPages || 0,
        geolocation: {
          latitude: props.document.geolocation
            ? props.document.geolocation.latitude
            : "",
          longitude: props.document.geolocation
            ? props.document.geolocation.longitude
            : "",
          municipality: props.document.geolocation
            ? props.document.geolocation.municipality
            : "Entire municipality",
        },
        description: props.document.description || "",
      });
    }
    setErrors({});
  }, [props.document]);

  const handleLinkToClick = () => {
    props.onLinkToClick(props.document);
    props.onHide();
  };

  const handleLinksClick = () => {
    setSliderOpen(!isSliderOpen);
  };

  const handleCloseSlider = () => {
    setSliderOpen(false);
  };

  const handleSnippetClick = (snippet) => {
    props.onSnippetClick(snippet);
    setSliderOpen(false);
  };

  return (
    <Modal
      show={props.show}
      onHide={props.onHide}
      centered
      className="document-modal"
      size="lg"
    >
      <Modal.Header closeButton className="modal-header">
        <Modal.Title>
          {isEditable
            ? "Enter the values in the following fields"
            : document.title}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="modal-body">
        {isEditable ? (
          <DocumentFormComponent
            document={document}
            setDocument={setDocument}
            kirunaBorderCoordinates={kirunaBorderCoordinates}
            setShow={props.setShow}
          />
        ) : (
          <ModalBodyComponent document={document} />
        )}
      </Modal.Body>

      {!isEditable && (
        <Modal.Footer className="mt-3">
          <div className="d-flex align-items-center">
            <Button
              variant="primary"
              onClick={handleLinksClick}
              className="me-2"
            >
              Links
            </Button>
            <Button
              variant="primary"
              onClick={handleLinkToClick}
              className="me-2"
            >
              <i className="bi bi-box-arrow-up-right"></i>
            </Button>
            <Button
              title="Edit"
              variant="primary"
              onClick={() => setIsEditable(true)}
              className="me-2"
            >
              <i className="bi bi-pencil-square"></i>
            </Button>
          </div>
        </Modal.Footer>
      )}

      <ListDocumentLinks
        documentId={props.document.id}
        isOpen={isSliderOpen}
        onClose={handleCloseSlider}
        onSnippetClick={handleSnippetClick}
        document={props.document}
      />
    </Modal>
  );
}

DocumentModal.propTypes = {
  show: PropTypes.bool.isRequired,
  onHide: PropTypes.func.isRequired,
  document: PropTypes.object.isRequired,
  handleSave: PropTypes.func.isRequired,
  handleAdd: PropTypes.func.isRequired,
  setShow: PropTypes.func.isRequired,
  onLinkToClick: PropTypes.func,
  onLinksClick: PropTypes.func,
  onSnippetClick: PropTypes.func,
};

function ModalBodyComponent({ document }) {
  return (
    <div className="document-info">
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
          <span>
            {dayjs(document.issuanceDate).format(
              document.issuanceDate.length === 4
                ? "YYYY"
                : document.issuanceDate.length === 7
                ? "MM/YYYY"
                : "DD/MM/YYYY"
            )}
          </span>
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
          <span>{document.language ? `${document.language}` : "-"}</span>
        </div>
        <div className="divider"></div>
        <div className="info-item">
          <label>Pages:</label>
          <span>{document.nrPages > 0 ? `${document.nrPages}` : "-"}</span>
        </div>
        <div className="divider"></div>
        <div className="info-item">
          <label>Location:</label>
          <span>
            {document.geolocation.latitude && document.geolocation.longitude ? (
              `${document.geolocation.latitude}, ${document.geolocation.longitude}`
            ) : document.geolocation.municipality ? (
              `${document.geolocation.municipality}`
            ) : (
              <OverlayTrigger
                placement="top"
                overlay={
                  <Tooltip>
                    This document hasn&apos;t been geolocated yet. Remember to
                    add it.
                  </Tooltip>
                }
              >
                <i className="bi bi-exclamation-triangle"></i>
              </OverlayTrigger>
            )}
          </span>
        </div>
      </div>
      <div className="divider-vertical"></div>
      <div className="description-area">
        <label>Description:</label>
        <p>{document.description}</p>
      </div>
    </div>
  );
}

ModalBodyComponent.propTypes = {
  document: PropTypes.object.isRequired,
};
