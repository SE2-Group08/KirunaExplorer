import { Document, DocumentSnippet } from "./model/Document.mjs";
import Stakeholder from "./model/Stakeholder.mjs";
import { DocumentType } from "./model/DocumentType.mjs";
import { Scale } from "./model/Scale.mjs";

const SERVER_URL = "http://localhost:8080/api/v1";

/* **************************** *
 *      Authentication APIs     *
 * **************************** */

// Given a credentials object containing username and password it executes login
const logIn = async (credentials) => {
  try {
    const response = await fetch(SERVER_URL + "/auth/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify(credentials),
    });

    return await response.json();
  } catch (error) {
    throw error;
  }
};

const getUserInfo = async (token) => {
  // Since we are not making a user info request here in the snippet,
  // we return true if we have a token; otherwise false.
  return !!token;
};

const logOut = async (token) => {
  // If your back-end requires an API call to invalidate the session, do it here.
  // In this snippet, we simply log the user out. The caller will handle removing the token from state.
  console.log("User successfully logged out.");
};

/* ********************* *
 *       User APIs       *
 * ********************* */

const getUsers = async () => {
  return await fetch(SERVER_URL + "/users")
    .then(handleInvalidResponse)
    .then((response) => response.json())
    .then((jsonArray) => jsonArray.map(User.fromJson));
};

const getUserById = async (userId) => {
  return await fetch(`${SERVER_URL}/users/${userId}`)
    .then(handleInvalidResponse)
    .then((response) => response.json())
    .then(User.fromJson);
};

/* ************************** *
 *       Resources APIs       *
 * ************************** */

const uploadFiles = async (id, files, token) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append("files", file);
  });

  const url = `${SERVER_URL}/documents/${id}/files`;
  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then(handleInvalidResponse)
    .then((response) => response);
};

const deleteFile = async (fileId, token) => {
  const response = await fetch(`${SERVER_URL}/files/${fileId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
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
    throw error;
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

const createLink = async (documentId, link, token) => {
  const requestBody = {
    type: link.type.toUpperCase().replace(/ /g, "_"),
    documentId: link.documentId,
  };

  return await fetch(`${SERVER_URL}/documents/${documentId}/links`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify(requestBody),
  }).then(handleInvalidResponse);
};

// Retrieve all links of a document
const getAllLinksOfDocument = async (documentId, token) => {
  const links = await fetch(`${SERVER_URL}/documents/${documentId}/links`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  })
    .then(handleInvalidResponse)
    .then((response) => response.json());
  return links;
};

// Update a link for a document
const updateLink = async (documentId, linkId, updatedLink) => {
  return await fetch(`${SERVER_URL}/documents/${documentId}/links`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedLink),
  }).then(handleInvalidResponse);
};

// Delete a link for a document
const deleteLink = async (linkId, token) => {
  return await fetch(`${SERVER_URL}/links/${linkId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  }).then(handleInvalidResponse);
};

/* ************************** *
 *       Documents APIs       *
 * ************************** */

// Retrieve all documents snippets
const getAllDocumentSnippets = async (filter) => {
  const documents = await fetch(`${SERVER_URL}/documents/map?filter=${filter}`)
    .then(handleInvalidResponse)
    .then((response) => response.json())
    .then(mapAPISnippetsToSnippet);
  return documents;
};

// Retrieve all documents snippets for the diagram
const getAllDocumentSnippetsWithLinks = async () => {
  console.log("API GET ALL DOCUMENTS WITH LINKS");
  const documents = await fetch(`${SERVER_URL}/documents/diagram`)
    .then(handleInvalidResponse)
    .then((response) => response.json())
    console.log("API DOCUMENTS: ", documents);
  return documents;
};

// Retrieve documents by page number
const getDocumentsByPageNumber = async (pageNo = 0, token) => {
  try {
    const response = await fetch(`${SERVER_URL}/documents?pageNo=${pageNo}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
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

const getDocumentsByAreaName = async (areaName) => {
  const documents = await fetch(`${SERVER_URL}/documents/area/${areaName}`)
    .then(handleInvalidResponse)
    .then((response) => response.json())
    .then(mapAPISnippetsToSnippet);
  return documents;
};

const addDocument = async (document, token) => {
  try {
    const response = await fetch(`${SERVER_URL}/documents`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
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

const updateDocument = async (documentId, nextDocument, token) => {
  try {
    const response = await fetch(`${SERVER_URL}/documents`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(nextDocument),
    }).then(handleInvalidResponse);

    return await response;
  } catch (error) {
    console.error("Error updating document:", error.message);
    throw error; // Propagate the error to be handled by the caller
  }
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
      headers: {
        "Content-Type": "application/json",
      },
    }
  )
    .then(handleInvalidResponse)
    .then((response) => response.json())
    .then(mapAPISnippetsToSnippet);

  return response;
};

/* ************************** *
 *   Geolocation APIs   *
 * ************************** */
// Retrieve all point coordinates
const getAllGeolocatedPoints = async (token) => {
  try {
    const response = await fetch(`${SERVER_URL}/points`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    // Parse the JSON data
    const data = await response.json();

    // Check if the data is an array
    if (!Array.isArray(data)) {
      throw new Error("Response data is not an array");
    }

    // Map the data to the required format
    return data.map((item) => ({
      id: item.pointCoordinates.pointId,
      name:
        item.pointCoordinates.pointName ||
        `Point ${item.pointCoordinates.pointId}`,
      latitude: item.pointCoordinates.coordinates.latitude,
      longitude: item.pointCoordinates.coordinates.longitude,
    }));
  } catch (error) {
    console.error("Error fetching points:", error.message);
    throw error; // Re-throw the error so the caller can handle it
  }
};

// Create a new point coordinate
const addGeolocatedPoint = async (point, token) => {
  try {
    const response = await fetch(`${SERVER_URL}/points`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(point),
    });
    if (!response.ok) {
      console.error(
        "Failed to add the point:",
        response.status,
        response.statusText
      );
      throw new Error("Failed to add the point.");
    }
    const location = response.headers.get("location");
    if (!location) {
      console.error("Location header not found in response.");
      throw new Error("Location header not found in response.");
    }

    const pointId = location.split("/").pop(); // Estrarre l'ID dal percorso

    console.log(pointId);
    return pointId;
  } catch (error) {
    console.error("Error while adding point:", error);
   throw new Error("Error while adding point:", error);
  }
};

// Retrieve all areas snippets
const getAllAreasSnippets = async (token) => {
  try {
    const response = await fetch(`${SERVER_URL}/areas`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    // Parse the JSON data
    const data = await response.json();

    // Check if the data is an array
    if (!Array.isArray(data)) {
      throw new Error("Response data is not an array");
    }

    // Map the data to the required format
    return data.map((item) => ({
      id: item.area.areaId, // Unique area identifier
      name: item.area.areaName || `Area ${item.area.areaId}`, // Area name with fallback
      centroid: {
        latitude: item.area.areaCentroid.latitude,
        longitude: item.area.areaCentroid.longitude,
      }, // Extract centroid coordinates
    }));
  } catch (error) {
    console.error("Error fetching areas:", error.message);
    throw new Error("Error fetching areas"); // Re-throw the error so the caller can handle it
  }
};

// Create a new area
const addGeolocatedArea = async (area, token) => {
  try {
    console.log(area);
    const response = await fetch(`${SERVER_URL}/areas`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(area),
    });

    if (response.ok) {
      const location = response.headers.get("location");
      if (!location) {
        console.error("Location header not found in response.");
        throw new Error("Location header not found in response.");
      }
      const areaId = location.split("/").pop();
      return areaId;
    } else {
      console.error(
        "Failed to add the point:",
        response.status,
        response.statusText
      );
      throw new Error("Failed to add the point.");
    }
  } catch (error) {
    console.error("Error while adding point:", error);
    throw new Error("Error while adding area", error);
  }
};

// Retrieve the geometry of a specific area
const getAreaById = async (id, authToken) => {
  try {
    const response = await fetch(`${SERVER_URL}/areas/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if the response is OK
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    // Parse the JSON data
    const data = await response.json();

    console.log(data);
    // Map the response to the required format
    return {
      id: data.id, // Unique area identifier
      name: data.name || `Area ${data.name}`, // Area name with fallback
      centroid: {
        latitude: data.centroid.latitude,
        longitude: data.centroid.longitude,
      },
      geometry: {
        type: data.geometry.type,
        coordinates: data.geometry.coordinates.map((coord) => [
          coord.latitude,
          coord.longitude,
        ]), // Convert {latitude, longitude} to [lng, lat]
      },
    };
  } catch (error) {
    console.error("Error fetching area by ID:", error.message);
    throw new Error("Error fetching area by ID"); // Re-throw the error so the caller can handle it
  }
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
  getDocumentsByAreaName,
  addDocument,
  getDocumentById,
  updateDocument,
  deleteDocument,
  searchDocuments,
  getAllDocumentSnippetsWithLinks,
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
  getAllScales,
  addScale,
  /* File */
  uploadFiles,
  deleteFile,
  getDocumentFiles,
  downloadFile,
  logIn,
  getUserInfo,
  logOut,
  getUsers,
  getUserById,
  /* Geolocation */
  getAllGeolocatedPoints,
  addGeolocatedPoint,
  getAllAreasSnippets,
  addGeolocatedArea,
  getAreaById
};
export default API;
