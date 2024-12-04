import { useEffect, useState } from "react";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import { Container, Row, Col, Card, Button, Table, Spinner } from "react-bootstrap";
import "../App.css";
import DocumentModal from "./DocumentModal";
import API from "../API";
import LinkModal from "./LinkModal";
import { useContext } from "react";
import FeedbackContext from "../contexts/FeedbackContext";
import SearchBar from "./SearchBar.jsx";

export default function ListDocuments({ shouldRefresh }) {
  const [documents, setDocuments] = useState([]);
  const [show, setShow] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [linking, setLinking] = useState(false);
  const [selectedLinkDocuments, setSelectedLinkDocuments] = useState([]);
  const [selectedDocumentToLink, setSelectedDocumentToLink] = useState(null);
  const [compactView, setCompactView] = useState(false);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const { setFeedbackFromError, setShouldRefresh, setFeedback } =
    useContext(FeedbackContext);

  useEffect(() => {
    if (shouldRefresh) {
      API.getAllDocumentSnippets()
        .then((docs) => {
          setDocuments(docs);
          setFilteredDocuments(docs);
        })
        .then(() => setShouldRefresh(false))
        .catch((error) => setFeedbackFromError(error));
    }
  }, [shouldRefresh, setShouldRefresh, setFeedbackFromError]);

  const handleSelection = async (document) => {
    const newDoc = await API.getDocumentById(document.id).catch((error) =>
      setFeedbackFromError(error)
    );
    setSelectedDocument(newDoc);
    if (linking) {
      if (
        selectedDocumentToLink &&
        document.id === selectedDocumentToLink?.id
      ) {
        return;
      }
      const alreadySelected = selectedLinkDocuments.some(
        (doc) => doc.document.id === document.id
      );
      if (alreadySelected) {
        setSelectedLinkDocuments((prevDocuments) =>
          prevDocuments.filter((doc) => doc.document.id !== document.id)
        );
      } else {
        setShowLinkModal(true);
        setSelectedDocument(newDoc);
      }
    } else {
      setSelectedDocument(newDoc);
      setShow(true);
    }
  };

  const handleSave = (document) => {
    API.updateDocument(document.id, document)
      .then(() => API.getAllDocumentSnippets().then(setDocuments))
      .then(() => setShouldRefresh(false))
      .then(() =>
        setFeedback({
          type: "success",
          message: "Document updated successfully",
        })
      )
      .catch((error) =>
        setFeedbackFromError(error)
      );
    setShow(false);
    setShouldRefresh(true);
  };

  const handleAdd = (document) => {
    API.addDocument(document)
      .then(() => API.getAllDocumentSnippets().then(setDocuments))
      .then(() => setShouldRefresh(false))
      .then(() =>
        setFeedback({ type: "success", message: "Document added successfully" })
      )
      .catch((error) =>
        setFeedbackFromError(error)
      );
    setShow(false);
    setShouldRefresh(true);
  };

  const handleDelete = (documentId) => {
    API.deleteDocument(documentId)
      .then(() => API.getAllDocumentSnippets().then(setDocuments))
      .then(() => setShouldRefresh(false))
      .then(() =>
        setFeedback({
          type: "success",
          message: "Document deleted successfully",
        })
      )
      .catch((error) =>
        setFeedbackFromError(error)
      );
    setShow(false);
    setShouldRefresh(true);
  };

  const handleLinkToClick = () => {
    setSelectedDocumentToLink(selectedDocument);
    setLinking(true);
  };

  const handleLinkConfirm = (linkedDocument) => {
    setSelectedLinkDocuments((prev) => [...prev, linkedDocument]);
    setShowLinkModal(false);
  };

  const handleCompleteLink = async () => {
    try {
      await Promise.all(
        selectedLinkDocuments.map((linkedDoc) =>
          API.createLink(selectedDocumentToLink, linkedDoc)
        )
      );
      setFeedback({ type: "success", message: "Document linked successfully" });
      setShouldRefresh(true);
      setLinking(false);
      setSelectedLinkDocuments([]);
    } catch (error) {
      setFeedbackFromError(error);
    }
  };

  const isLinkedDocument = (document) => {
    return (
      linking &&
      (selectedLinkDocuments.some((doc) => doc.id === document.id) ||
        selectedDocumentToLink?.id === document.id)
    );
  };

  const handleExitLinkMode = () => {
    setLinking(false);
    setSelectedLinkDocuments([]);
  };


  const handleSearch = (keyword) => {
    if (!keyword) {
      setFilteredDocuments(documents);
      return;
    }

    API.searchDocuments(keyword)
        .then((data) => {
          setFilteredDocuments(data);
          console.log("Filtered documents: ", data);
        })
        .catch((error) => {
          setFeedbackFromError(error);
        });
  };
  return (
    <Container fluid className="scrollable-list-documents">
      <Row>
        <Col xs={6}>
          <h1>{linking ? "Link a Document" : "Documents"}</h1>
        </Col>
        <Col xs={6}>
          <SearchBar onSearch={handleSearch}/>
        </Col>
      </Row>
      <Row className="d-flex justify-content-between align-items-center mb-3">
        {linking ? (
          <p>Choose the document you want to link</p>
        ) : (
          <>
            <p>
              Here you can find all the documents about Kiruna&apos;s relocation
              process.
            </p>
            <p>Click on a document to see more details.</p>
          </>
        )}
      </Row>
      <Row className="d-flex justify-content-between align-items-center mb-3">
        <Col xs="auto">
          {linking ? (
            <>
              <Button
                title="Confirm links"
                variant="success"
                onClick={handleCompleteLink}
              >
                <i className="bi bi-check-square"></i>
              </Button>
              <Button
                title="Exit link mode"
                variant="secondary"
                onClick={() => {
                  handleExitLinkMode();
                }}
                className="ms-2"
              >
                <i className="bi bi-box-arrow-left"></i>
              </Button>
            </>
          ) : (
            <Button
              title="Add new document"
              variant="primary"
              onClick={() => {
                setSelectedDocument({ isEditable: true });
                setShow(true);
              }}
            >
              <i className="bi bi-plus-square"></i>
            </Button>
          )}
        </Col>
        <Col xs="auto">
          <Button
            title={compactView ? "List view" : "Card view"}
            variant="secondary"
            onClick={() => setCompactView(!compactView)}
          >
            {compactView ? (
              <i className="bi bi-card-heading"></i>
            ) : (
              <i className="bi bi-list"></i>
            )}
          </Button>
        </Col>
      </Row>
      <Row className="g-2 mx-auto" style={{ width: "100%" }}>
        {documents.length === 0 ? (
          <Spinner animation="border" role="status" className="mx-auto">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : compactView ? (
          <Row className="g-4 mx-auto">
            <DocumentSnippetTableComponent
              documents={filteredDocuments}
              onSelect={handleSelection}
              isLinkedDocument={isLinkedDocument}
            />
          </Row>
        ) : (
          <Row xs={1} sm={2} md={3} lg={4} className="g-4 mx-auto">
            {filteredDocuments.map((document) => (
              <DocumentSnippetCardComponent
                key={document.id}
                document={document}
                isLinkedDocument={isLinkedDocument}
                onSelect={handleSelection}
              />
            ))}
          </Row>
        )}
        {/* Modals for viewing, adding, or linking documents */}
        {selectedDocument && (
          <DocumentModal
            onLinkToClick={handleLinkToClick}
            show={show}
            onHide={() => {
              setSelectedDocument(null);
              setShow(false);
            }}
            document={selectedDocument}
            handleSave={handleSave}
            handleDelete={handleDelete}
            handleAdd={handleAdd}
            onSnippetClick={handleSelection}
          />
        )}
        {selectedDocumentToLink && showLinkModal && (
          <LinkModal
            showModal={showLinkModal}
            handleClose={() => {
              setSelectedDocument(null);
              setShowLinkModal(false);
            }}
            setSelectedLinkDocuments={setSelectedLinkDocuments}
            selectedLinkDocuments={selectedLinkDocuments}
            document={selectedDocument}
            onLinkConfirm={handleLinkConfirm}
          />
        )}
      </Row>
    </Container>
  );
}

ListDocuments.propTypes = {
  thinCardLayout: PropTypes.bool,
  shouldRefresh: PropTypes.bool.isRequired,
};

function DocumentSnippetTableComponent({
  filteredDocuments,
  onSelect,
  isLinkedDocument,
}) {
  return (
    <Table hover responsive>
      <thead>
        <tr>
          <th>Title</th>
          <th>Scale</th>
          <th>Issuance Date</th>
          <th>Type</th>
        </tr>
      </thead>
      <tbody>
        {filteredDocuments.map((document) => (
          <tr
            key={document.id}
            onClick={() => {
              if (!isLinkedDocument(document)) {
                onSelect(document);
              }
            }}
            style={{
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!isLinkedDocument(document)) {
                e.currentTarget.style.transform = "scale(1.02)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLinkedDocument(document)) {
                e.currentTarget.style.transform = "scale(1)";
              }
            }}
          >
            <td>
              <em>{document.title}</em>
            </td>
            <td>{document.scale}</td>
            <td>
              {dayjs(document.issuanceDate).format(
                document.issuanceDate.length === 4
                  ? "YYYY"
                  : document.issuanceDate.length === 7
                  ? "MM/YYYY"
                  : "DD/MM/YYYY"
              )}
            </td>
            <td>{document.type}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}

DocumentSnippetTableComponent.propTypes = {
  filteredDocuments: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  isLinkedDocument: PropTypes.func.isRequired,
};

const DocumentSnippetCardComponent = ({
  document,
  isLinkedDocument,
  onSelect,
}) => {
  return (
    <Col key={document.id}>
      <Card
        className="document-card h-100"
        style={{
          backgroundColor: isLinkedDocument(document)
            ? "#b1b1aa"
            : "transparent",
        }}
        onClick={() => {
          if (!isLinkedDocument(document)) {
            onSelect(document);
          }
        }}
        disabled={isLinkedDocument(document)}
        onMouseEnter={(e) => {
          if (!isLinkedDocument(document)) {
            e.currentTarget.style.transform = "scale(1.02)";
          }
        }}
        onMouseLeave={(e) => {
          if (!isLinkedDocument(document)) {
            e.currentTarget.style.transform = "scale(1)";
          }
        }}
      >
        <Card.Body>
          <Card.Title className="document-card-title">
            {document.title}
          </Card.Title>
          <div className="divider" />
          <Card.Text className="document-card-text">
            <strong>Scale:</strong> {document.scale}
          </Card.Text>
          <Card.Text className="document-card-text">
            <strong>Issuance Date:</strong>{" "}
            {dayjs(document.issuanceDate).format(
              document.issuanceDate.length === 4
                ? "YYYY"
                : document.issuanceDate.length === 7
                ? "MM/YYYY"
                : "DD/MM/YYYY"
            )}
          </Card.Text>
          <Card.Text className="document-card-text">
            <strong>Type:</strong> {document.type}
          </Card.Text>
        </Card.Body>
      </Card>
    </Col>
  );
};

DocumentSnippetCardComponent.propTypes = {
  document: PropTypes.object.isRequired,
  isLinkedDocument: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
};
