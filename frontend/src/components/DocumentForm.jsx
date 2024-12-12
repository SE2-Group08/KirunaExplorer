import { useState, useEffect, useRef, useContext } from "react";
import PropTypes from "prop-types";
import {
  Modal,
  Form,
  Row,
  Col,
  Button,
  Spinner,
  ListGroup,
} from "react-bootstrap";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
import API from "../API.mjs";
import FeedbackContext from "../contexts/FeedbackContext";
import DocumentResources from "./DocumentResources";
import "../App.scss";
import getKirunaArea from "./KirunaArea.jsx";
import { Document } from "../model/Document.mjs";
import { validateForm } from "../utils/formValidation.js";

export default function DocumentFormComponent({ document, show, onHide }) {
  const kirunaBorderCoordinates = getKirunaArea();
  const [existingFiles, setExistingFiles] = useState([]);
  const [deletedExistingFiles, setDeletedExistingFiles] = useState([]);
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [errors, setErrors] = useState({});
  const [formDocument, setFormDocument] = useState(
    document || {
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
    }
  );
  const { setFeedbackFromError, setShouldRefresh, setFeedback } =
    useContext(FeedbackContext);

  const titleRef = useRef(null);
  const stakeholdersRef = useRef(null);
  const scaleRef = useRef(null);
  const dayRef = useRef(null);
  const monthRef = useRef(null);
  const yearRef = useRef(null);
  const typeRef = useRef(null);
  const languageRef = useRef(null);
  const nrPagesRef = useRef(null);
  const latitudeRef = useRef(null);
  const longitudeRef = useRef(null);
  const municipalityRef = useRef(null);
  const descriptionRef = useRef(null);

  useEffect(() => {
    if (document?.id) {
      setFormDocument({
        title: document.title || "",
        stakeholders: document.stakeholders || [],
        scale: document.scale || "",
        issuanceDate: document.issuanceDate || "",
        day: document.issuanceDate
          ? document.issuanceDate.split("-")[2] || ""
          : "",
        month: document.issuanceDate
          ? document.issuanceDate.split("-")[1] || ""
          : "",
        year: document.issuanceDate
          ? document.issuanceDate.split("-")[0] || ""
          : "",
        type: document.type || "",
        nrConnections: document.nrConnections || 0,
        language: document.language || "",
        nrPages: document.nrPages || 0,
        geolocation: {
          latitude: document.geolocation ? document.geolocation.latitude : "",
          longitude: document.geolocation ? document.geolocation.longitude : "",
          municipality: document.geolocation
            ? document.geolocation.municipality
            : "Entire municipality",
        },
        description: document.description || "",
      });

      API.getDocumentFiles(document.id)
        .then((files) => {
          setExistingFiles(files);
          setDeletedExistingFiles([]);
        })
        .catch((error) => setFeedbackFromError(error));
    }
  }, [document, setFeedbackFromError]);

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

  const handleValidationErrors = (validationErrors) => {
    if (validationErrors.title) {
      titleRef.current.focus();
    } else if (validationErrors.stakeholders) {
      stakeholdersRef.current.focus();
    } else if (validationErrors.scale) {
      scaleRef.current.focus();
    } else if (validationErrors.type) {
      typeRef.current.focus();
    } else if (validationErrors.issuanceDate) {
      dayRef.current.focus();
      monthRef.current.focus();
      yearRef.current.focus();
    } else if (validationErrors.language) {
      languageRef.current.focus();
    } else if (validationErrors.nrPages) {
      nrPagesRef.current.focus();
    } else if (validationErrors.latitude) {
      latitudeRef.current.focus();
    } else if (validationErrors.longitude) {
      longitudeRef.current.focus();
    } else if (validationErrors.municipality) {
      municipalityRef.current.focus();
    } else if (validationErrors.description) {
      descriptionRef.current.focus();
    }
  };

  const createDocument = async (
    formDocument,
    combinedIssuanceDate,
    sanitizedGeolocation
  ) => {
    const newDocId = await handleAdd(
      new Document(
        undefined,
        formDocument.title,
        formDocument.stakeholders,
        formDocument.scale,
        combinedIssuanceDate,
        formDocument.type,
        formDocument.nrConnections,
        formDocument.language,
        formDocument.nrPages,
        sanitizedGeolocation,
        formDocument.description
      )
    );
    return newDocId;
  };

  const updateDocument = async (
    document,
    formDocument,
    combinedIssuanceDate,
    sanitizedGeolocation
  ) => {
    await handleSave(
      new Document(
        document.id,
        formDocument.title,
        formDocument.stakeholders,
        formDocument.scale,
        combinedIssuanceDate,
        formDocument.type,
        formDocument.nrConnections,
        formDocument.language,
        formDocument.nrPages,
        sanitizedGeolocation,
        formDocument.description
      )
    );
  };

  const uploadFiles = async (docId, filesToUpload) => {
    if (filesToUpload.length > 0) {
      try {
        await API.uploadFiles(docId, filesToUpload);
      } catch (error) {
        setFeedbackFromError(error);
      }
    }
  };

  const deleteFiles = async (deletedExistingFiles) => {
    if (deletedExistingFiles.length > 0) {
      try {
        await Promise.all(
          deletedExistingFiles.map((fileId) => API.deleteFile(fileId))
        );
      } catch (error) {
        setFeedbackFromError(error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const combinedIssuanceDate = `${formDocument.year}${
      formDocument.month ? "-" + formDocument.month.padStart(2, "0") : ""
    }${formDocument.day ? "-" + formDocument.day.padStart(2, "0") : ""}`;

    const sanitizedGeolocation = {
      latitude: formDocument.geolocation.latitude || null,
      longitude: formDocument.geolocation.longitude || null,
      municipality: formDocument.geolocation.municipality || null,
    };

    const validationErrors = validateForm(
      formDocument,
      combinedIssuanceDate,
      kirunaBorderCoordinates
    );
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      handleValidationErrors(validationErrors);
      return;
    }

    try {
      if (!document) {
        const newDocId = await createDocument(
          formDocument,
          combinedIssuanceDate,
          sanitizedGeolocation
        );
        await uploadFiles(newDocId, filesToUpload);
      } else {
        await updateDocument(
          document,
          formDocument,
          combinedIssuanceDate,
          sanitizedGeolocation
        );
        await uploadFiles(document.id, filesToUpload);
        await deleteFiles(deletedExistingFiles);
      }
      setFilesToUpload([]);
      onHide();
    } catch (error) {
      setFeedbackFromError(error);
    }
  };

  const handleDeleteExistingFile = (fileId) => {
    setDeletedExistingFiles((prev) => {
      const updatedList = [...prev, fileId];
      return updatedList;
    });
    setExistingFiles((prevFiles) => {
      const updatedFiles = prevFiles.filter((file) => file.id !== fileId);
      return updatedFiles;
    });
  };

  const updateFilesToUpload = (newFiles) => {
    setFilesToUpload(newFiles);
  };

  const handleChange = (field, value) => {
    setFormDocument((prevDocument) => ({
      ...prevDocument,
      [field]: value,
    }));
  };

  const handleSave = async (d) => {
    API.updateDocument(d.id, d)
      .then(() => setShouldRefresh(true))
      .then(() =>
        setFeedback({
          type: "success",
          message: "Document updated successfully",
        })
      )
      .catch((error) => setFeedbackFromError(error));
    onHide();
  };

  const handleAdd = async (d) => {
    try {
      // Aggiungi il documento e ottieni la risposta
      const newDocResponse = await API.addDocument(d);

      // Aggiorna lo stato e fornisci feedback
      setShouldRefresh(true);
      setFeedback({ type: "success", message: "Document added successfully" });
      onHide();

      return newDocResponse;
    } catch (error) {
      // Gestione errori
      setFeedbackFromError(error);
      throw error; // Propaga l'errore se necessario
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      className="document-modal"
      size="xl"
    >
      <Modal.Header closeButton className="modal-header">
        <Modal.Title>Enter the values in the following fields</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form style={{ width: "100%" }} className="mx-auto">
          <DocumentFormFields
            document={formDocument}
            errors={errors}
            handleChange={handleChange}
            kirunaBorderCoordinates={kirunaBorderCoordinates}
            refs={{
              titleRef,
              stakeholdersRef,
              typeRef,
              dayRef,
              monthRef,
              yearRef,
              languageRef,
              nrPagesRef,
              latitudeRef,
              longitudeRef,
              municipalityRef,
              descriptionRef,
            }}
          />
          <UploadFilesComponent
            updateFilesToUpload={updateFilesToUpload}
            existingFiles={existingFiles}
            handleDeleteExistingFile={handleDeleteExistingFile}
          />
          <div className="d-flex justify-content-end">
            <Button
              className="mt-4"
              title="submit"
              variant="success"
              onClick={handleSubmit}
            >
              <i className="bi bi-check2"></i>
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

DocumentFormComponent.propTypes = {
  document: PropTypes.object,
  onHide: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
};

function DocumentFormFields({
  document,
  errors,
  handleChange,
  kirunaBorderCoordinates,
  refs,
}) {
  const [allStakeholders, setAllStakeholders] = useState([]);
  const [allDocumentTypes, setAllDocumentTypes] = useState([]);
  const [allScales, setAllScales] = useState([]);
  const defaultPosition = [67.84, 20.2253]; // Default center position (Kiruna)
  const [markerPosition, setMarkerPosition] = useState([
    document.geolocation.latitude
      ? document.geolocation.latitude
      : defaultPosition[0],
    document.geolocation.longitude
      ? document.geolocation.longitude
      : defaultPosition[1],
  ]);

  const { setFeedbackFromError } = useContext(FeedbackContext);

  useEffect(() => {
    // Fetch all stakeholders
    API.getAllStakeholders()
      .then((stakeholders) => {
        setAllStakeholders(stakeholders);
      })
      .catch((e) => setFeedbackFromError(e));

    // Fetch all document types
    API.getAllDocumentTypes()
      .then((documentTypes) => {
        setAllDocumentTypes(documentTypes);
      })
      .catch((e) => setFeedbackFromError(e));

    // Fetch all scales
    API.getAllScales()
      .then((scales) => {
        setAllScales(scales);
      })
      .catch((e) => setFeedbackFromError(e));
    // Set marker position if geolocation is available
    if (document.geolocation.latitude && document.geolocation.longitude) {
      setMarkerPosition([
        document.geolocation.latitude,
        document.geolocation.longitude,
      ]);
    }
  }, [
    document.geolocation.latitude,
    document.geolocation.longitude,
    setFeedbackFromError,
  ]);

  const handleDayChange = (e) => {
    const value = e.target.value;
    if (value.length <= 2) {
      handleChange("day", value);
      if (value.length === 2) {
        refs.monthRef.current.focus();
      }
    }
  };

  const handleMonthChange = (e) => {
    const value = e.target.value;
    if (value.length <= 2) {
      handleChange("month", value);
      if (value.length === 2) {
        refs.yearRef.current.focus();
      }
    }
  };

  const handleYearChange = (e) => {
    const value = e.target.value;
    if (value.length <= 4) {
      handleChange("year", value);
    }
  };

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
    <>
      {/* TITLE*/}
      <Row className="mb-4">
        <Col md={12}>
          <Form.Group controlId="formDocumentTitle">
            <Form.Label>Title *</Form.Label>
            <div className="divider" />
            <Form.Control
              type="text"
              value={document.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Example title"
              isInvalid={!!errors.title}
              required
              ref={refs.titleRef}
            />
            <Form.Control.Feedback type="invalid">
              {errors.title}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      {/* STAKEHOLDERS */}
      <Row className="mb-4">
        <Col md={6}>
          <Form.Group controlId="formDocumentStakeholders">
            <Form.Label>Stakeholders *</Form.Label>
            <div className="divider" />
            {allStakeholders ? (
              allStakeholders.map((stakeholderOption) => (
                <Form.Check
                  key={stakeholderOption.id}
                  type="checkbox"
                  label={stakeholderOption.name}
                  checked={document.stakeholders.includes(
                    stakeholderOption.name
                  )}
                  onChange={(e) => {
                    const newStakeholders = e.target.checked
                      ? [...document.stakeholders, stakeholderOption.name]
                      : document.stakeholders.filter(
                          (s) => s !== stakeholderOption.name
                        );
                    handleChange("stakeholders", newStakeholders);
                  }}
                  isInvalid={!!errors.stakeholders}
                  ref={refs.stakeholdersRef}
                />
              ))
            ) : (
              <Spinner animation="border" role="status" className="mx-auto" />
            )}
            {document.stakeholders
              .filter(
                (stakeholder) =>
                  !allStakeholders.map((s) => s.name).includes(stakeholder)
              )
              .map((stakeholder) => (
                <div key={stakeholder.id} className="d-flex mb-2">
                  <Form.Control
                    type="text"
                    value={stakeholder}
                    onChange={(e) => {
                      const newStakeholders = [...document.stakeholders];
                      newStakeholders[
                        document.stakeholders.findIndex(
                          (s) => s === stakeholder
                        )
                      ] = e.target.value;
                      handleChange("stakeholders", newStakeholders);
                    }}
                    placeholder="Example stakeholder"
                    isInvalid={!!errors.stakeholders}
                    className="me-2"
                    ref={refs.stakeholdersRef}
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
        </Col>
        {/* SCALE */}
        <Col md={6}>
          <Form.Group className="mb-3" controlId="formDocumentScale">
            <Form.Label>Scale *</Form.Label>
            <div className="divider" />
            {allScales ? (
              <Form.Control
                as="select"
                value={document.scale}
                onChange={(e) => handleChange("scale", e.target.value)}
                isInvalid={!!errors.scale}
                required
                ref={refs.scaleRef}
              >
                <option value="">Select scale</option>
                {allScales.map((scaleOption) => (
                  <option key={scaleOption.id} value={scaleOption.name}>
                    {scaleOption.name}
                  </option>
                ))}
                <option value="Other">Other</option>
              </Form.Control>
            ) : (
              <Spinner animation="border" role="status" className="mx-auto" />
            )}
            {document.scale === "Other" && (
              <div className="d-flex mt-2">
                <Form.Control
                  type="text"
                  placeholder="Enter custom scale"
                  value={document.customScale || ""}
                  onChange={(e) => handleChange("customScale", e.target.value)}
                  isInvalid={!!errors.scale}
                  className="me-2"
                />
                <Button
                  variant="primary"
                  onClick={() => {
                    if (
                      document.customScale &&
                      !allScales.some((s) => s.name === document.customScale)
                    ) {
                      allScales.push({
                        id: Date.now(),
                        name: document.customScale,
                      });
                      handleChange("scale", document.customScale);
                    }
                  }}
                  title="Add custom scale"
                >
                  <i className="bi bi-plus-square"></i>
                </Button>
              </div>
            )}
            <Form.Control.Feedback type="invalid">
              {errors.scale}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row className={"mb-4"}>
        <Col md={6}>
          {/* ISSUANCE DATE */}
          <Form.Group className="mb-3" controlId="formDocumentIssuanceDate">
            <Form.Label>Issuance Date *</Form.Label>
            <div className="divider" />
            <div className="d-flex">
              <Form.Control
                type="text"
                value={document.day}
                onChange={(e) => handleDayChange(e)}
                isInvalid={!!errors.issuanceDate}
                placeholder="DD"
                className="me-1"
                ref={refs.dayRef}
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
                ref={refs.monthRef}
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
                ref={refs.yearRef}
                style={{ width: "100px" }}
              />
            </div>
            <div style={{ color: "#dc3545", fontSize: "0.875rem" }}>
              {errors.issuanceDate}
            </div>
          </Form.Group>
        </Col>

        <Col md={6}>
          {/* TYPE */}
          <Form.Group className="mb-3" controlId="formDocumentType">
            <Form.Label>Type *</Form.Label>
            <div className="divider" />
            {allDocumentTypes ? (
              <Form.Control
                as="select"
                value={document.type}
                onChange={(e) => handleChange("type", e.target.value)}
                isInvalid={!!errors.type}
                required
                ref={refs.typeRef}
              >
                <option value="">Select type</option>
                {allDocumentTypes.map((typeOption) => (
                  <option key={typeOption.id} value={typeOption.name}>
                    {typeOption.name}
                  </option>
                ))}
                <option value="Other">Other</option>
              </Form.Control>
            ) : (
              <Spinner animation="border" role="status" className="mx-auto" />
            )}
            {document.type === "Other" && (
              <div className="d-flex mt-2">
                <Form.Control
                  type="text"
                  placeholder="Enter custom type"
                  value={document.customType || ""}
                  onChange={(e) => handleChange("customType", e.target.value)}
                  isInvalid={!!errors.type}
                  className="me-2"
                />
                <Button
                  variant="primary"
                  onClick={() => {
                    if (
                      document.customType &&
                      !allDocumentTypes.some(
                        (t) => t.name === document.customType
                      )
                    ) {
                      allDocumentTypes.push({
                        id: Date.now(),
                        name: document.customType,
                      });
                      handleChange("type", document.customType);
                    }
                  }}
                  title="Add custom type"
                >
                  <i className="bi bi-plus-square"></i>
                </Button>
              </div>
            )}
          </Form.Group>
          <div style={{ color: "#dc3545", fontSize: "0.875rem" }}>
            {errors.type}
          </div>
        </Col>
      </Row>

      {/* LANGUAGE */}
      <Row className={"mb-4"}>
        <Col md={6}>
          <Form.Group className="mb-3" controlId="formDocumentLanguage">
            <Form.Label>Language</Form.Label>
            <div className="divider" />
            <Form.Control
              type="text"
              value={document.language}
              onChange={(e) => handleChange("language", e.target.value)}
              placeholder="English"
              isInvalid={!!errors.language}
              ref={refs.languageRef}
            />
            <Form.Control.Feedback type="invalid">
              {errors.language}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
        <Col md={6}>
          {/* PAGES */}
          <Form.Group className="mb-3" controlId="formDocumentNrPages">
            <Form.Label>Pages</Form.Label>
            <div className="divider" />
            <Form.Control
              type="number"
              value={document.nrPages}
              min={0}
              onChange={(e) => handleChange("nrPages", Number(e.target.value))}
              isInvalid={!!errors.nrPages}
              ref={refs.nrPagesRef}
            />
            <Form.Control.Feedback type="invalid">
              {errors.nrPages}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row className={"mb-4"}>
        <Form.Group className="mb-3">
          <Col md={12}>
            <Form.Label>Latitude</Form.Label>
            <div className="divider" />
            <Form.Control
              type="number"
              min={67.3564329180828}
              max={69.05958911620179}
              step={0.00001}
              value={document.geolocation.latitude}
              onChange={handleLatitudeChange}
              id="formDocumentGeolocationLatitude"
              disabled={
                document.geolocation.municipality === "Entire municipality"
              }
              isInvalid={!!errors.latitude}
              refs={refs.latitudeRef}
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
              disabled={
                document.geolocation.municipality === "Entire municipality"
              }
            />
          </Col>
          <Col md={12}>
            <Form.Label>Longitude</Form.Label>
            <div className="divider" />
            <Form.Control
              type="number"
              value={document.geolocation.longitude || ""}
              min={17.89900836116174}
              max={23.28669305841499}
              step={0.00001}
              isInvalid={!!errors.longitude}
              onChange={handleLongitudeChange}
              id="formDocumentGeolocationLongitude"
              disabled={
                document.geolocation.municipality === "Entire municipality"
              }
              refs={refs.longitudeRef}
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
              disabled={
                document.geolocation.municipality === "Entire municipality"
              }
            />
          </Col>
          <Col md={12}>
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
              Click on the map to set the location. Latitude and Longitude
              fields will update automatically.
            </Form.Text>
            <Form.Check
              type="checkbox"
              label="Entire municipality"
              checked={
                document.geolocation.municipality === "Entire municipality"
              }
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
              ref={refs.municipalityRef}
            />
          </Col>
        </Form.Group>
      </Row>

      {/* DESCRIPTION */}
      <Row className={"mb-4"}>
        <Col md={12}>
          <Form.Group className="mb-3" controlId="formDocumentDescription">
            <Form.Label>Description</Form.Label>
            <div className="form-divider" />
            <Form.Control
              as="textarea"
              rows={3}
              value={document.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Description of the document"
              isInvalid={!!errors.description}
              ref={refs.descriptionRef}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
    </>
  );
}

DocumentFormFields.propTypes = {
  document: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  kirunaBorderCoordinates: PropTypes.array.isRequired,
  refs: PropTypes.object.isRequired,
};

function UploadFilesComponent({
  updateFilesToUpload,
  existingFiles,
  handleDeleteExistingFile,
}) {
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState({});
  const fileInputRef = useRef(null);
  const { setFeedbackFromError } = useContext(FeedbackContext);

  useEffect(() => {
    // Cleanup function to revoke object URLs
    return () => {
      Object.values(filePreviews).forEach((url) => URL.revokeObjectURL(url));
    };
  }, [filePreviews]);

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const MAX_FILE_SIZE = 25 * 1024 * 1024; // 25 MB
    const newFilePreviews = {};
    const oversizedFiles = [];

    newFiles.forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        oversizedFiles.push(file.name);
      } else {
        const url = URL.createObjectURL(file);
        newFilePreviews[file.name] = url;
      }
    });

    if (oversizedFiles.length > 0) {
      setFeedbackFromError(
        new Error(
          `The following files are too large (max 25 MB): ${oversizedFiles.join(
            ", "
          )}`
        )
      );
      return;
    }

    const validFiles = newFiles.filter((file) => file.size <= MAX_FILE_SIZE);

    setFiles((prevFiles) => [...prevFiles, ...validFiles]);
    setFilePreviews((prevPreviews) => ({
      ...prevPreviews,
      ...newFilePreviews,
    }));
    updateFilesToUpload([...files, ...validFiles]);
  };

  const handleDeleteNewFile = (index) => {
    setFiles((prevFiles) => {
      const newFiles = [...prevFiles];
      const [removedFile] = newFiles.splice(index, 1);
      // Revoke object URL to avoid memory leaks
      URL.revokeObjectURL(filePreviews[removedFile.name]);
      return newFiles;
    });
    setFilePreviews((prevPreviews) => {
      const newPreviews = { ...prevPreviews };
      delete newPreviews[files[index].name];
      return newPreviews;
    });
    updateFilesToUpload((prevFilesToUpload) => {
      const newFilesToUpload = [...prevFilesToUpload];
      newFilesToUpload.splice(index, 1);
      return newFilesToUpload;
    });
  };
  return (
    <>
      {/* UPLOAD */}
      <Row className="mb-4">
        <Col md={12}>
          <Form.Group controlId="formDocumentFiles">
            <Form.Label>Upload files</Form.Label>
            <div className="form-divider" />
            <div className="d-flex align-items-center">
              <Form.Control
                type="file"
                multiple
                onChange={handleFileChange}
                className="d-none"
                ref={fileInputRef}
              />
              <Button
                variant="primary"
                onClick={() => fileInputRef.current.click()}
                className="me-3"
              >
                <i className="bi bi-upload"></i>
              </Button>
              <Form.Text className="text-muted">
                {files.length} new file{files.length !== 1 && "s"} uploaded
              </Form.Text>
            </div>

            {/* Display Selected Files */}
            {files.length > 0 && (
              <div className="mt-3">
                <h6>Selected files:</h6>
                <ListGroup variant="flush">
                  {files.map((file, index) => (
                    <ListGroup.Item
                      key={index}
                      className="d-flex justify-content-between align-items-center"
                    >
                      {file.name}
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteNewFile(index)}
                        title="Remove file"
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              </div>
            )}

            {existingFiles && existingFiles.length > 0 && (
              <div className="mt-3">
                <h6>Existing files:</h6>
                <DocumentResources
                  resources={existingFiles}
                  onDelete={handleDeleteExistingFile}
                  viewMode={"list"}
                  isEditable={true}
                />
              </div>
            )}
          </Form.Group>
        </Col>
      </Row>
    </>
  );
}

UploadFilesComponent.propTypes = {
  updateFilesToUpload: PropTypes.func.isRequired,
  existingFiles: PropTypes.array.isRequired,
  handleDeleteExistingFile: PropTypes.func.isRequired,
};
