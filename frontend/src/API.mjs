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
  console.log("ADD DOCUMENT: ", document);
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

const stakeholders = [
  { id: 1, name: "LKAB" },
  { id: 2, name: "Municipality" },
  { id: 3, name: "Regional authority" },
  { id: 4, name: "Architecture firms" },
  { id: 5, name: "Citizen" },
];

// // Retrieve all stakeholders
const getAllStakeholders = async () => {
  // const stakeholders = await fetch(`${SERVER_URL}/stakeholders`)
  //   .then(handleInvalidResponse)
  //   .then((response) => response.json())
  //   .then(mapAPIStakeholdersToStakeholders);
  const sh = [];
  stakeholders.forEach((s) => sh.push(Stakeholder.fromJSON(s)));
  return sh;
};

// Create a new stakeholder
const addStakeholder = async (stakeholder) => {
  //   return await fetch(`${SERVER_URL}/stakeholders`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(stakeholder),
  //   }).then(handleInvalidRiesponse);
  const existingStakeholder = stakeholders.find((s) => s.name === stakeholder);
  if (!existingStakeholder) {
    const newId = stakeholders.length
      ? stakeholders[stakeholders.length - 1].id + 1
      : 1;
    const newStakeholder = { id: newId, name: stakeholder };
    stakeholders.push(newStakeholder);
  }
};

// Retrieve a stakeholder by id
const getStakeholderById = async (stakeholderId) => {
  //   const stakeholder = await fetch(`${SERVER_URL}/stakeholders/${stakeholderId}`)
  //     .then(handleInvalidResponse)
  //     .then((response) => response.json());
  //   return stakeholder;
  return Stakeholder.fromJSON(
    stakeholders.find((stakeholder) => stakeholder.id === stakeholderId)
  );
};

// Update a stakeholder given its id
const updateStakeholder = async (stakeholderId, nextStakeholder) => {
  //   return await fetch(`${SERVER_URL}/stakeholders/`, {
  //     method: "PUT",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify(nextStakeholder),
  //   }).then(handleInvalidResponse);
  const index = stakeholders.findIndex(
    (stakeholder) => stakeholder.id === stakeholderId
  );
  if (index !== -1) {
    stakeholders[index] = nextStakeholder;
  }
};

// Delete a stakeholder given its id
const deleteStakeholder = async (stakeholderId) => {
  //   return await fetch(`${SERVER_URL}/stakeholders/${stakeholderId}`, {
  //     method: "DELETE",
  //   }).then(handleInvalidResponse);
  const index = stakeholders.findIndex(
    (stakeholder) => stakeholder.id === stakeholderId
  );
  if (index !== -1) {
    stakeholders.splice(index, 1);
  }
};

/* ************************** *
 *     Document Type APIs     *
 * ************************** */
const documentTypes = [
  { id: 1, name: "Design document" },
  { id: 2, name: "Material effect" },
  { id: 3, name: "Technical document" },
  { id: 4, name: "Prescriptive document" },
  { id: 5, name: "Informative document" },
]

// Retrieve all document types
const getAllDocumentTypes = async () => {
  const dt = [];
  documentTypes.forEach((t) => dt.push(DocumentType.fromJSON(t)));
  return dt;
}

// Create a new document type
const addDocumentType = async (documentType) => {
  const existingDocumentType = documentTypes.find((t) => t.name === documentType);
  if (!existingDocumentType) {
    const newId = documentTypes.length
      ? documentTypes[documentTypes.length - 1].id + 1
      : 1;
    const newDocumentType = { id: newId, name: documentType };
    documentTypes.push(newDocumentType);
  }
}

// Retrieve a document type by id
const getDocumentTypeById = async (documentTypeId) => {
  return DocumentType.fromJSON(
    documentTypes.find((documentType) => documentType.id === documentTypeId)
  );
}

// Update a document type given its id
const updateDocumentType = async (documentTypeId, nextDocumentType) => {
  const index = documentTypes.findIndex(
    (documentType) => documentType.id === documentTypeId
  );
  if (index !== -1) {
    documentTypes[index] = nextDocumentType;
  }
}

// Delete a document type given its id
const deleteDocumentType = async (documentTypeId) => {
  const index = documentTypes.findIndex(
    (documentType) => documentType.id === documentTypeId
  );
  if (index !== -1) {
    documentTypes.splice(index, 1);
  }
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
  getStakeholderById,
  updateStakeholder,
  deleteStakeholder,
  /* Link */
  createLink,
  getAllLinksOfDocument,
  updateLink,
  deleteLink,
  /* Document Type */
  getAllDocumentTypes,
  addDocumentType,
  getDocumentTypeById,
  updateDocumentType,
  deleteDocumentType,
  /* Scale */
  getAllScales,
  addScale,
  getScaleById,
  updateScale,
  deleteScale,
};
export default API;
