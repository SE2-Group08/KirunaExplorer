import { Document, DocumentSnippet } from "./model/Document.mjs";
import Stakeholder from "./model/Stakeholder.mjs";
import { DocumentType } from "./model/DocumentType.mjs";
import { Scale } from "./model/Scale.mjs";

const SERVER_URL = "http://localhost:8080/api/v1";

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
  console.log(document.id);
  try {
    const response = await fetch(
      `${SERVER_URL}/documents/${document.id}/links`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
    body: JSON.stringify(updatedLink),
  }).then(handleInvalidResponse);
};

// Delete a link for a document
const deleteLink = async (documentId, linkId) => {
  return await fetch(
    `${SERVER_URL}/api/v1/documents/${documentId}/links/${linkId}`,
    {
      method: "DELETE",
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
    .then(mapAPISnippetsToSnippet);
  return documents;
};

// Create a new document
const addDocument = async (document) => {
  return await fetch(`${SERVER_URL}/documents`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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

// Update a document given its id
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

/* ************************** *
 *      Stakeholders APIs     *
 * ************************** */

// // Retrieve all stakeholders
const getAllStakeholders = async () => {
  const stakeholders = await fetch(`${SERVER_URL}/stakeholders`)
    .then(handleInvalidResponse)
    .then((response) => response.json())
    .then(stakeholders => stakeholders.map(stakeholder => Stakeholder.fromJSON(stakeholder)));
  return stakeholders
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
    .then(documentTypes => documentTypes.map(documentType => DocumentType.fromJSON(documentType)));
    console.log(documentTypes);
  return documentTypes;
}

// Create a new document type
const addDocumentType = async (documentType) => {
  return await fetch(`${SERVER_URL}/document-types`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(documentType),
  }).then(handleInvalidResponse);
}

/* ************************** *
  *       Scale APIs      *
  * ************************** */

const scales = [
  { id: 1, name: "Blueprint/Material effects" },
  { id: 2, name: "Text" },
  { id: 3, name: "1:1" },
  { id: 4, name: "1:100" },
  { id: 5, name: "1:1000" },
]

// Retrieve all scales
const getAllScales = async () => {
  const sc = [];
  scales.forEach((s) => sc.push(Scale.fromJSON(s)));
  sc.sort((a, b) => {
    const isANumeric = /^\d+:\d+$/.test(a.name);
    const isBNumeric = /^\d+:\d+$/.test(b.name);

    if (!isANumeric && !isBNumeric) {
      return a.name.localeCompare(b.name);
    } else if (!isANumeric) {
      return -1;
    } else if (!isBNumeric) {
      return 1;
    } else {
      const aValue = parseInt(a.name.split(":")[1], 10);
      const bValue = parseInt(b.name.split(":")[1], 10);
      return aValue - bValue;
    }
  });
  return sc;
}

// Create a new scale
const addScale = async (scale) => {
  const existingScale = scales.find((s) => s.name === scale);
  if (!existingScale) {
    const newId = scales.length
      ? scales[scales.length - 1].id + 1
      : 1;
    const newScale = { id: newId, name: scale };
    scales.push(newScale);
  }
}

// Retrieve a scale by id
const getScaleById = async (scaleId) => {
  return Scale.fromJSON(
    scales.find((scale) => scale.id === scaleId)
  );
}

// Update a scale given its id
const updateScale = async (scaleId, nextScale) => {
  const index = scales.findIndex(
    (scale) => scale.id === scaleId
  );
  if (index !== -1) {
    scales[index] = nextScale;
  }
}

// Delete a scale given its id
const deleteScale = async (scaleId) => {
  const index = scales.findIndex(
    (scale) => scale.id === scaleId
  );
  if (index !== -1) {
    scales.splice(index, 1);
  }
}

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
  updateLink,
  deleteLink,
  /* Document Type */
  getAllDocumentTypes,
  addDocumentType,
  /* Scale */
  getAllScales,
  addScale,
  getScaleById,
  updateScale,
  deleteScale,
};
export default API;
