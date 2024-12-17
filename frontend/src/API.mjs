import { Document, DocumentSnippet } from "./model/Document.mjs";
import Stakeholder from "./model/Stakeholder.mjs";
import Link from "./model/Link.mjs";
import { DocumentType } from "./model/DocumentType.mjs";
import { Scale } from "./model/Scale.mjs";
import {
  GeolocatedPoint,
  GeolocatedAreaSnippet,
  GeolocatedAreaGeometry,
} from "./model/Geolocation.mjs";

const SERVER_URL = "http://localhost:8080/api/v1";

/* ************************** *
 *       Resources APIs       *
 * ************************** */

const uploadFiles = async (id, files) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const url = `${SERVER_URL}/documents/${id}/files`;

  const response = await fetch(url, {
    method: "POST",
    body: formData,
  }).then(handleInvalidResponse);
};

const deleteFile = async (fileId) => {
  const response = await fetch(`${SERVER_URL}/files/${fileId}`, {
    method: "DELETE",
  }).then(handleInvalidResponse);
};

const downloadFile = async (fileId, fileName, fileExtension) => {
  try {
    const response = await fetch(`${SERVER_URL}/files/${fileId}`);

    // Use the provided fileName and fileExtension
    const fullFileName = `${fileName}.${fileExtension}`;

    // Convert the response to a Blob
    const blob = await response.blob();

    // Create a Blob URL
    const url = window.URL.createObjectURL(blob);

    // Programmatically trigger the download with the correct name
    const link = document.createElement("a");
    link.href = url;
    link.download = fullFileName;
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    handleInvalidResponse(error);
  }
};

const getDocumentFiles = async (documentId) => {
  const response = await fetch(`${SERVER_URL}/documents/${documentId}/files`);
  if (!response.ok) {
    throw new Error(`Failed to get document resources: ${response.statusText}`);
  }
  return await response.json();
};

/* ************************** *
 *       Link APIs      *
 * ************************** */

const createLink = async (documentId, link) => {
  const requestBody = {
    type: link.type.toUpperCase().replace(/ /g, "_"),
    documentId: link.documentId,
  };

  return await fetch(`${SERVER_URL}/documents/${documentId}/links`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(requestBody),
  }).then(handleInvalidResponse);
};

// Retrieve all links of a document
const getAllLinksOfDocument = async (documentId) => {
  const links = await fetch(`${SERVER_URL}/documents/${documentId}/links`)
    .then(handleInvalidResponse)
    .then((response) => response.json());
  return links;
};

// Update a link for a document
const updateLink = async (documentId, linkId, updatedLink) => {
  return await fetch(`${SERVER_URL}/api/v1/documents/${documentId}/links`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedLink),
  }).then(handleInvalidResponse);
};

// Delete a link for a document
const deleteLink = async (linkId) => {
  return await fetch(`${SERVER_URL}/links/${linkId}`, {
    method: "DELETE",
  }).then(handleInvalidResponse);
};

/* ************************** *
 *       Documents APIs       *
 * ************************** */

// Retrieve all documents snippets
const getAllDocumentSnippets = async () => {
  const documents = await fetch(`${SERVER_URL}/documents/map`)
    .then(handleInvalidResponse)
    .then((response) => response.json())
    .then(mapAPISnippetsToSnippet);
  return documents;
};

// Retrieve documents by page number
const getDocumentsByPageNumber = async (pageNo = 0) => {
  try {
    const response = await fetch(`${SERVER_URL}/documents?pageNo=${pageNo}`);
    if (!response.ok) {
      console.error(response);
    }
    const documents = await response.json();
    return documents;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const addDocument = async (document) => {
  try {
    const response = await fetch(`${SERVER_URL}/documents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(document),
    });

    if (!response.ok) {
      console.error(
        "Failed to add document:",
        response.status,
        response.statusText
      );
      return null;
    }

    const location = response.headers.get("location");
    if (!location) {
      console.error("Location header not found in response.");
      return null;
    }

    const newDocId = location.split("/").pop(); // Estrarre l'ID dal percorso

    return newDocId;
  } catch (error) {
    console.error("Error while adding document:", error);
    return null;
  }
};

// Retrieve a document by id
const getDocumentById = async (documentId) => {
  const document = await fetch(`${SERVER_URL}/documents/${documentId}`)
    .then(handleInvalidResponse)
    .then((response) => response.json())
    .then(mapAPIDocumentToDocument);
  return document;
};

const updateDocument = async (documentId, nextDocument) => {
  return await fetch(`${SERVER_URL}/documents`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(nextDocument),
  }).then(handleInvalidResponse);
};

// Delete a document given its id
const deleteDocument = async (documentId) => {
  return await fetch(`${SERVER_URL}/documents/${documentId}`, {
    method: "DELETE",
  }).then(handleInvalidResponse);
};

const searchDocuments = async (keyword) => {
  const params = new URLSearchParams();
  if (keyword) {
    params.append("keyword", keyword);
  }

  const queryString = params.toString(); // Automatically encodes spaces as '+'

  const response = await fetch(
    `${SERVER_URL}/documents/search?${queryString}`,
    {
      method: "GET",
      // Removed 'Content-Type' header as it's not needed for GET requests
    }
  )
    .then(handleInvalidResponse)
    .then((response) => response.json())
    .then(mapAPISnippetsToSnippet);

  return response;
};

/* ************************** *
 *      Stakeholders APIs     *
 * ************************** */

// Retrieve all stakeholders
const getAllStakeholders = async () => {
  const stakeholders = await fetch(`${SERVER_URL}/stakeholders`)
    .then(handleInvalidResponse)
    .then((response) => response.json())
    .then((stakeholders) =>
      stakeholders.map((stakeholder) => Stakeholder.fromJSON(stakeholder))
    );
  return stakeholders;
};

// Create a new stakeholder
const addStakeholder = async (stakeholder) => {
  return await fetch(`${SERVER_URL}/stakeholders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(stakeholder),
  }).then(handleInvalidResponse);
};

/* ************************** *
 *     Document Type APIs     *
 * ************************** */

// Retrieve all document types
const getAllDocumentTypes = async () => {
  const documentTypes = await fetch(`${SERVER_URL}/document-types`)
    .then(handleInvalidResponse)
    .then((response) => response.json())
    .then((documentTypes) =>
      documentTypes.map((documentType) => DocumentType.fromJSON(documentType))
    );
  return documentTypes;
};

// Create a new document type
const addDocumentType = async (documentType) => {
  return await fetch(`${SERVER_URL}/document-types`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(documentType),
  }).then(handleInvalidResponse);
};

/* ************************** *
 *       Scale APIs      *
 * ************************** */

// Retrieve all scales
const getAllScales = async () => {
  const scales = await fetch(`${SERVER_URL}/scales`)
    .then(handleInvalidResponse)
    .then((response) => response.json())
    .then((scales) => {
      const textScales = scales
        .filter((scale) => !scale.scale.includes(":"))
        .sort();
      const numericScales = scales
        .filter((scale) => scale.scale.includes(":"))
        .sort((a, b) => {
          const numA = parseInt(a.scale.split(":")[1], 10);
          const numB = parseInt(b.scale.split(":")[1], 10);
          return numA - numB;
        });
      return [...textScales, ...numericScales];
    })
    .then((sortedScales) => sortedScales.map((scale) => Scale.fromJSON(scale)));
  return scales;
};

// Create a new scale
const addScale = async (scale) => {
  return await fetch(`${SERVER_URL}/scales`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(scale),
  }).then(handleInvalidResponse);
};

/* ************************** *
 *   Geolocation APIs   *
 * ************************** */
// Retrieve all point coordinates
const getAllGeolocatedPoints = async () => {
  const geolocatedPoints = await fetch(`${SERVER_URL}/points`)
    .then(handleInvalidResponse)
    .then((response) => response.json())
    .then((geolocatedPoints) =>
      geolocatedPoints.map((point) => GeolocatedPoint.fromJSON(point))
    );

  return geolocatedPoints;
};

// Create a new point coordinate
const addGeolocatedPoint = async (point) => {
  return await fetch(`${SERVER_URL}/points`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(point),
  }).then(handleInvalidResponse);
};

// Retrieve all areas snippets
const getAllAreasSnippets = async () => {
  const areas = await fetch(`${SERVER_URL}/areas`)
    .then(handleInvalidResponse)
    .then((response) => response.json())
    .then((areas) => areas.map((area) => GeolocatedAreaSnippet.fromJSON(area)));

  return areas;
};

// Create a new area
const addGeolocatedArea = async (area) => {
  return await fetch(`${SERVER_URL}/areas`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(area),
  }).then(handleInvalidResponse);
};

// Retrieve the geometry of a specific area
const getAreaById = async (areaId) => {
  const area = await fetch(`${SERVER_URL}/areas/${areaId}`)
    .then(handleInvalidResponse)
    .then((response) => response.json())
    .then((area) => GeolocatedAreaGeometry.fromJSON(area));

  return area;
};

/* ************************** *
 *       Helper functions      *
 * ************************** */

function handleInvalidResponse(response) {
  try {
    if (!response.ok) {
      throw Error(response.statusText);
    }
    let type = response.headers.get("content-type");
    if (type != null && type.indexOf("application/json") === -1) {
      throw new TypeError(`Expected JSON, got ${type}`);
    }
    return response;
  } catch (error) {
    // Handle error silently
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

function mapAPIStakeholdersToStakeholders(apiStakeholders) {
  return apiStakeholders.map(
    (apiStakeholder) => new Stakeholder(apiStakeholder.id, apiStakeholder.name)
  );
}

async function mapAPIDocumentToDocument(apiDocument) {
  return new Document(
    apiDocument.id,
    apiDocument.title,
    apiDocument.stakeholders,
    apiDocument.scale,
    apiDocument.issuanceDate,
    apiDocument.type,
    apiDocument.nrConnections,
    apiDocument.language,
    apiDocument.nrPages,
    apiDocument.geolocation,
    apiDocument.description
  );
}

async function mapAPISnippetsToSnippet(apiSnippets) {
  return apiSnippets.map(
    (apiSnippet) =>
      new DocumentSnippet(
        apiSnippet.id,
        apiSnippet.title,
        apiSnippet.scale,
        apiSnippet.issuanceDate,
        apiSnippet.type,
        apiSnippet.geolocation,
        apiSnippet.stakeholders
      )
  );
}

const API = {
  /* Document */
  getAllDocumentSnippets,
  getDocumentsByPageNumber,
  addDocument,
  getDocumentById,
  updateDocument,
  deleteDocument,
  /* Stakeholder */
  getAllStakeholders,
  addStakeholder,
  /* Link */
  createLink,
  getAllLinksOfDocument,
  //updateLink,
  deleteLink,
  /* Document Type */
  getAllDocumentTypes,
  addDocumentType,
  /* Scale */
  searchDocuments,
  getAllScales,
  addScale,
  /* File */
  uploadFiles,
  deleteFile,
  getDocumentFiles,
  downloadFile,
  /* Geolocation */
  getAllGeolocatedPoints,
  addGeolocatedPoint,
  getAllAreasSnippets,
  addGeolocatedArea,
  getAreaById,
};
export default API;
