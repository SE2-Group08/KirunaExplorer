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
      areaName: "",
      area: "",
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
          area: document.geolocation?.area || [],
        },
        description: document.description || "",
      });
      if(document.geolocation?.area)
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

  }, [authToken,document, setFeedbackFromError]);

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

  function calculateCentroid(coordinates) {
    let latSum = 0, lngSum = 0, numPoints = coordinates.length;

    coordinates.forEach(([lat, lng]) => {
      latSum += lat;
      lngSum += lng;
    });

    return {
      latitude: latSum / numPoints,
      longitude: lngSum / numPoints,
    };
  }

  async function createArea(name, area) {
    if (!area.geometry || !area.geometry.coordinates || area.geometry.coordinates.length === 0) {
      throw new Error("Invalid geometry data for the area.");
    }

    // Format coordinates properly for backend expectations
    const formattedCoordinates = area.geometry.coordinates[0].map(([lng, lat]) => ({
      latitude: lat,
      longitude: lng,
    }));

    // Calculate the centroid
    const centroid = calculateCentroid(
        formattedCoordinates.map(({ latitude, longitude }) => [latitude, longitude])
    );

    // Construct the payload
    const newArea = {
      areaId: null, // Assuming null for new areas
      areaName: name,
      centroid: {
        latitude: centroid.latitude,
        longitude: centroid.longitude,
      },
      geometry: {
        type: area.geometry.type,
        coordinates: formattedCoordinates,
      },
    };


      API.createArea(newArea, authToken)
      .then(() => setShouldRefresh(true))
            .then(() =>
                setFeedback({
                  type: "success",
                  message: "Area created successfully",
                })
            )
            .catch((error) => setFeedbackFromError(error));
        onHide();
  }




  const handleSubmit = async (e) => {
    e.preventDefault();

    const combinedIssuanceDate = `${formDocument.year}${
        formDocument.month ? "-" + formDocument.month.padStart(2, "0") : ""
    }${formDocument.day ? "-" + formDocument.day.padStart(2, "0") : ""}`;

    // Validate geometry data
    if (locationMode === "area" && (!formDocument.area || !formDocument.area.geometry)) {
      setErrors({ areaName: "Please draw or select a valid area." });
      return;
    }

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

        if (locationMode === "area" && formDocument.areaName) {
          await createArea(formDocument.areaName, formDocument.area);
        }
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
      if (locationMode === "area" && formDocument.areaName) {
        await createArea(formDocument.areaName, formDocument.area);
      }
      setFilesToUpload([]);
      onHide();
    } catch (error) {
      console.error("Error during form submission:", error);
      // Do not close the form; errors will be displayed
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
            setDocument={setFormDocument}
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
                    area: null,
                    municipality: "Entire municipality"
                  });
                } else {
                  handleChange("geolocation", {
                    municipality: "",
                    // Clear coords/area if needed
                  });
                }
              }}
              selectedAreaId={selectedAreaId}
              setSelectedAreaId={setSelectedAreaId}
              selectedPointId={selectedPointId}
              setSelectedPointId={setSelectedPointId}
              areaModified={areaModified}
              setAreaModified={setAreaModified}
              authToken={authToken}
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
  setDocument,
  errors,
  handleChange,
  kirunaBorderCoordinates,
  refs,
  locationMode,
  setLocationMode,
  selectedAreaId,
  setSelectedAreaId,
  selectedPointId,
  setSelectedPointId,
  areaModified,
  setAreaModified,
  authToken
}) {
  const [allStakeholders, setAllStakeholders] = useState([]);
  const [allDocumentTypes, setAllDocumentTypes] = useState([]);
  const [allScales, setAllScales] = useState([]);
  const defaultPosition = [67.84, 20.2253]; // Default center position (Kiruna)
  const safeLatitude = document.geolocation.latitude === "" || document.geolocation.latitude == null
      ? null
      : parseFloat(document.geolocation.latitude);
  const safeLongitude = document.geolocation.longitude === "" || document.geolocation.longitude == null
      ? null
      : parseFloat(document.geolocation.longitude);

  const finalPosition = (Number.isFinite(safeLatitude) && Number.isFinite(safeLongitude))
      ? [safeLatitude, safeLongitude]
      : defaultPosition;

  const [markerPosition, setMarkerPosition] = useState(finalPosition);
  const [pointName, setPointName] = useState("");
  const [newPoint, setNewPoint] = useState(false)
  useEffect(() => {
    if (locationMode === "area") {
      // If in area mode, we do not rely on a marker, but ensure map still has a valid center.
      setMarkerPosition(defaultPosition);
      handleChange("geolocation", { latitude: "", longitude: "" });
      setPointName("")
    }
  }, [locationMode]);
  useEffect(() => {
    if (mapRef.current && document.area?.geometry) {
      const { coordinates } = document.area.geometry;
      const polygonCoords = coordinates[0].map(([lng, lat]) => [lat, lng]);
      const bounds = L.latLngBounds(polygonCoords);
      mapRef.current.fitBounds(bounds);
    }
  }, [document.area]);

  const [allKnownAreas, setAllKnownAreas] = useState([]);
  const [allKnownPoints, setAllKnownPoints] = useState([]);
  const { setFeedbackFromError } = useContext(FeedbackContext);

  useEffect(() => {
    console.log(authToken)
    API.getAllKnownAreas(authToken)
        .then(setAllKnownAreas)
        .catch(setFeedbackFromError);

    API.getAllKnownPoints()
        .then(setAllKnownPoints)
        .catch(setFeedbackFromError);
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
  function calculateCentroid(coordinates) {
    let latSum = 0, lngSum = 0, numPoints = coordinates.length;

    coordinates.forEach(([lat, lng]) => {
      latSum += lat;
      lngSum += lng;
    });

    return {
      latitude: latSum / numPoints,
      longitude: lngSum / numPoints,
    };
  }
  const onCreated = (e) => {
    setAreaModified(true);
    const layer = e.layer;
    const area = layer.toGeoJSON();

    // Aggiorna il poligono nel formDocument
    handleChange("area", area);

    // Calcola il centroide per il poligono
    const coordinates = area.geometry.coordinates[0];
    const centroid = calculateCentroid(coordinates.map(([lng, lat]) => [lat, lng]));

    handleChange("geolocation", {
      ...document.geolocation,
      latitude: centroid.latitude,
      longitude: centroid.longitude,
    });

    // Aggiungi il poligono alla mappa
    setDocument((prev) => ({
      ...prev,
      area: area
    }));
  };


  const onEdited = (e) => {
    const updatedAreas = [];
    e.layers.eachLayer((layer) => {
      const updatedArea = layer.toGeoJSON();
      updatedAreas.push(updatedArea);
    });

    handleChange("area", updatedAreas[0]); // Salva il primo poligono come area principale
  };


  const onDeleted = () => {
   /* setAreaModified(true);
    const remainingArea = document.geolocation.area.filter((area) => {
      return !e.layers.getLayers().some((layer) => {
        const layerArea = layer.toGeoJSON();
        return JSON.stringify(layerArea) === JSON.stringify(area);
      });
    });

    handleChange("geolocation", { ...document.geolocation, area: remainingArea });*/
      handleChange("area", null); // Rimuovi il poligono dall'area

  };

  function MapClickHandlerForNewPoint() {
    useMapEvents({
      click: (e) => {
        if (locationMode === "point" && e.latlng) {
          handleChange("geolocation", {
            ...document.geolocation,
            latitude: e.latlng.lat,
            longitude: e.latlng.lng,
          });
          setMarkerPosition([e.latlng.lat, e.latlng.lng]);
          setPointName(""); // Clear point name when selecting a new location
          setNewPoint(true);
          setSelectedPointId("")
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
    if (lat != null && Number.isFinite(lat) && document.geolocation.longitude != null && Number.isFinite(parseFloat(document.geolocation.longitude))) {
      setMarkerPosition([lat, parseFloat(document.geolocation.longitude)]);
    } else {
      setMarkerPosition(defaultPosition);
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
    if (Number.isFinite(lng) && document.geolocation.latitude != null && Number.isFinite(parseFloat(document.geolocation.latitude))) {
      setMarkerPosition([parseFloat(document.geolocation.latitude), lng]);
    } else {
      setMarkerPosition(defaultPosition);
    }
  };

  const handleSelectExistingArea = async (e) => {
    const areaId = e.target.value;

    try {
      const area = await API.getAreaById(areaId, authToken);

      setSelectedAreaId(areaId);

      if (area) {
        // Update the document's area field with the fetched area
        handleChange("area", area);

        // Update the geolocation to the centroid of the selected area
        handleChange("geolocation", {
          latitude: area.centroid.latitude,
          longitude: area.centroid.longitude,
        });

        // Adjust the map view to the selected area
        zoomOnArea(area);
      }
    } catch (error) {
      console.error("Error selecting area:", error);
    }
  };



  const handleSelectExistingPoint = (e) => {
    const pointId = e.target.value;
    const point = allKnownPoints.find((p) => p.id.toString() === pointId);

    setSelectedPointId(pointId);
    if (point) {
      handleChange("geolocation", {
        ...document.geolocation,
        latitude: point.latitude,
        longitude: point.longitude,
      });
      zoomOnPoint(point); // Zoom sul punto selezionato
    }
  };

  const mapRef = useRef(null);

  const zoomOnArea = (area) => {
    if (!mapRef.current || !area?.geometry?.type) return;

    const { type, coordinates } = area.geometry;

    if (type === "Polygon" || type === "MultiPolygon") {
      const latlngs = type === "Polygon"
          ? coordinates.map(([lng, lat]) => [lat, lng])
          : coordinates.flatMap(polygon => polygon.map(([lng, lat]) => [lat, lng]));

      // Fly to the bounds of the polygon(s)
      const bounds = L.latLngBounds(latlngs);
      mapRef.current.fitBounds(bounds, { padding: [20, 20] });
    } else {
      console.warn("Unsupported geometry type:", type);
    }
  };

  const zoomOnMunicipality = () => {
    if (mapRef.current && kirunaBorderCoordinates?.length) {
      const bounds = L.latLngBounds(kirunaBorderCoordinates);
      mapRef.current.flyToBounds(bounds, { padding: [50, 50], maxZoom: 10 });
    }
  };

  const zoomOnPoint = (point) => {
    if (mapRef.current && point.latitude && point.longitude) {
      mapRef.current.flyTo([point.latitude, point.longitude], 14);
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
        <Row>
          <Form.Group style={{display: "flex", alignItems: "center"}}>
            <Form.Label style={{marginRight: "10px"}}>Geolocation</Form.Label>
            <div className="divider"
                 style={{width: "1px", height: "20px", backgroundColor: "#ccc", margin: "0 10px"}}/>
            <Form.Control
                as="select"
                value={locationMode}
                onChange={(e) => {
                  setLocationMode(e.target.value)
                  if(e.target.value === "entire_municipality")
                    zoomOnMunicipality();
                }}
                style={{flex: 1}}
              >
                <option value=""> -- select --</option>
                <option value="entire_municipality">Entire municipality</option>
                <option value="area">Area</option>
                <option value="point">Coordinates</option>
              </Form.Control>
            </Form.Group>
          </Row>
          {locationMode === "point" && newPoint && !selectedPointId &&(
              <Row className="mb-2 mt-3">
                <Col md={24}>
                  <Form.Group controlId="formDocumentPointName">
                    <Form.Control
                        type="text"
                        value={pointName}
                        onChange={(e) => setPointName(e.target.value)}
                        placeholder="Enter the point name"
                    />
                    <Form.Text className="text-muted">
                      This name will help identify the point.
                    </Form.Text>
                  </Form.Group>
                </Col>
              </Row>
          )}
        </Col>
      {locationMode === "area" && (
        <Col md={3}>
          <Form.Group>
            <Form.Control as="select" value={selectedAreaId} onChange={handleSelectExistingArea}>
                    <option value="">-- Select an existing area --</option>
                    {allKnownAreas?.map((area) => (
                  <option key={area.id} value={area.id}>{area.properties?.name || `${area.name}`}</option>
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
                <div className="divider" />
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
              {locationMode === "point" && (
                  <Form.Text className="text-muted">
                    Click on the map to set the location. Latitude and Longitude fields will update automatically.
                  </Form.Text>
              )}
              <MapContainer
                  ref={mapRef}
                  center={markerPosition}
                  zoom={10}
                  style={{ height: "100%", width: "100%" }}
                  key={JSON.stringify(document.area)}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {locationMode === "point" && markerPosition && markerPosition.length === 2 && Number.isFinite(markerPosition[0]) && Number.isFinite(markerPosition[1]) && (
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
                {locationMode === "area" && (
                    <FeatureGroup>
                      <EditControl
                          position="topright"
                          onCreated={onCreated}
                          onEdited={onEdited}
                          onDeleted={onDeleted}
                          draw={{
                            rectangle: false,
                            polygon: true,
                            polyline: false,
                            circle: false,
                            circlemarker: false,
                            marker: false,
                          }}
                          edit={{ remove: true }}
                        />
                    </FeatureGroup>
                )}
                {
                  document.area?.geometry && (() => {
                    console.log(document.area.geometry)
                  const { type, coordinates } = document.area.geometry;

                  if (type === "POLYGON" || type === "Polygon") {
                    // Map polygon coordinates
                    const polygonCoords = coordinates.map(([lng, lat]) => [lat, lng]);
                    return <Polygon positions={polygonCoords} color="purple" />;
                  } else if (type === "MULTIPOLYGON") {
                    // Map multipolygon coordinates
                    const multiPolygonCoords = coordinates.map(polygon =>
                        polygon.map(([lng, lat]) => [lat, lng])
                    );
                    return multiPolygonCoords.map((coords, idx) => (
                        <Polygon key={idx} positions={coords} color="purple" />
                    ));
                  }

                  console.warn(`Unsupported geometry type: ${type}`);
                  return null;
                })()}

                {locationMode === "point" &&
                    Number.isFinite(safeLatitude) &&
                    Number.isFinite(safeLongitude) && (
                        <Marker position={[safeLatitude, safeLongitude]} />
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
  setDocument: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  kirunaBorderCoordinates: PropTypes.array.isRequired,
  refs: PropTypes.object.isRequired,
  locationMode: PropTypes.string.isRequired,
  setLocationMode: PropTypes.func.isRequired,
  selectedAreaId: PropTypes.string.isRequired,
  setSelectedAreaId: PropTypes.func.isRequired,
  selectedPointId: PropTypes.string.isRequired,
  setSelectedPointId: PropTypes.func.isRequired,
  areaModified: PropTypes.bool.isRequired,
  setAreaModified: PropTypes.func.isRequired,
  authToken: PropTypes.string.isRequired
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
