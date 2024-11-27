import { Document, DocumentSnippet } from "./model/Document.mjs";
import { User } from "./model/User.mjs";
import Stakeholder from "./model/Stakeholder.mjs";

const SERVER_URL = "http://localhost:8080/api/v1";

/* **************************** *
 *      Authentication APIs     *
 * **************************** */

// Given a credentials object containing username and passowrd it executes login
const logIn = async (credentials) => {
  console.log("API.logIn", credentials);
  return await fetch(SERVER_URL + "/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(credentials),
  })
    .then(handleInvalidResponse)
    .then((response) => response.json());
};

// Verifies if user is still logged-in. It returns a JSON with the user info
const getUserInfo = async () => {
  return await fetch(SERVER_URL + "/sessions/current", {
    credentials: "include",
  })
    .then(handleInvalidResponse)
    .then((response) => response.json);
};

// Destroys the current user's session (executing log-out)
const logOut = async () => {
  return await fetch(SERVER_URL + "/sessions/current", {
    method: "DELETE",
    credentials: "include",
  }).then(handleInvalidResponse);
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

/* ********************* *
 *       Link APIs       *
 * ********************* */

const createLink = async (document, linkedDocument) => {
  const requestBody = {
    type: linkedDocument.linkType.toUpperCase(),
    linkId: null,
    documentId: linkedDocument.document.id,
  };
  requestBody.type = linkedDocument.linkType.toUpperCase().replace(/ /g, "_");
  try {
    const response = await fetch(
      `${SERVER_URL}/documents/${document.id}/links`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(requestBody),
      }
    );

    if (response.ok) {
      const responseData =
        response.status !== 201 ? await response.json() : null;
      console.log("Link creato con successo:", responseData);
    } else {
      console.error(
        "Errore nella creazione del link:",
        response.status,
        response.statusText
      );
    }
  } catch (error) {
    console.error("Errore nella richiesta:", error);
  }
};

// Retrieve all links of a document
const getAllLinksOfDocument = async (documentId) => {
  const links = await fetch(
    `${SERVER_URL}/api/v1/documents/${documentId}/links`
  )
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
    credentials: "include",
    body: JSON.stringify(updatedLink),
  }).then(handleInvalidResponse);
};

// Delete a link for a document
const deleteLink = async (documentId, linkId) => {
  return await fetch(
    `${SERVER_URL}/api/v1/documents/${documentId}/links/${linkId}`,
    {
      method: "DELETE",
      credentials: "include",
    }
  ).then(handleInvalidResponse);
};

/* ************************** *
 *       Documents APIs       *
 * ************************** */

// Retrieve all documents snippets
const getAllDocumentSnippets = async (filter) => {
  const documents = await fetch(`${SERVER_URL}/documents`)
    .then(handleInvalidResponse)
    .then((response) => response.json())
    .then((jsonArray) => jsonArray.map(DocumentSnippet.fromJson));
  return documents;
};

// Create a new document
const addDocument = async (document) => {
  console.log("ADD DOCUMENT: ", document);
  return await fetch(`${SERVER_URL}/documents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
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
    .then(Document.fromJson);
  return document;
};

// Update a document given its id
const updateDocument = async (documentId, nextDocument) => {
  return await fetch(`${SERVER_URL}/documents`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(nextDocument),
  }).then(handleInvalidResponse);
};

// Delete a document given its id
const deleteDocument = async (documentId) => {
  return await fetch(`${SERVER_URL}/documents/${documentId}`, {
    method: "DELETE",
    credentials: "include",
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
  if (!response.ok) {
    throw Error(response.statusText);
  }
  let type = response.headers.get("content-type");
  if (type != null && type.indexOf("application/json") === -1) {
    throw new TypeError(`Expected JSON, got ${type}`);
  }
  return response;
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
