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
  Polygon,
  FeatureGroup,
  Marker,
  useMapEvents,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
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

export default function DocumentFormComponent({ document, show, onHide, authToken }) {
  const kirunaBorderCoordinates = getKirunaArea();
  const [existingFiles, setExistingFiles] = useState([]);
  const [deletedExistingFiles, setDeletedExistingFiles] = useState([]);
  const [filesToUpload, setFilesToUpload] = useState([]);
  const [errors, setErrors] = useState({});
  const [allKnownAreas, setAllKnownAreas] = useState([]);
  const [allKnownPoints, setAllKnownPoints] = useState([]);

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
        shapes: [],
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
  const areaNameRef = useRef(null);
  const [locationMode, setLocationMode] = useState("");
  const [selectedAreaId, setSelectedAreaId] = useState("");
  const [selectedPointId, setSelectedPointId] = useState("");
  const [areaModified, setAreaModified] = useState(false);

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
          //shapes: document.geolocation?.shapes || [],
        },
        description: document.description || "",
      });
      if(document.geolocation?.shapes)
        setLocationMode("area")
      else if(document.geolocation?.municipality)
        setLocationMode("entire_municipality")
      else
        setLocationMode("point")

      API.getDocumentFiles(document.id)
        .then((files) => {
          setExistingFiles(files);
          setDeletedExistingFiles([]);
        })
        .catch((error) => setFeedbackFromError(error));

    }

    API.getAllKnownAreas()
        .then(setAllKnownAreas)
        .catch(setFeedbackFromError);

    API.getAllKnownPoints()
        .then(setAllKnownPoints)
        .catch(setFeedbackFromError);

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
    } else if (validationErrors.areaName) {
      areaNameRef.current.focus();
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
        await API.uploadFiles(docId, filesToUpload, authToken);
      } catch (error) {
        setFeedbackFromError(error);
      }
    }
  };

  const deleteFiles = async (deletedExistingFiles) => {
    if (deletedExistingFiles.length > 0) {
      try {
        await Promise.all(
          deletedExistingFiles.map((fileId) => API.deleteFile(fileId, authToken))
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

    // Validation for areaName if needed
    if ((locationMode === "area") && formDocument.geolocation.shapes.length > 0) {
      if (!formDocument.areaName || formDocument.areaName.trim() === "") {
        setErrors({ areaName: "Name for the area is required." });
        return;
      }
    }

    const sanitizedGeolocation = {
      latitude: formDocument.geolocation.latitude || null,
      longitude: formDocument.geolocation.longitude || null,
      // municipality: locationMode === "entire_municipality" ? "Entire municipality" : null,
      municipality: formDocument.geolocation.municipality || null,
      //shapes: formDocument.geolocation.shapes || [],
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
    API.updateDocument(d.id, d, authToken)
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
      const newDocResponse = await API.addDocument(d, authToken);

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
              allKnownAreas={allKnownAreas}
              allKnownPoints={allKnownPoints}
              locationMode={locationMode}
              setLocationMode={(val) => {
                setLocationMode(val);
                setSelectedAreaId("");
                setSelectedPointId("");
                setAreaModified(false);
                if (val === "entire_municipality") {
                  handleChange("geolocation", {
                    latitude: null,
                    longitude: null,
                    shapes: [],
                    municipality: "Entire municipality"
                  });
                } else {
                  handleChange("geolocation", {
                    municipality: "",
                    // Clear coords/shapes if needed
                  });
                }
              }}
              selectedAreaId={selectedAreaId}
              setSelectedAreaId={setSelectedAreaId}
              selectedPointId={selectedPointId}
              setSelectedPointId={setSelectedPointId}
              areaModified={areaModified}
              setAreaModified={setAreaModified}
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
  authToken: PropTypes.string.isRequired
};

function DocumentFormFields({
  document,
  errors,
  handleChange,
  kirunaBorderCoordinates,
  refs,
  allKnownAreas,
  allKnownPoints,
  locationMode,
  setLocationMode,
  selectedAreaId,
  setSelectedAreaId,
  selectedPointId,
  setSelectedPointId,
  areaModified,
  setAreaModified,
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
    if (locationMode === "area") {
      setMarkerPosition([]);
      handleChange("geolocation", { latitude: "", longitude: "" });
    }
  }, [locationMode]); // This ensures the effect runs only when locationMode changes


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

  const onCreated = (e) => {
    setAreaModified(true);
    const layer = e.layer;
    const shape = layer.toGeoJSON();
    shape.properties = { name: `New Shape` };

    handleChange("geolocation", {
      shapes: [shape],
    });
  };

/*  const onEdited = (e) => {
    setAreaModified(true);
    const layers = e.layers;
    const updatedShapes = [...document.geolocation.shapes];

    layers.eachLayer((layer) => {
      const shape = layer.toGeoJSON();
      updatedShapes[0] = shape;
    });

    handleChange("geolocation", { shapes: updatedShapes });
  };
*/
  const onDeleted = (e) => {
    setAreaModified(true);
    handleChange("geolocation", { shapes: [] });
  };

  function MapClickHandlerForNewPoint() {
    useMapEvents({
      click: (e) => {
        if (locationMode === "point") {
          handleChange("geolocation", {
            latitude: e.latlng.lat,
            longitude: e.latlng.lng
          });
        }
      },
    });
    return null;
  }

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

  const handleSelectExistingArea = (e) => {
    const val = e.target.value;
    setSelectedAreaId(val);
    if (val) {
      const area = allKnownAreas.find((a) => a.id.toString() === val);
      if (area) {
        handleChange("geolocation", { shapes: [area], latitude: null, longitude: null });
        setAreaModified(false);
      } else {
        handleChange("geolocation", { shapes: [], latitude: null, longitude: null });
      }
    } else {
      handleChange("geolocation", { shapes: [] });
    }
  };

  const handleSelectExistingPoint = (e) => {
    const val = e.target.value;
    setSelectedPointId(val);
    if (val) {
      const point = allKnownPoints.find((p) => p.id.toString() === val);
      if (point) {
        handleChange("geolocation", { shapes: [], latitude: point.latitude, longitude: point.longitude });
      } else {
        handleChange("geolocation", { latitude: null, longitude: null });
      }
    } else {
      handleChange("geolocation", { latitude: null, longitude: null });
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

      {/* Dropdown for location mode */}
      <Row className="mb-4">
        <Col md={3}>
          <Form.Group style={{display: "flex", alignItems: "center"}}>
            <Form.Label style={{marginRight: "10px"}}>Geolocation</Form.Label>
            <div className="divider"
                 style={{width: "1px", height: "20px", backgroundColor: "#ccc", margin: "0 10px"}}/>
              <Form.Control
                as="select"
                value={locationMode}
                onChange={(e) => setLocationMode(e.target.value)}
                style={{flex: 1}}
              >
                <option value="entire_municipality">Entire municipality</option>
                <option value="area">Area</option>
                <option value="point">Coordinates</option>
              </Form.Control>
            </Form.Group>

        </Col>
      {locationMode === "area" && (
        <Col md={3}>
          <Form.Group>
            <Form.Control as="select" value={selectedAreaId} onChange={handleSelectExistingArea}>
                    <option value="">-- Select an existing area --</option>
                    {allKnownAreas.map((area) => (
                  <option key={area.id} value={area.id}>{area.properties?.name || `Area ${area.id}`}</option>
                    ))}
            </Form.Control>
          </Form.Group>
        </Col>
        )}

        {locationMode === "point" && (
            <>
        <Col md={3}>
          <Form.Group>
            <Form.Control as="select" value={selectedPointId} onChange={handleSelectExistingPoint}>
                      <option value="">-- Select an existing point --</option>
                      {allKnownPoints.map((point) => (
                          <option key={point.id} value={point.id}>{point.name || `Point ${point.id}`}</option>
                      ))}
            </Form.Control>
          </Form.Group>
        </Col>
      </>

          )}

        {locationMode === "point" && (
          <>
            <Col md={3}>
        <Form.Group className="mb-3">
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
                  ref={refs.latitudeRef}
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
          </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group className="mb-3">
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
              ref={refs.longitudeRef}
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
            </Form.Group>
            </Col>
          </>
        )}

        </Row>


      {(locationMode === "area") && areaModified && (
            <Row className="mb-4">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Area name</Form.Label>
                  <div className="divider"/>
                  <Form.Control
                      type="text"
                      value={document.areaName || ""}
                      onChange={(e) => handleChange("areaName", e.target.value)}
                      isInvalid={!!errors.areaName}
                  />
                  <Form.Control.Feedback type="invalid">{errors.areaName}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
        )}

        {/* MAP */}
        <Row className="mb-4">
          <Col md={12}>
            <Form.Group>
            <div style={{ height: "400px", marginBottom: "15px" }}>
              {locationMode === "point" &&
                  <Form.Text className="text-muted">
                    Click on the map to set the location. Latitude and Longitude
                    fields will update automatically.
                  </Form.Text>}
              <MapContainer
                center={markerPosition}
                zoom={10}
                style={{ height: "100%", width: "100%" }}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {(locationMode === "point" && markerPosition && markerPosition.length === 2) && (
                    <Marker position={markerPosition} />
                )}
                {locationMode === "entire_municipality" && (
                  <Polygon positions={kirunaBorderCoordinates} />
                )}

                <Polygon
                    positions={kirunaBorderCoordinates}
                    color="purple"
                    weight={3}
                    fillOpacity={0}
                />
                {locationMode === "point" && <MapClickHandlerForNewPoint />}
                  {(locationMode === "area") && (
                      <FeatureGroup>
                        <EditControl
                            position="topright"
                            onCreated={onCreated}
                            onDeleted={onDeleted}
                            draw={{
                              rectangle: false,
                              polygon: true,
                              polyline: false,
                              circle: false,
                              circlemarker: false,
                              marker: false,
                            }}
                            edit={{
                              remove: true,
                            }}
                        />
                    {document.geolocation.shapes?.map((shape, idx) => {
                          if (shape.geometry.type === "Polygon") {
                            const coords = shape.geometry.coordinates[0].map(c => [c[1], c[0]]);
                            return <Polygon key={idx} positions={coords} color="purple" />;
                          }
                          return null;
                        })}
                  </FeatureGroup>
                )}

                  {(locationMode === "point") &&
                      document.geolocation.latitude != null && document.geolocation.longitude != null && (
                          <Marker position={[document.geolocation.latitude, document.geolocation.longitude]} />
                      )}


              </MapContainer>
            </div>

          </Form.Group>
        </Col>
      </Row>

      {/* DESCRIPTION */}
      <Row className={"mb-4"}>
        <Col md={12}>
          <Form.Group className="mb-3" controlId="formDocumentDescription">
            <Form.Label>Description</Form.Label>
            <div className="divider" />
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
  allKnownAreas: PropTypes.array.isRequired,
  allKnownPoints: PropTypes.array.isRequired,
  locationMode: PropTypes.string.isRequired,
  setLocationMode: PropTypes.func.isRequired,
  selectedAreaId: PropTypes.string.isRequired,
  setSelectedAreaId: PropTypes.func.isRequired,
  selectedPointId: PropTypes.string.isRequired,
  setSelectedPointId: PropTypes.func.isRequired,
  areaModified: PropTypes.bool.isRequired,
  setAreaModified: PropTypes.func.isRequired,
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
            <Form.Label>Upload resources</Form.Label>
            <div className="divider" />
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
