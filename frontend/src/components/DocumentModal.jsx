import PropTypes from "prop-types";
import { useEffect, useState, useRef } from "react";
import { Button, Modal, Form, OverlayTrigger, Tooltip } from "react-bootstrap";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Document } from "../model/Document.mjs";
import ListDocumentLinks from "./ListDocumentLinks.jsx";
import dayjs from "dayjs";
import "../App.css";

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

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {}; // Reset errors

    const combinedIssuanceDate = `${document.year}${
      document.month ? "-" + document.month.padStart(2, "0") : ""
    }${document.day ? "-" + document.day.padStart(2, "0") : ""}`;

    const sanitizedGeolocation = {
      latitude: document.geolocation.latitude || null,
      longitude: document.geolocation.longitude || null,
      municipality: document.geolocation.municipality || null,
    };

    // Title validation
    if (typeof document.title !== "string" || !document.title.trim()) {
      newErrors.title = "Title is required and must be a non-empty string.";
    } else if (document.title.length < 2) {
      newErrors.title = "Title must be at least 2 characters.";
    } else if (document.title.length > 64) {
      newErrors.title = "Title must be less than 64 characters.";
    }

    if (
      !Array.isArray(document.stakeholders) ||
      document.stakeholders.length === 0 ||
      document.stakeholders.some((s) => typeof s !== "string" || !s.trim())
    ) {
      newErrors.stakeholders =
        "At least one stakeholder is required, and all must be non-empty strings.";
    } else if (
      new Set(document.stakeholders.map((s) => s.trim().toLowerCase())).size !==
      document.stakeholders.length
    ) {
      newErrors.stakeholders = "Stakeholders must not contain duplicates.";
    }

    const scalePatterns = [
      "Text",
      "Blueprint/Material effects",
      /^[1-9]:[1-9][0-9]*$/,
    ];
    if (
      typeof document.scale !== "string" ||
      !document.scale.trim() ||
      !scalePatterns.some((pattern) =>
        typeof pattern === "string"
          ? pattern === document.scale
          : pattern.test(document.scale)
      )
    ) {
      newErrors.scale =
        "Scale is required and must match one of the defined patterns.";
    } else if (document.scale.includes(":")) {
      const [first, second] = document.scale.split(":").map(Number);
      if (first > second) {
        newErrors.scale =
          "The first number of the scale must be smaller than the second one.";
      }
    }

    // Issuance date validation
    if (
      typeof combinedIssuanceDate !== "string" ||
      !dayjs(
        combinedIssuanceDate,
        ["YYYY-MM-DD", "YYYY-MM", "YYYY"],
        true
      ).isValid()
    ) {
      newErrors.issuanceDate =
        "Issuance date is required and must be in the format DD/MM/YYYY, MM/YYYY or YYYY.";
    }

    const validTypes = [
      "Design document",
      "Material effect",
      "Technical document",
      "Prescriptive document",
      "Informative document",
    ];
    if (!validTypes.includes(document.type)) {
      newErrors.type =
        "Type is required and must be one of the predefined values.";
    }

    if (
      document.language &&
      (document.language.length < 2 || document.language.length > 64)
    ) {
      newErrors.language = "Language must be between 2 and 64 characters.";
    }

    // Number of pages validation
    if (document.nrPages && typeof document.nrPages !== "number") {
      newErrors.nrPages = "Number of pages must be an integer";
    }

    // Geolocation validation
    if (document.geolocation.latitude && document.geolocation.longitude) {
      const point = {
        lat: document.geolocation.latitude,
        lng: document.geolocation.longitude,
      };

      const kirunaBorderCoordinatesLngLat = kirunaBorderCoordinates.map(
        ([lat, lng]) => [lng, lat]
      );
      const polygon = [
        ...kirunaBorderCoordinatesLngLat,
        kirunaBorderCoordinatesLngLat[0], // Close the loop
      ];
      const [x, y] = [point.lng, point.lat]; // Ensure [lng, lat]
      let inside = false;

      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i];
        const [xj, yj] = polygon[j];

        const intersect =
          yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
      }

      if (!inside) {
        newErrors.latitude = "Geolocation must be within the Kiruna boundary.";
        newErrors.longitude = "Geolocation must be within the Kiruna boundary.";
      }
    }
    if (
      (document.geolocation.latitude || document.geolocation.longitude) &&
      document.geolocation.municipality === "Entire municipality"
    ) {
      newErrors.municipality =
        "Geolocation must be 'Entire municipality' or a valid coordinate.";
    }

    // Description validation
    if (document.description && document.description.length > 1000) {
      newErrors.description = "Description must not exceed 1000 characters.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (props.document.id === undefined) {
      props.handleAdd(
        new Document(
          null,
          document.title,
          document.stakeholders,
          document.scale,
          combinedIssuanceDate,
          document.type,
          document.nrConnections,
          document.language,
          document.nrPages,
          sanitizedGeolocation,
          document.description
        )
      );
    } else {
      props.handleSave(
        new Document(
          props.document.id,
          document.title,
          document.stakeholders,
          document.scale,
          combinedIssuanceDate,
          document.type,
          document.nrConnections,
          document.language,
          document.nrPages,
          sanitizedGeolocation,
          document.description
        )
      );
    }
    props.onHide();
  };

  const handleLinkToClick = () => {
    props.onLinkToClick(props.document);
    props.onHide();
  };
  const handleChange = (field, value) => {
    setDocument((prevDocument) => ({
      ...prevDocument,
      [field]: value,
    }));
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
            errors={errors}
            setErrors={setErrors}
            handleSubmit={handleSubmit}
            handleChange={handleChange}
            kirunaBorderCoordinates={kirunaBorderCoordinates}
          />
        ) : (
          <ModalBodyComponent document={document} />
        )}
      </Modal.Body>
      <Modal.Footer className="mt-3">
        {isEditable ? (
          <Button title="Save" variant="success" onClick={handleSubmit}>
            <i className="bi bi-check-square"></i>
          </Button>
        ) : (
          <div className="d-flex align-items-center">
            {/* <Button
              variant="primary"
              onClick={handleLinksClick}
              className="me-2"
            >
              Links
            </Button> */}
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
        )}
      </Modal.Footer>
      <ListDocumentLinks
        documentId={props.document.id}
        isOpen={isSliderOpen}
        onClose={handleCloseSlider}
        onSnippetClick={handleSnippetClick}
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

function DocumentFormComponent({
  document,
  errors,
  handleChange,
  kirunaBorderCoordinates,
}) {
  const [customScaleValue, setCustomScaleValue] = useState(
    document.scale !== "Text" && document.scale !== "Blueprint/Material effects"
      ? document.scale
      : ""
  );
  const [enableCustomScale, setEnableCustomScale] = useState(
    document.scale !== "Text" &&
      document.scale !== "Blueprint/Material effects" &&
      document.scale !== ""
  );
  const defaultPosition = [67.84, 20.2253]; // Default center position (Kiruna)
  const [markerPosition, setMarkerPosition] = useState([
    document.geolocation.latitude
      ? document.geolocation.latitude
      : defaultPosition[0],
    document.geolocation.longitude
      ? document.geolocation.longitude
      : defaultPosition[1],
  ]);

  const dayRef = useRef(null);
  const monthRef = useRef(null);
  const yearRef = useRef(null);

  const handleDayChange = (e) => {
    const value = e.target.value;
    if (value.length <= 2) {
      handleChange("day", value);
      if (value.length === 2) {
        monthRef.current.focus();
      }
    }
  };

  const handleMonthChange = (e) => {
    const value = e.target.value;
    if (value.length <= 2) {
      handleChange("month", value);
      if (value.length === 2) {
        yearRef.current.focus();
      }
    }
  };

  const handleYearChange = (e) => {
    const value = e.target.value;
    if (value.length <= 4) {
      handleChange("year", value);
    }
  };

  useEffect(() => {
    if (document.geolocation.latitude && document.geolocation.longitude) {
      setMarkerPosition([
        document.geolocation.latitude,
        document.geolocation.longitude,
      ]);
    }
  }, [document.geolocation.latitude, document.geolocation.longitude]);

  const handleMapClick = (e) => {
    const { lat, lng } = e.latlng;
    setMarkerPosition([lat, lng]);
    handleChange("geolocation", {
      latitude: lat,
      longitude: lng,
      municipality: null,
    });
  };

  const MapClickHandler = () => {
    useMapEvents({
      click: handleMapClick,
    });
    return null;
  };

  const handleLatitudeChange = (e) => {
    const value = e.target.value;
    const lat = value === "" ? null : parseFloat(value);
    handleChange("geolocation", {
      ...document.geolocation,
      latitude: lat,
      municipality: null,
    });
    if (lat != null && document.geolocation.longitude != null) {
      setMarkerPosition([lat, document.geolocation.longitude]);
    }
  };

  const handleLongitudeChange = (e) => {
    const value = e.target.value;
    const lng = value === "" ? null : parseFloat(value);
    handleChange("geolocation", {
      ...document.geolocation,
      longitude: lng,
      municipality: null,
    });
    if (document.geolocation.latitude != null && lng != null) {
      setMarkerPosition([document.geolocation.latitude, lng]);
    }
  };

  return (
    <Form style={{ width: "100%" }} className="mx-auto">
      {/* TITLE */}
      <Form.Group className="mb-3" controlId="formDocumentTitle">
        <Form.Label>Title *</Form.Label>
        <Form.Control
          type="text"
          value={document.title}
          onChange={(e) => handleChange("title", e.target.value)}
          placeholder="Example title"
          isInvalid={!!errors.title}
          required
        />
        <Form.Control.Feedback type="invalid">
          {errors.title}
        </Form.Control.Feedback>
      </Form.Group>

      <div className="divider" />

      {/* STAKEHOLDERS */}
      <Form.Group className="mb-3" controlId="formDocumentStakeholders">
        <Form.Label>Stakeholders *</Form.Label>
        {[
          "LKAB",
          "Municipality",
          "Regional authority",
          "Architecture firms",
          "Citizen",
        ].map((stakeholderOption) => (
          <Form.Check
            key={stakeholderOption}
            type="checkbox"
            label={stakeholderOption}
            checked={document.stakeholders.includes(stakeholderOption)}
            onChange={(e) => {
              const newStakeholders = e.target.checked
                ? [...document.stakeholders, stakeholderOption]
                : document.stakeholders.filter((s) => s !== stakeholderOption);
              handleChange("stakeholders", newStakeholders);
            }}
            isInvalid={!!errors.stakeholders}
          />
        ))}
        {document.stakeholders
          .filter(
            (stakeholder) =>
              ![
                "LKAB",
                "Municipality",
                "Regional authority",
                "Architecture firms",
                "Citizen",
              ].includes(stakeholder)
          )
          .map((stakeholder, index) => (
            <div key={index} className="d-flex mb-2">
              <Form.Control
                type="text"
                value={stakeholder}
                onChange={(e) => {
                  const newStakeholders = [...document.stakeholders];
                  newStakeholders[
                    document.stakeholders.findIndex((s) => s === stakeholder)
                  ] = e.target.value;
                  handleChange("stakeholders", newStakeholders);
                }}
                placeholder="Example stakeholder"
                isInvalid={!!errors.stakeholders}
                className="me-2"
              />
              <Button
                variant="danger"
                onClick={() => {
                  const newStakeholders = document.stakeholders.filter(
                    (s) => s !== stakeholder
                  );
                  handleChange("stakeholders", newStakeholders);
                }}
                title="Delete stakeholder"
              >
                <i className="bi bi-trash"></i>
              </Button>
            </div>
          ))}
        <div>
          <Button
            className="mt-2"
            title="Add new stakeholder"
            variant="primary"
            onClick={() =>
              handleChange("stakeholders", [...document.stakeholders, ""])
            }
          >
            <i className="bi bi-plus-square"></i>
          </Button>
        </div>
        <div style={{ color: "#dc3545", fontSize: "0.875rem" }}>
          {errors.stakeholders}
        </div>
      </Form.Group>

      <div className="divider" />

      {/* SCALE */}
      <Form.Group className="mb-3" controlId="formDocumentScale">
        <Form.Label>Scale *</Form.Label>
        {/* Predefined Scale Options */}
        <Form.Check
          type="radio"
          label="Text"
          name="scaleOptions"
          id="scaleText"
          value="Text"
          checked={document.scale === "Text"}
          onChange={(e) => {
            handleChange("scale", e.target.value);
            setCustomScaleValue(""); // Clear custom scale when switching to predefined scale
            setEnableCustomScale(false); // Disable custom scale inputs
          }}
          isInvalid={!!errors.scale}
        />
        <Form.Check
          type="radio"
          label="Blueprint/Material effects"
          name="scaleOptions"
          id="scaleBlueprint"
          value="Blueprint/Material effects"
          checked={document.scale === "Blueprint/Material effects"}
          onChange={(e) => {
            handleChange("scale", e.target.value);
            setCustomScaleValue(""); // Clear custom scale when switching to predefined scale
            setEnableCustomScale(false); // Disable custom scale inputs
          }}
          isInvalid={!!errors.scale}
        />
        {/* Custom Scale Option */}
        <Form.Check
          type="radio"
          name="scaleOptions"
          id="scaleCustom"
          value="Custom"
          checked={
            enableCustomScale ||
            (document.scale &&
              !["Text", "Blueprint/Material effects"].includes(document.scale))
          }
          onChange={() => {
            setEnableCustomScale(true); // Enable custom scale inputs
            handleChange("scale", customScaleValue); // Set scale to the current custom value
          }}
          isInvalid={!!errors.scale}
          label={
            <div className="d-flex align-items-center">
              <Form.Control
                type="number"
                min={1}
                value={customScaleValue.split(":")[0] || ""}
                disabled={!enableCustomScale}
                onChange={(e) =>
                  setCustomScaleValue(
                    `${e.target.value}:${customScaleValue.split(":")[1] || ""}`
                  )
                }
                onBlur={() => handleChange("scale", customScaleValue)}
                isInvalid={!!errors.scale}
                className="me-1"
                style={{ width: "80px" }}
              />
              <span>:</span>
              <Form.Control
                type="number"
                min={1}
                value={customScaleValue.split(":")[1] || ""}
                disabled={!enableCustomScale}
                onChange={(e) =>
                  setCustomScaleValue(
                    `${customScaleValue.split(":")[0] || ""}:${e.target.value}`
                  )
                }
                onBlur={() => handleChange("scale", customScaleValue)}
                isInvalid={!!errors.scale}
                className="ms-1"
                style={{ width: "100px" }}
              />
            </div>
          }
        />
        <div style={{ color: "#dc3545", fontSize: "0.875rem" }}>
          {errors.scale}
        </div>
      </Form.Group>

      <div className="divider" />

      {/* ISSUANCE DATE */}
      <Form.Group className="mb-3" controlId="formDocumentIssuanceDate">
        <Form.Label>Issuance Date *</Form.Label>
        <div className="d-flex">
          <Form.Control
            type="text"
            value={document.day}
            onChange={(e) => handleDayChange(e)}
            isInvalid={!!errors.issuanceDate}
            placeholder="DD"
            className="me-1"
            ref={dayRef}
            style={{ width: "80px" }}
          />
          <span>/</span>
          <Form.Control
            type="text"
            value={document.month}
            onChange={(e) => handleMonthChange(e)}
            isInvalid={!!errors.issuanceDate}
            placeholder="MM"
            className="mx-1"
            ref={monthRef}
            style={{ width: "80px" }}
          />
          <span>/</span>
          <Form.Control
            type="text"
            value={document.year}
            onChange={(e) => handleYearChange(e)}
            isInvalid={!!errors.issuanceDate}
            placeholder="YYYY"
            className="ms-1"
            ref={yearRef}
            style={{ width: "100px" }}
          />
        </div>
        <div style={{ color: "#dc3545", fontSize: "0.875rem" }}>
          {errors.issuanceDate}
        </div>
      </Form.Group>

      <div className="divider" />

      {/* TYPE */}

      <Form.Group className="mb-3" controlId="formDocumentType">
        <Form.Label>Type *</Form.Label>
        <Form.Control
          as="select"
          value={document.type}
          onChange={(e) => handleChange("type", e.target.value)}
          isInvalid={!!errors.type}
          required
        >
          <option value="">Select type</option>
          <option value="Design document">Design document</option>
          <option value="Material effect">Material effect</option>
          <option value="Technical document">Technical document</option>
          <option value="Prescriptive document">Prescriptive document</option>
          <option value="Informative document">Informative document</option>
        </Form.Control>
        <Form.Control.Feedback type="invalid">
          {errors.type}
        </Form.Control.Feedback>
      </Form.Group>

      <div className="divider" />

      {/* LANGUAGE */}
      <Form.Group className="mb-3" controlId="formDocumentLanguage">
        <Form.Label>Language</Form.Label>
        <Form.Control
          type="text"
          value={document.language}
          onChange={(e) => handleChange("language", e.target.value)}
          placeholder="English"
          isInvalid={!!errors.language}
        />
        <Form.Control.Feedback type="invalid">
          {errors.language}
        </Form.Control.Feedback>
      </Form.Group>

      <div className="divider" />

      {/* PAGES */}
      <Form.Group className="mb-3" controlId="formDocumentNrPages">
        <Form.Label>Pages</Form.Label>
        <Form.Control
          type="number"
          value={document.nrPages}
          min={0}
          onChange={(e) => handleChange("nrPages", Number(e.target.value))}
          isInvalid={!!errors.nrPages}
        />
        <Form.Control.Feedback type="invalid">
          {errors.nrPages}
        </Form.Control.Feedback>
      </Form.Group>

      <div className="divider" />

      {/* GEOLOCATION */}
      <Form.Group className="mb-3">
        <Form.Label>Latitude</Form.Label>
        <Form.Control
          type="number"
          min={67.3564329180828}
          max={69.05958911620179}
          step={0.00001}
          value={document.geolocation.latitude}
          onChange={handleLatitudeChange}
          id="formDocumentGeolocationLatitude"
          disabled={document.geolocation.municipality === "Entire municipality"}
          isInvalid={!!errors.latitude}
        />
        <Form.Control.Feedback type="invalid">
          {errors.latitude}
        </Form.Control.Feedback>

        <Form.Range
          min={67.3564329180828}
          max={69.05958911620179}
          step={0.00001}
          value={document.geolocation.latitude}
          onChange={handleLatitudeChange}
          disabled={document.geolocation.municipality === "Entire municipality"}
        />

        <Form.Label>Longitude</Form.Label>
        <Form.Control
          type="number"
          value={document.geolocation.longitude || ""}
          min={17.89900836116174}
          max={23.28669305841499}
          step={0.00001}
          isInvalid={!!errors.longitude}
          onChange={handleLongitudeChange}
          id="formDocumentGeolocationLongitude"
          disabled={document.geolocation.municipality === "Entire municipality"}
        />
        <Form.Control.Feedback type="invalid">
          {errors.longitude}
        </Form.Control.Feedback>
        <Form.Range
          min={17.89900836116174}
          max={23.28669305841499}
          step={0.00001}
          value={document.geolocation.longitude}
          onChange={handleLongitudeChange}
          disabled={document.geolocation.municipality === "Entire municipality"}
        />

        <div style={{ height: "300px", marginBottom: "15px" }}>
          <MapContainer
            center={markerPosition}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={markerPosition} />
            {document.geolocation.municipality === "Entire municipality" ? (
              <Polygon positions={kirunaBorderCoordinates} />
            ) : null}
            <MapClickHandler />
          </MapContainer>
        </div>
        <Form.Text className="text-muted">
          Click on the map to set the location. Latitude and Longitude fields
          will update automatically.
        </Form.Text>
        <Form.Check
          type="checkbox"
          label="Entire municipality"
          checked={document.geolocation.municipality === "Entire municipality"}
          onChange={(e) => {
            const isChecked = e.target.checked;
            setMarkerPosition(defaultPosition);
            handleChange("geolocation", {
              latitude: isChecked ? "" : document.geolocation.latitude,
              longitude: isChecked ? "" : document.geolocation.longitude,
              municipality: isChecked ? "Entire municipality" : "",
            });
          }}
          className="mt-2"
          feedback={errors.municipality}
          feedbackType="invalid"
        />
      </Form.Group>

      <div className="divider" />

      {/* DESCRIPTION */}
      <Form.Group className="mb-3" controlId="formDocumentDescription">
        <Form.Label>Description</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          value={document.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Description of the document"
          isInvalid={!!errors.description}
        />
        <Form.Control.Feedback type="invalid">
          {errors.description}
        </Form.Control.Feedback>
      </Form.Group>
    </Form>
  );
}

DocumentFormComponent.propTypes = {
  document: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  kirunaBorderCoordinates: PropTypes.array.isRequired,
};
