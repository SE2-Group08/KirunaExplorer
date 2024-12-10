import PropTypes from "prop-types";
import { useEffect, useState, useContext } from "react";
import { Button, Modal } from "react-bootstrap";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Document } from "../model/Document.mjs";
import ListDocumentLinks from "./ListDocumentLinks.jsx";
import DocumentDescriptionComponent from "./DocumentDescription.jsx";
import DocumentFormComponent from "./DocumentForm.jsx";
import dayjs from "dayjs";
import "../App.scss";
import API from "../API.mjs";
import { getIconUrlForDocument } from "../utils/iconMapping";
import FeedbackContext from "../contexts/FeedbackContext.js";

import customParseFormat from "dayjs/plugin/customParseFormat";
import getKirunaArea from "./KirunaArea.jsx";
dayjs.extend(customParseFormat);

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
  const [isSliderOpened, setIsSliderOpened] = useState(false);
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
//   const [filesToUpload, setFilesToUpload] = useState([]);
//   const [existingFiles, setExistingFiles] = useState([]);
//   const [deletedExistingFiles, setDeletedExistingFiles] = useState([]);

//   const { setFeedbackFromError } = useContext(FeedbackContext);

//   useEffect(() => {
//     if (props.document && props.document.id) {
//       API.getDocumentFiles(props.document.id)
//         .then((files) => {
//           console.log("Fetched existing files:", files);
//           setExistingFiles(files);
//           setDeletedExistingFiles([]);
//         })
//         .catch((error) => console.error("Error loading files:", error));
//     }
//   }, [props.document]);

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

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const newErrors = {}; // Reset errors

//     const combinedIssuanceDate = `${document.year}${
//       document.month ? "-" + document.month.padStart(2, "0") : ""
//     }${document.day ? "-" + document.day.padStart(2, "0") : ""}`;

//     const sanitizedGeolocation = {
//       latitude: document.geolocation.latitude || null,
//       longitude: document.geolocation.longitude || null,
//       municipality: document.geolocation.municipality || null,
//     };

//     // Title validation
//     if (typeof document.title !== "string" || !document.title.trim()) {
//       newErrors.title = "Title is required and must be a non-empty string.";
//     } else if (document.title.length < 2) {
//       newErrors.title = "Title must be at least 2 characters.";
//     } else if (document.title.length > 64) {
//       newErrors.title = "Title must be less than 64 characters.";
//     }

//     if (
//       !Array.isArray(document.stakeholders) ||
//       document.stakeholders.length === 0 ||
//       document.stakeholders.some((s) => typeof s !== "string" || !s.trim())
//     ) {
//       newErrors.stakeholders =
//         "At least one stakeholder is required, and all must be non-empty strings.";
//     } else if (
//       new Set(document.stakeholders.map((s) => s.trim().toLowerCase())).size !==
//       document.stakeholders.length
//     ) {
//       newErrors.stakeholders = "Stakeholders must not contain duplicates.";
//     } else if (
//       document.stakeholders.some((s) => s.trim().toLowerCase() === "other")
//     ) {
//       newErrors.stakeholders = "Stakeholders cannot be named 'other'.";
//     }

//     const scalePatterns = [
//       "Text",
//       "Blueprint/Material effects",
//       /^[1-9]:[1-9][0-9]*$/,
//     ];
//     if (
//       typeof document.scale !== "string" ||
//       !document.scale.trim() ||
//       !scalePatterns.some((pattern) =>
//         typeof pattern === "string"
//           ? pattern === document.scale
//           : pattern.test(document.scale)
//       )
//     ) {
//       newErrors.scale =
//         "Scale is required and must match one of the defined patterns.";
//     } else if (document.scale.includes(":")) {
//       const [first, second] = document.scale.split(":").map(Number);
//       if (first > second) {
//         newErrors.scale =
//           "The first number of the scale must be smaller than the second one.";
//       }
//     }

//     // Issuance date validation
//     if (
//       typeof combinedIssuanceDate !== "string" ||
//       !dayjs(
//         combinedIssuanceDate,
//         ["YYYY-MM-DD", "YYYY-MM", "YYYY"],
//         true
//       ).isValid()
//     ) {
//       newErrors.issuanceDate =
//         "Issuance date is required and must be in the format DD/MM/YYYY, MM/YYYY or YYYY.";
//     }

//     // Type validation
//     if (!document.type || (document.type === "Other" && !document.customType)) {
//       newErrors.type = "Type is required.";
//     } else if (document.type === "Other") {
//       newErrors.type = "Type cannot be 'Other'.";
//     } else if (document.type.length > 64 && document.type.length < 2) {
//       newErrors.type = "Type must be between 2 and 64 characters.";
//     }

//     // Language validation
//     if (
//       document.language &&
//       (document.language.length < 2 || document.language.length > 64)
//     ) {
//       newErrors.language = "Language must be between 2 and 64 characters.";
//     }

//     // Number of pages validation
//     if (document.nrPages && typeof document.nrPages !== "number") {
//       newErrors.nrPages = "Number of pages must be an integer";
//     }

//     // Geolocation validation
//     if (document.geolocation.latitude && document.geolocation.longitude) {
//       const point = {
//         lat: document.geolocation.latitude,
//         lng: document.geolocation.longitude,
//       };

//       const kirunaBorderCoordinatesLngLat = kirunaBorderCoordinates.map(
//         ([lat, lng]) => [lng, lat]
//       );
//       const polygon = [
//         ...kirunaBorderCoordinatesLngLat,
//         kirunaBorderCoordinatesLngLat[0], // Close the loop
//       ];
//       const [x, y] = [point.lng, point.lat]; // Ensure [lng, lat]
//       let inside = false;

//       for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
//         const [xi, yi] = polygon[i];
//         const [xj, yj] = polygon[j];

//         const intersect =
//           yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
//         if (intersect) inside = !inside;
//       }

//       if (!inside) {
//         newErrors.latitude = "Geolocation must be within the Kiruna boundary.";
//         newErrors.longitude = "Geolocation must be within the Kiruna boundary.";
//       }
//     }
//     if (
//       (document.geolocation.latitude || document.geolocation.longitude) &&
//       document.geolocation.municipality === "Entire municipality"
//     ) {
//       newErrors.municipality =
//         "Geolocation must be 'Entire municipality' or a valid coordinate.";
//     }

//     // Description validation
//     if (document.description && document.description.length > 1000) {
//       newErrors.description = "Description must not exceed 1000 characters.";
//     }

//     if (Object.keys(newErrors).length > 0) {
//       setErrors(newErrors);
//       return;
//     }
//     try {
//       if (props.document.id === undefined) {
//         const newDocId = await props.handleAdd(
//           new Document(
//             null,
//             document.title,
//             document.stakeholders,
//             document.scale,
//             combinedIssuanceDate,
//             document.type,
//             document.nrConnections,
//             document.language,
//             document.nrPages,
//             sanitizedGeolocation,
//             document.description
//           )
//         );

//         console.log(newDocId);

//         if (filesToUpload.length > 0) {
//           try {
//             await API.uploadFiles(newDocId, filesToUpload);
//           } catch (error) {
//             console.error("Error uploading files:", error);
//             alert("An error occurred while uploading files. Please try again.");
//           }
//         }
//       } else {
//         await props.handleSave(
//           new Document(
//             props.document.id,
//             document.title,
//             document.stakeholders,
//             document.scale,
//             combinedIssuanceDate,
//             document.type,
//             document.nrConnections,
//             document.language,
//             document.nrPages,
//             sanitizedGeolocation,
//             document.description
//           )
//         );

//         if (filesToUpload.length > 0) {
//           try {
//             await API.uploadFiles(props.document.id, filesToUpload);
//           } catch (error) {
//             console.error("Error uploading files:", error);
//             alert("An error occurred while uploading files. Please try again.");
//           }
//         }

//         if (deletedExistingFiles.length > 0) {
//           try {
//             await Promise.all(
//               deletedExistingFiles.map((fileId) => API.deleteFile(fileId))
//             );
//           } catch (error) {
//             console.error("Error deleting files:", error);
//             alert(
//               "An error occurred while deleting files. Some files may not have been removed."
//             );
//           }
//         }
//       }
//       setFilesToUpload([]);
//       props.onHide();
//     } catch (error) {
//       setFeedbackFromError(error);
//     }
//   };

//   const updateFilesToUpload = (newFiles) => {
//     setFilesToUpload(newFiles);
//   };

//   const handleLinksClick = () => {
//     setIsSliderOpened(!isSliderOpened);
//   };

//   const handleDeleteExistingFile = (fileId) => {
//     console.log("handleDeleteExistingFile called with fileId:", fileId);
//     setDeletedExistingFiles((prev) => {
//       const updatedList = [...prev, fileId];
//       console.log("Updated deletedExistingFiles:", updatedList);
//       return updatedList;
//     });
//     setExistingFiles((prevFiles) => {
//       const updatedFiles = prevFiles.filter((file) => file.id !== fileId);
//       console.log("Updated existingFiles:", updatedFiles);
//       return updatedFiles;
//     });
//   };

//   const handleDownload = async (id, name, extension) => {
//     try {
//       await API.downloadFile(id, name, extension);
//     } catch (error) {
//       console.error("Error downloading file:", error);
//     }
//   };

//   const handleLinkToClick = () => {
//     props.onLinkToClick(props.document);
//     props.onHide();
//   };

//   const handleChange = (field, value) => {
//     setDocument((prevDocument) => ({
//       ...prevDocument,
//       [field]: value,
//     }));
//   };

//   const handleCloseSlider = () => {
//     setIsSliderOpened(false);
//   };

//   const handleSnippetClick = (snippet) => {
//     props.onSnippetClick(snippet);
//     setIsSliderOpened(false);
//   };

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
          <img
            src={getIconUrlForDocument(document.type, document.stakeholders)}
            alt={`${document.type} icon`}
            style={{ width: "40px", height: "40px", marginRight: "10px" }}
          />
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
            setErrors={setErrors}

            kirunaBorderCoordinates={kirunaBorderCoordinates}
          />
        ) : (
          <DocumentDescriptionComponent
            document={document}
            // handleDownload={handleDownload}
            isEditable={isEditable}
          />
        )}
      </Modal.Body>
      {!isEditable && (
        <Modal.Footer className="mt-3">
          <div className="d-flex align-items-center">
            <Button
              variant="primary"
            //   onClick={handleLinksClick}
              className="me-2"
            >
              Links
            </Button>
            <Button
              variant="primary"
            //   onClick={handleLinkToClick}
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
        isOpen={isSliderOpened}
        // onClose={handleCloseSlider}
        // onSnippetClick={handleSnippetClick}
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
  onLinkToClick: PropTypes.func,
  onLinksClick: PropTypes.func,
  onSnippetClick: PropTypes.func,
};
