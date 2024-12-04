import { Document, DocumentSnippet } from "./model/Document.mjs";
import Stakeholder from "./model/Stakeholder.mjs";

const SERVER_URL = "http://localhost:8080/api/v1";

/* **************************** *
 *      Authentication APIs     *
 * **************************** */

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

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message || "Login failed. Please check your credentials.";
      throw new Error(errorMessage);
    }

    const data = await response.json();

    const token = data.token;
    if (token) {
      localStorage.setItem("authToken", token);
    }

    return data;
  } catch (error) {
    throw error;
  }
};



const getUserInfo = async () => {
  return !!localStorage.getItem("authToken");
};

const logOut = async () => {
  const token = localStorage.getItem("authToken"); // Retrieve the token

  if (!token) {
    console.warn("No token found. User may already be logged out.");
    return; // Exit early if no token is available
  }

  try {
    // Remove token from storage after successful logout
    localStorage.removeItem("authToken");
    console.log("User successfully logged out.");
  } catch (error) {
    console.error("Error during logout:", error);
  }
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
 *       Link APIs      *
 * ************************** */

const createLink = async (document, linkedDocument) => {
  console.log("CREATE LINK: ", document, linkedDocument);
  const requestBody = {
    type: linkedDocument.linkType.toUpperCase(),
    linkId: null,
    documentId: linkedDocument.document.id,
  };
  console.log("REQUEST BODY: ", requestBody);

  // ("REQUEST BODY: ", requestBody);
  requestBody.type = linkedDocument.linkType.toUpperCase().replace(/ /g, "_");
  console.log(document.id)
  try {
    const response = await fetch(`${SERVER_URL}/documents/${document.id}/links`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody)
    });

    if (response.ok) {
      const responseData = response.status !== 201 ? await response.json() : null;
      console.log("Link creato con successo:", responseData);
    } else {
      console.error("Errore nella creazione del link:", response.status, response.statusText);
    }
  } catch (error) {
    console.error("Errore nella richiesta:", error);
  }
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
  return await fetch(`${SERVER_URL}/documents/${documentId}/links`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(updatedLink),
  }).then(handleInvalidResponse);
};

// Delete a link for a document
const deleteLink = async (documentId, linkId) => {
  return await fetch(`${SERVER_URL}/documents/${documentId}/links/${linkId}`, {
    method: "DELETE",
  }).then(handleInvalidResponse);
};

/* ************************** *
 *       Documents APIs       *
 * ************************** */

// Retrieve all documents snippets
const getAllDocumentSnippets = async (filter) => {
  const documents = await fetch(`${SERVER_URL}/documents`)
    .then(handleInvalidResponse)
    .then((response) => response.json())
    .then(mapAPISnippetsToSnippet);
  return documents;
};

// Create a new document
const addDocument = async (document) => {
  const token = localStorage.getItem("authToken");
  return await fetch(`${SERVER_URL}/documents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    credentials: "include",
    body: JSON.stringify(document),
  }).then(handleInvalidResponse);
};

// Retrieve a document by id
const getDocumentById = async (documentId) => {
  const document = await fetch(`${SERVER_URL}/documents/${documentId}`)
    .then(handleInvalidResponse)
    .then((response) => response.json())
    .then(mapAPIDocumentToDocument);
  return document;
};

// Update a document (PUT request without an ID in the URL)
const updateDocument = async (nextDocument) => {
  const token = localStorage.getItem("authToken");

  // Ensure token exists before making the request
  if (!token) {
    throw new Error("Unauthorized: No auth token found. Please log in.");
  }

  try {
    const response = await fetch(`${SERVER_URL}/documents`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      credentials: "include",
      body: JSON.stringify(nextDocument),
    });

    // Check if response is OK (status code 200-299)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update document.");
    }

    // Return response data
    return await response.json();
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

// /* ************************** *
//  *      Stakeholders APIs     *
//  * ************************** */

// // Retrieve all stakeholders
// const getAllStakeholders = async () => {
//   const stakeholders = await fetch(`${SERVER_URL}/stakeholders`)
//     .then(handleInvalidResponse)
//     .then((response) => response.json())
//     .then(mapAPIStakeholdersToStakeholders);
//   return stakeholders;
// };

// // Create a new stakeholder
// const addStakeholder = async (stakeholder) => {
//   return await fetch(`${SERVER_URL}/stakeholders`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(stakeholder),
//   }).then(handleInvalidResponse);
// };

// // Retrieve a stakeholder by id
// const getStakeholderById = async (stakeholderId) => {
//   const stakeholder = await fetch(`${SERVER_URL}/stakeholders/${stakeholderId}`)
//     .then(handleInvalidResponse)
//     .then((response) => response.json());
//   return stakeholder;
// };

// // Update a stakeholder given its id
// const updateStakeholder = async (stakeholderId, nextStakeholder) => {
//   return await fetch(`${SERVER_URL}/stakeholders/`, {
//     method: "PUT",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(nextStakeholder),
//   }).then(handleInvalidResponse);
// };

// // Delete a stakeholder given its id
// const deleteStakeholder = async (stakeholderId) => {
//   return await fetch(`${SERVER_URL}/stakeholders/${stakeholderId}`, {
//     method: "DELETE",
//   }).then(handleInvalidResponse);
// };

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
  getAllDocumentSnippets,
  addDocument,
  getDocumentById,
  updateDocument,
  deleteDocument,
  // getAllStakeholders,
  // addStakeholder,
  // getStakeholderById,
  // updateStakeholder,
  // deleteStakeholder,
  createLink,
  getAllLinksOfDocument,
  updateLink,
  deleteLink,
  logIn,
  getUserInfo,
  logOut,
  getUsers,
  getUserById,
};
export default API;
