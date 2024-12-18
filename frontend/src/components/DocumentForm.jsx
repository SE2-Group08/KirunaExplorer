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
  InputGroup,
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
  const [locationMode, setLocationMode] = useState("");
  const [selectedAreaId, setSelectedAreaId] = useState("");
  const [selectedPointId, setSelectedPointId] = useState("");
  const [areaModified, setAreaModified] = useState(false);

  const [formDocument, setFormDocument] = useState(
    document || {
      title: "",
      stakeholders: [],
      scale: "",
      customScale: "",
      issuanceDate: "",
      day: "",
      month: "",
      year: "",
      type: "",
      nrConnections: 0,
      language: "",
      nrPages: 0,
      geolocation: {
        area: null,
        pointCoordinates: null,
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

  useEffect(() => {
    if (document?.id) {
      setFormDocument({
        title: document.title || "",
        stakeholders: document.stakeholders || [],
        scale: document.scale || "",
        customScale: "",
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
          area: document.geolocation?.area || null,
          pointCoordinates: document.geolocation?.pointCoordinates || null,
        },
        description: document.description || "",
      });
      if (document.geolocation?.area) {
        console.log(document.geolocation)
        if (document.geolocation.area.areaName === "Entire Municipality") {
          setLocationMode("entire_municipality");
        } else {
          setLocationMode("area");
        }
      } else {
        setLocationMode("point")
      }

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

  function formatMultiPolygonCoordinates(multiPolygon) {
    return multiPolygon.map(polygon =>
        polygon[0].map(([lat, lng]) => ({
          latitude: lat,
          longitude: lng,
        }))
    );
  }

  async function createArea(name, area) {
    let formattedCoordinates = [];
    let centroid = {};
    if(locationMode === "entire_municipality"){
      formattedCoordinates = formatMultiPolygonCoordinates(area.geometry.coordinates);
    } else {
      formattedCoordinates = area.geometry.coordinates[0].map(([lat, lng]) => ({
        latitude: lat,
        longitude: lng,
      }));

      centroid = calculateCentroid(
          formattedCoordinates.map(({ latitude, longitude }) => [latitude, longitude])
      );
    }


    const newArea = {
      area: {
        areaId: null,
        areaName: name,
        areaCentroid: area.areaCentroid ? area.areaCentroid : centroid ,
      },
      geometry: {
        type: area.geometry.type ? area.geometry.type :"Polygon",
        coordinates: formattedCoordinates,
      },
    };

    try {
      const areaId = await API.addGeolocatedArea(newArea, authToken);
      setFeedback({ type: "success", message: "Area created successfully" });
      return areaId;
    } catch (error) {
      setFeedbackFromError(error);
      throw error;
    }
  }


  async function createPoint(pointName, coordinates) {
    const newPoint = {
     pointCoordinates: {
       pointId: null,
       pointName: pointName,
       coordinates: {
         latitude: coordinates.latitude,
         longitude: coordinates.longitude,
       },
     }
    };

    try {
      const pointId = await API.addGeolocatedPoint(newPoint, authToken);
      setShouldRefresh(true);
      setFeedback({ type: "success", message: "Point added successfully" });
      return pointId;
    } catch (error) {
      setFeedbackFromError(error);
      throw error;
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    const combinedIssuanceDate = `${formDocument.year}${
        formDocument.month ? "-" + formDocument.month.padStart(2, "0") : ""
    }${formDocument.day ? "-" + formDocument.day.padStart(2, "0") : ""}`;

    if (locationMode === "area" && !selectedAreaId && formDocument.geolocation.area.areaName.trim()==="") {
      setErrors({ areaName: "Please provide a name for the area." });
      return;
    }


    let updatedGeolocation = { ...formDocument.geolocation };
    try {
      if (locationMode === "area") {
        if (selectedAreaId) {
          updatedGeolocation = {
            area: { areaId: selectedAreaId },
            pointCoordinates: null,
          };
        } else if (formDocument.geolocation.area?.areaName) {
          const newAreaId = await createArea(formDocument.geolocation.area.areaName, formDocument.geolocation.area)
          updatedGeolocation = {
            pointCoordinates: null,
            area: {
              areaId: newAreaId
            }
          };
        }
      } else if (locationMode === "point") {
        if (formDocument.geolocation.pointCoordinates?.pointId) {
          updatedGeolocation = {
            pointCoordinates: {
              pointId: formDocument.geolocation.pointCoordinates.pointId,
            },
            area: null,
          };
        } else {
          const sanitizedPointName =
              formDocument.geolocation.pointCoordinates.pointName?.trim() === ""
                  ? null
                  : formDocument.geolocation.pointCoordinates.pointName;

          const newPointId = await createPoint(
              sanitizedPointName,
              formDocument.geolocation.pointCoordinates.coordinates
          );

          updatedGeolocation = {
            pointCoordinates: {
              pointId: newPointId,
            },
            area: null,
          };
        }
      } else if(locationMode==="entire_municipality"){
        if (selectedAreaId) {
          updatedGeolocation = {
            area: {
              areaId: selectedAreaId
            },
            pointCoordinates: null,
          };
        } else {
          const newAreaId = await createArea(formDocument.geolocation.area.areaName, formDocument.geolocation.area)
          updatedGeolocation = {
            pointCoordinates: null,
            area: {
              areaId: newAreaId
            }
          };
        }
      }

      // Prepara la geolocation finale
      const sanitizedGeolocation = {
        area: (locationMode === "area" || locationMode === "entire_municipality" ) ? updatedGeolocation.area : null,
        pointCoordinates:
            locationMode === "point" ? updatedGeolocation.pointCoordinates : null,
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
                    pointCoordinates: null,
                    area: {
                      areaName: "Entire municipality"
                    },
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
  const [scaleOptions, setScaleOptions] = useState([]);
  const [languageOptions, setLanguageOptions] = useState([
    "Swedish",
    "English",
  ]);
  const defaultPosition = [67.84, 20.2253]; // Default center position (Kiruna)
  const safeLatitude = document?.geolocation?.pointCoordinates?.coordinates?.latitude === "" || document?.geolocation?.pointCoordinates?.coordinates?.latitude == null
      ? null
      : parseFloat(document.geolocation.pointCoordinates.coordinates.latitude);
  const safeLongitude = document?.geolocation?.pointCoordinates?.coordinates?.longitude === "" || document?.geolocation?.pointCoordinates?.coordinates?.longitude == null
      ? null
      : parseFloat(document.geolocation.pointCoordinates.coordinates.longitude);

  const finalPosition = (Number.isFinite(safeLatitude) && Number.isFinite(safeLongitude))
      ? [safeLatitude, safeLongitude]
      : defaultPosition;

  const [markerPosition, setMarkerPosition] = useState(finalPosition);
  const [pointName, setPointName] = useState("");
  const [newPoint, setNewPoint] = useState(false)
  const [filteredLanguages, setFilteredLanguages] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  useEffect(() => {
    if (locationMode === "area") {
      const areaCentroid = document?.geolocation?.area?.areaCentroid;

      if (areaCentroid?.latitude && areaCentroid?.longitude) {
        setMarkerPosition([areaCentroid.latitude, areaCentroid.longitude]);
      } else {
        console.warn("Area centroid is missing or invalid. Resetting marker position.");
        setMarkerPosition(defaultPosition); // Fallback to default position if centroid is invalid
      }

      // Clear pointCoordinates and geolocation latitude/longitude
      handleChange("geolocation", {
        area: document.geolocation.area, // Retains the selected area
        pointCoordinates: null,         // Clears point selection
      });

      setPointName(""); // Reset the point name input
    } else if (locationMode === "point" && document.geolocation.pointCoordinates) {
      // If in point mode, set the marker position to pointCoordinates
      const { latitude, longitude } = document.geolocation.pointCoordinates.coordinates || {};
      if (latitude && longitude) {
        setMarkerPosition([latitude, longitude]);
      }
    }
  }, [locationMode]);

  useEffect(() => {
    if (mapRef.current && document.geolocation.area?.geometry) {
      const { coordinates } = document.geolocation.area.geometry;
      const polygonCoords = coordinates[0].map(([lng, lat]) => [lat, lng]);
      const bounds = L.latLngBounds(polygonCoords);
      mapRef.current.fitBounds(bounds);
    }
  }, [document.area]);

  const [allKnownAreas, setAllKnownAreas] = useState([]);
  const [allKnownPoints, setAllKnownPoints] = useState([]);
  const { setFeedbackFromError } = useContext(FeedbackContext);

  useEffect(() => {
    API.getAllAreasSnippets(authToken)
        .then(setAllKnownAreas)
        .catch(setFeedbackFromError);

    API.getAllGeolocatedPoints(authToken)
        .then((points) => {
          setAllKnownPoints(points);

          // Se il documento ha un punto esistente, imposta il selectedPointId
          if (document.geolocation?.pointCoordinates?.pointId) {
            const existingPoint = points.find(
                (p) => p.id === document.geolocation.pointCoordinates.pointId
            );

            if (existingPoint) {
              setSelectedPointId(existingPoint.id.toString());

              // Imposta la posizione del marcatore sulla mappa
              setMarkerPosition([existingPoint.latitude, existingPoint.longitude]);
            }
          }
        })
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
        if (document.scale && !scales.some((s) => s.name === document.scale)) {
          setScaleOptions([
            ...scales,
            { id: Date.now(), name: document.scale },
          ]);
        } else {
          setScaleOptions(scales);
        }
      })
      .catch((e) => setFeedbackFromError(e));
  }, [setFeedbackFromError]);

  useEffect(() => {
    // Set marker position if geolocation is available
    if (document.geolocation.pointCoordinates) {
      setMarkerPosition([
        document.geolocation.pointCoordinates.coordinates.latitude,
        document.geolocation.pointCoordinates.coordinates.longitude,
      ]);
    }

    if (
      document.language &&
      !languageOptions.includes(document.language) &&
      document.language !== "Other"
    ) {
      setLanguageOptions((prevLanguageOptions) => {
        if (!prevLanguageOptions.includes(document.language)) {
          return [...prevLanguageOptions, document.language];
        }
        return prevLanguageOptions;
      });
    }
  }, [
    document?.geolocation?.pointCoordinates?.coordinates,
      document.language,
      languageOptions,
  ]);
  useEffect(() => {
    const loadAreaGeometry = async () => {
      if (document.geolocation?.area?.areaId) {
        try {
          const areaDetails = await API.getAreaById(document.geolocation.area.areaId, authToken);

          handleChange("geolocation", {
            area: areaDetails,
            pointCoordinates: null,
          });
          setSelectedAreaId(areaDetails.id);
          zoomOnArea(areaDetails);
        } catch (error) {
          console.error("Failed to load area geometry:", error);
        }
      }
    };

    loadAreaGeometry();
  }, [document, authToken]);



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

    // Calcola il centroide
    const coordinates = area.geometry.coordinates[0];
    const centroid = calculateCentroid(coordinates.map(([lat, lng]) => [lng, lat]));

    // Salva l'area creata temporaneamente
    const newArea = {
      area: {
        areaId: null,
        areaName: "", // L'utente la definirà
        areaCentroid: centroid ,
        geometry: {
          type: "Polygon",
          coordinates: [coordinates], // Mantieni il formato GeoJSON
        },
      },
      pointCoordinates: null,
    };

    handleChange("geolocation", newArea);
    setDocument((prev) => ({
      ...prev,
      geolocation: newArea,
    }));

    setSelectedAreaId(""); // Resetta l'area selezionata
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
        const { lat, lng } = e.latlng;

        handleChange("geolocation", {
          pointCoordinates: {
            coordinates: { latitude: lat, longitude: lng },
            pointId: null,
            pointName: pointName || "",
          },
        });

        setMarkerPosition([lat, lng]);
        setPointName("");
        setNewPoint(true);
        setSelectedPointId("");
      },
    });
    return null;
  }

  const handleLatitudeChange = (e) => {
    const latitude = e.target.value === "" ? null : parseFloat(e.target.value);

    handleChange("geolocation", {
      ...document.geolocation,
      pointCoordinates: {
        ...document.geolocation.pointCoordinates,
        coordinates: {
          ...document.geolocation.pointCoordinates.coordinates,
          latitude,
        },
      },
    });

    // Sync the marker position
    setMarkerPosition([
      latitude,
      document.geolocation.pointCoordinates?.coordinates?.longitude || defaultPosition[1],
    ]);
  };

  const handleLongitudeChange = (e) => {
    const longitude = e.target.value === "" ? null : parseFloat(e.target.value);

    handleChange("geolocation", {
      ...document.geolocation,
      pointCoordinates: {
        ...document.geolocation.pointCoordinates,
        coordinates: {
          ...document.geolocation.pointCoordinates.coordinates,
          longitude,
        },
      },
    });

    // Sync the marker position
    setMarkerPosition([
      document.geolocation.pointCoordinates?.coordinates?.latitude || defaultPosition[0],
      longitude,
    ]);
  };


  const handleSelectExistingArea = async (e) => {
    const areaId = e.target.value;

    try {
      // Fetch the selected area details
      const area = await API.getAreaById(areaId, authToken);

      if (!area) {
        throw new Error("Area data is missing or invalid");
      }

      console.log("Fetched Area:", area);

      // Update the selected area ID state
      setSelectedAreaId(areaId);

      // Safely extract centroid coordinates
      const { latitude, longitude } = area?.centroid || { latitude: null, longitude: null };

      // Update the geolocation field with correct structure
      handleChange("geolocation", {
        area: {
          areaId: area.id,
          areaName: area.name,
          areaCentroid: { latitude, longitude },
          geometry: area.geometry,
        },
        pointCoordinates: null, // Clear point selection
      });

      // Zoom the map to the area geometry
      if (area.geometry) {
        zoomOnArea(area);
      } else if (latitude && longitude) {
        // Fallback to centroid if geometry is unavailable
        mapRef.current.flyTo([latitude, longitude], 12);
      }
    } catch (error) {
      console.error("Error selecting area:", error.message || error);
    }
  };

  const handleSelectExistingPoint = (e) => {
    const pointId = e.target.value; // Get selected pointId from the dropdown
    console.log("Selected point ID:", pointId);

    // Safely find the point using a stricter condition
    const point = allKnownPoints?.find((p) => {
      console.log("Checking point:", p.id, "against", pointId);
      return p.id.toString() === pointId.toString();
    });

    if (!point) {
      console.error("Point not found with ID:", pointId);
      return;
    }

    console.log("Existing point found:", point);

    setSelectedPointId(pointId);

    // Update geolocation state with the found point
    handleChange("geolocation", {
      ...document.geolocation,
      pointCoordinates: {
        pointId: point.id,
        pointName: point.name,
        coordinates: {
          latitude: point.latitude,
          longitude: point.longitude,
        },
      },
      area: null, // Clear any area selection
    });

    // Update the marker position on the map
    setMarkerPosition([point.latitude, point.longitude]);

    // Zoom to the selected point on the map
    zoomOnPoint(point);
  };

  const mapRef = useRef(null);

  const zoomOnArea = (area) => {
    if (!mapRef.current || !area?.geometry?.type) return;

    const { type, coordinates } = area.geometry;

    if (type === "POLYGON") {
      // Mappa le coordinate in [lat, lng] per Leaflet
      //const latlngs = coordinates.map(([lng, lat]) => [lat, lng]);

      const bounds = L.latLngBounds(coordinates);
      mapRef.current.fitBounds(bounds, { padding: [20, 20] });

    } else if (type === "MultiPolygon") {
      // Gestisce MultiPolygon se presente
      const latlngs = coordinates.flatMap((polygon) =>
        polygon.map(([lng, lat]) => [lat, lng])
    );

    const bounds = L.latLngBounds(latlngs);
      mapRef.current.fitBounds(bounds, { padding: [20, 20] });

    } else {
      console.warn("Unsupported geometry type:", type);
    }
  };

  const handleLanguageSelect = (language) => {
    handleChange("customLanguage", language);
    setFilteredLanguages([]);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (filteredLanguages.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setHighlightedIndex((prevIndex) =>
          prevIndex < filteredLanguages.length - 1 ? prevIndex + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setHighlightedIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : filteredLanguages.length - 1
        );
      } else if (e.key === "Enter" && highlightedIndex >= 0) {
        e.preventDefault();
        handleLanguageSelect(filteredLanguages[highlightedIndex]);
      }
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
      mapRef.current.flyTo([point.latitude, point.longitude], 10);
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
              <Spinner animation="border" className="mx-auto">
                <output>Loading...</output>
              </Spinner>
            )}
            {document.stakeholders
              .filter(
                (stakeholder) =>
                  !allStakeholders.map((s) => s.name).includes(stakeholder)
              )
              .map((stakeholder, index) => (
                <div key={index} className="d-flex mb-2">
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
            {scaleOptions ? (
              <Form.Control
                as="select"
                value={document.scale}
                onChange={(e) => handleChange("scale", e.target.value)}
                isInvalid={!!errors.scale}
                required
                ref={refs.scaleRef}
              >
                <option value="">Select scale</option>
                {scaleOptions.map((scaleOption) => (
                  <option key={scaleOption.id} value={scaleOption.name}>
                    {scaleOption.name}
                  </option>
                ))}
                <option value="Architectural">Architectural</option>
                <option value="Other">Other</option>
              </Form.Control>
            ) : (
              <Spinner animation="border" className="mx-auto">
                <output>Loading...</output>
              </Spinner>
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
                  disabled={
                    !document.customScale?.trim() ||
                    scaleOptions.some(
                      (s) =>
                        s.name.toLowerCase() ===
                        document.customScale.trim().toLowerCase()
                    ) ||
                    scaleOptions.some(
                      (s) => s.name === `1:${document.customScale}`
                    )
                  }
                  onClick={() => {
                    setScaleOptions([
                      ...scaleOptions,
                      { id: Date.now(), name: document.customScale },
                    ]);
                    handleChange("scale", document.customScale);
                  }}
                  title="Add a custom scale"
                >
                  <i className="bi bi-plus-square"></i>
                </Button>
              </div>
            )}
            {document.scale === "Architectural" && (
              <div className="d-flex mt-2">
                <InputGroup className="me-2">
                  <InputGroup.Text>1 :</InputGroup.Text>
                  <Form.Control
                    type="number"
                    value={document.customScale}
                    onChange={(e) =>
                      handleChange("customScale", e.target.value)
                    }
                    isInvalid={!!errors.scale}
                    placeholder="Enter the scale value"
                  />
                </InputGroup>
                <Button
                  variant="primary"
                  disabled={
                    !document.customScale?.trim() ||
                    scaleOptions.some((s) => s.name === document.customScale) ||
                    scaleOptions.some(
                      (s) => s.name === `1:${document.customScale}`
                    )
                  }
                  onClick={() => {
                    setScaleOptions([
                      ...scaleOptions,
                      { id: Date.now(), name: `1:${document.customScale}` },
                    ]);
                    handleChange("scale", `1:${document.customScale}`);
                  }}
                  title="Add an architectural scale"
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
              <Spinner animation="border" className="mx-auto">
                <output>Loading...</output>
              </Spinner>
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
                  disabled={
                    !document.customType?.trim() ||
                    (document.customType &&
                      allDocumentTypes.some(
                        (t) =>
                          t.name.toLowerCase() ===
                          document.customType.trim().toLowerCase()
                      ))
                  }
                  onClick={() => {
                    setAllDocumentTypes((prevTypes) => [
                      ...prevTypes,
                      { id: Date.now(), name: document.customType },
                    ]);
                    handleChange("type", document.customType);
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
              as="select"
              value={document.language}
              onChange={(e) => handleChange("language", e.target.value)}
              isInvalid={!!errors.language}
              ref={refs.languageRef}
            >
              <option value="">Select language</option>
              {languageOptions.map((languageOption) => (
                <option key={languageOption} value={languageOption}>
                  {languageOption}
                </option>
              ))}
              <option value="Other">Other</option>
              <option value="">None</option>
            </Form.Control>
            {document.language === "Other" && (
              <div className="d-flex mt-2">
                <Form.Control
                  type="text"
                  placeholder="Enter custom language"
                  value={document.customLanguage || ""}
                  onChange={(e) =>
                    handleChange("customLanguage", e.target.value)
                  }
                  isInvalid={!!errors.language}
                  className="me-2"
                  onKeyDown={handleKeyDown}
                />
                <Button
                  variant="primary"
                  disabled={
                    !document.customLanguage?.trim() ||
                    (document.customLanguage &&
                      languageOptions.includes(document.customLanguage))
                  }
                  onClick={() => {
                    setLanguageOptions([
                      ...languageOptions,
                      document.customLanguage,
                    ]);
                    handleChange("language", document.customLanguage);
                  }}
                  title="Add custom language"
                >
                  <i className="bi bi-plus-square"></i>
                </Button>
              </div>
            )}
            {filteredLanguages.length > 0 && (
              <div className="mt-2 position-relative">
                <div className="dropdown-menu show">
                  {filteredLanguages.map((language, index) => (
                    <button
                      key={language}
                      className={`dropdown-item ${
                        index === highlightedIndex ? "active" : ""
                      }`}
                      onClick={() => handleLanguageSelect(language)}
                    >
                      {language}
                    </button>
                  ))}
                </div>
              </div>
            )}
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
                  setLocationMode(e.target.value);
                  if (e.target.value === "entire_municipality") {
                    console.log(defaultPosition);
                    const municipality = allKnownAreas.find(
                        (p) => p.name === "Entire Municipality"
                    );

                    if (municipality) {
                      setSelectedAreaId(municipality.id.toString());
                    }

                    handleChange("geolocation", {
                      ...document.geolocation,
                      area: {
                        areaId: null,
                        areaName: "Entire Municipality",
                        areaCentroid: {
                          latitude: defaultPosition[0],
                          longitude: defaultPosition[1],
                        },
                        geometry: {
                          type: "MultiPolygon",
                          coordinates: kirunaBorderCoordinates,
                        },
                      },
                      pointCoordinates: null, // Clear point selection
                    });
                    zoomOnMunicipality();
                  }
                }}
                style={{ flex: 1 }}
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
                        value={pointName || document.geolocation?.pointCoordinates?.pointName || ""}
                        onChange={(e) => {
                          const updatedPointName = e.target.value;
                          setPointName(updatedPointName); // Update local state

                          console.log(updatedPointName)
                          // Synchronize with geolocation
                          handleChange("geolocation", {
                            ...document.geolocation,
                            pointCoordinates: {
                              ...document.geolocation.pointCoordinates,
                              pointName: updatedPointName,
                            },
                          });
                        }}
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
                {allKnownAreas
                    ?.filter((area) => area.name !== "Entire Municipality") // Exclude "Entire Municipality"
                    .map((area) => (
                        <option key={area.id} value={area.id}>
                          {area.name}
                        </option>
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
                  <option key={point.id} value={point.id}>
                    {point.name || `Point ${point.id}`}
                  </option>
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
                <div className="divider"/>
                <Form.Control
                    type="number"
                    min={67.3564329180828}
                    max={69.05958911620179}
                    step={0.00001}
                    value={document.geolocation?.pointCoordinates?.coordinates?.latitude || ""}
                    onChange={handleLatitudeChange}
                    id="formDocumentGeolocationLatitude"
                    isInvalid={!!errors.latitude}
                    ref={refs.latitudeRef}
                />
                <div style={{color: "#dc3545", fontSize: "0.875rem"}}>
                  {errors.latitude}
                </div>
                <Form.Range
                    min={67.3564329180828}
                    max={69.05958911620179}
                    step={0.00001}
                    value={document.geolocation?.pointCoordinates?.coordinates?.latitude}
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
                <div className="divider"/>
                <Form.Control
                    type="number"
                    value={document.geolocation?.pointCoordinates?.coordinates?.longitude || ""}
                    min={17.89900836116174}
                    max={23.28669305841499}
                    step={0.00001}
                    isInvalid={!!errors.longitude}
                    onChange={handleLongitudeChange}
                    id="formDocumentGeolocationLongitude"
                    ref={refs.longitudeRef}
                />
                <div style={{color: "#dc3545", fontSize: "0.875rem"}}>
                  {errors.longitude}
                </div>
                <Form.Range
                    min={17.89900836116174}
                    max={23.28669305841499}
                    step={0.00001}
                    value={document.geolocation?.pointCoordinates?.coordinates?.longitude}
                    onChange={handleLongitudeChange}
                />
              </Form.Group>
            </Col>
          </>
        )}

      </Row>


      {locationMode === "area" && areaModified && (
          <Row className="mb-4">
            <Col md={6}>
              <Form.Group>
                <Form.Label>Area name</Form.Label>
                <div className="divider" />
                <Form.Control
                    type="text"
                    value={document.geolocation.area?.areaName || ""}
                    onChange={(e) => {
                      const updatedAreaName = e.target.value;

                      handleChange("geolocation", {
                        ...document.geolocation,
                        area: {
                          ...document.geolocation.area,
                          areaName: updatedAreaName, // Aggiorna solo il nome dell'area
                        },
                      });
                    }}
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
                {locationMode === "point" && markerPosition && (
                    <Marker position={markerPosition} />
                )}
                {locationMode === "entire_municipality" ? (
                  <Polygon positions={kirunaBorderCoordinates} />
                ) : null}

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
                    document.geolocation.area?.geometry && (() => {
                      const { type, coordinates } = document.geolocation.area.geometry;

                      if (type === "POLYGON" || type === "Polygon") {
                        //const polygonCoords = coordinates.map(([lng, lat]) => [lat, lng]);
                        return <Polygon positions={coordinates} color="green" />;
                      } else if (type === "MULTIPOLYGON" || type === "MultiPolygon") {

                        const coordinates = kirunaBorderCoordinates;
                        // Validate coordinates
                        if (!Array.isArray(coordinates)) {
                          console.error("Invalid coordinates format:", coordinates);
                          return null; // Or provide a fallback UI
                        }

                        try {
                          // Transform MultiPolygon coordinates
                          const multiPolygonCoords = coordinates.map((polygon) =>
                            polygon.map((ring) =>
                                ring.map(([lng, lat]) => [lat, lng])
                            )
                        );

                        return multiPolygonCoords.map((coords, idx) => (
                              <Polygon key={idx} positions={coords} color="blue" />
                          ));
                        } catch (error) {
                          console.error("Error processing MultiPolygon coordinates:", error);
                          return null; // Gracefully handle errors
                        }
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
  selectedAreaId: PropTypes.any.isRequired,
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
