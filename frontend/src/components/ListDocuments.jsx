import { useEffect, useState, useContext } from "react";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Table,
  Spinner,
} from "react-bootstrap";
import "../App.scss";
import DocumentModal from "./DocumentModal";
import API from "../API";
import LinkModal from "./LinkModal";
import FeedbackContext from "../contexts/FeedbackContext";
import Pagination from "./Pagination";
import { getIconUrlForDocument } from "../utils/iconMapping";
import LegendModal from "./Legend";

export default function ListDocuments({ shouldRefresh }) {
  const [documents, setDocuments] = useState([]);
  const [show, setShow] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [linking, setLinking] = useState(false);
  const [selectedLinkDocuments, setSelectedLinkDocuments] = useState([]);
  const [selectedDocumentToLink, setSelectedDocumentToLink] = useState(null);
  const [compactView, setCompactView] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [links, setLinks] = useState([]);
  const [showLegend, setShowLegend] = useState(false);
  const [allLinksOfSelectedDocument, setAllLinksOfSelectedDocument] = useState(
      []
  );
  const { setFeedbackFromError, setShouldRefresh, setFeedback } =
      useContext(FeedbackContext);

  useEffect(() => {
    if (linking) {
      API.getAllLinksOfDocument(selectedDocumentToLink.id)
          .then(setAllLinksOfSelectedDocument)
          .catch((error) => setFeedbackFromError(error));
    }
  }, [linking, showLinkModal]);

  useEffect(() => {
    window.scrollTo(0, 0);
    API.getDocumentsByPageNumber(currentPage)
        .then((response) => {
          setDocuments(response[0].documentSnippets);
          setTotalPages(response[0].totalPages);
        })
        .then(() => setShouldRefresh(false))
        .catch((error) => setFeedbackFromError(error));
  }, [shouldRefresh, setShouldRefresh, setFeedbackFromError]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    setShouldRefresh(true);
  };

  const handleSelection = async (document) => {
    try {
      const newDoc = await API.getDocumentById(document.id).catch((error) =>
          setFeedbackFromError(error)
      );
      setSelectedDocument(newDoc);

      if (linking) {
        const dLinks = await API.getAllLinksOfDocument(newDoc.id).catch(
            (error) => setFeedbackFromError(error)
        );
        setLinks(dLinks);
        if (
            selectedDocumentToLink &&
            document.id === selectedDocumentToLink.id
        ) {
          return;
        }
        setShowLinkModal(true);
      } else {
        setShow(true);
      }
    } catch (error) {
      setFeedbackFromError(error);
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

  const handleAdd = async (document) => {
    try {
      // Aggiungi il documento e ottieni la risposta
      const newDocResponse = await API.addDocument(document);

      /* Estrai l'ID dal documento creato
      const newDocId = newDocResponse.id || newDocResponse.data?.id;*/

      // Aggiorna la lista dei documenti
      const updatedDocuments = await API.getAllDocumentSnippets();
      setDocuments(updatedDocuments);

      // Aggiorna lo stato e fornisci feedback
      setShouldRefresh(false);
      setFeedback({ type: "success", message: "Document added successfully" });
      setShow(false);


      return newDocResponse;
    } catch (error) {
      // Gestione errori
      setFeedbackFromError(error);
      throw error; // Propaga l'errore se necessario
    }
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
    setLinking(false);
    setSelectedLinkDocuments([]);
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

  return (
      <Container fluid className="scrollable-list-documents">
        <Row>
          <h1>{linking ? "Link a Document" : "Documents"}</h1>
          <LegendModal show={showLegend} onHide={() => setShowLegend(false)} />
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
            <Button
                title={"legend"}
                className="ms-2"
                variant="secondary"
                onClick={() => {
                  setShowLegend(!showLegend);
                }}
            >
              <i className="bi bi-question-circle"></i>
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
                    documents={documents}
                    onSelect={handleSelection}
                    isLinkedDocument={isLinkedDocument}
                />
              </Row>
          ) : (
              <Row xs={1} sm={2} md={3} lg={4} className="g-4 mx-auto">
                {documents.map((document) => (
                    <DocumentSnippetCardComponent
                        key={document.id}
                        document={document}
                        isLinkedDocument={isLinkedDocument}
                        onSelect={handleSelection}
                        allLinksOfSelectedDocument={allLinksOfSelectedDocument}
                        linking={linking}
                    />
                ))}
              </Row>
          )}

          <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
          />

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
                  // handleDelete={handleDelete}
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
                  links={links}
                  selectedDocumentToLink={selectedDocumentToLink}
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
                                         documents,
                                         onSelect,
                                         isLinkedDocument,
                                       }) {
  return (
      <Table hover responsive>
        <thead>
        <tr>
          <th>Type</th>
          <th>Title</th>
          <th>Scale</th>
          <th>Issuance Date</th>
          {/* <th>Type</th> */}
        </tr>
        </thead>
        <tbody>
        {documents.map((document) => (
            <tr
                key={document.id}
                onClick={() => {
                  if (!isLinkedDocument(document)) {
                    onSelect(document);
                  }
                }}
                style={{
                  cursor: !isLinkedDocument(document) ? "pointer" : "default",
                  transition: !isLinkedDocument(document)
                      ? "transform 0.2s"
                      : "none",
                  backgroundColor: isLinkedDocument(document)
                      ? "#AAA598"
                      : "transparent",
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
                <img
                    src={getIconUrlForDocument(
                        document.type,
                        document.stakeholders
                    )}
                    alt={`${document.type} icon`}
                    style={{ width: "40px", height: "40px" }}
                />
              </td>
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
              {/* <td>{document.type}</td> */}
            </tr>
        ))}
        </tbody>
      </Table>
  );
}

DocumentSnippetTableComponent.propTypes = {
  documents: PropTypes.array.isRequired,
  onSelect: PropTypes.func.isRequired,
  isLinkedDocument: PropTypes.func.isRequired,
};

const DocumentSnippetCardComponent = ({
                                        document,
                                        isLinkedDocument,
                                        onSelect,
                                        allLinksOfSelectedDocument,
                                        linking,
                                      }) => {
  const documentLinks =
      allLinksOfSelectedDocument.find((doc) => doc.document.id === document.id)
          ?.links || [];

  const linkInitials = documentLinks.map((link) => {
    switch (link.linkType) {
      case "PREVISION":
        return "P";
      case "DIRECT_CONSEQUENCE":
        return "DC";
      case "COLLATERAL_CONSEQUENCE":
        return "CC";
      case "UPDATE":
        return "U";
      default:
        return "";
    }
  });

  return (
      <Col key={document.id}>
        <Card
            className="document-card h-100"
            style={{
              backgroundColor: isLinkedDocument(document)
                  ? "#AAA598"
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
            {linking && linkInitials.length > 0 && (
                <div
                    style={{
                      position: "absolute",
                      bottom: "8px",
                      right: "8px",
                      backgroundColor: "#e9ecef",
                      borderRadius: "4px",
                      padding: "2px 6px",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                >
                  {linkInitials.join(", ")}
                </div>
            )}
            <Card.Title className="document-card-title">
              <img
                  src={getIconUrlForDocument(document.type, document.stakeholders)}
                  alt={`${document.type} icon`}
                  style={{ width: "40px", height: "40px" }}
              />
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
            {/* <Card.Text className="document-card-text">
            <strong>Type:</strong> {document.type}
          </Card.Text> */}
          </Card.Body>
        </Card>
      </Col>
  );
};

DocumentSnippetCardComponent.propTypes = {
  document: PropTypes.object.isRequired,
  isLinkedDocument: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  allLinksOfSelectedDocument: PropTypes.array.isRequired,
  linking: PropTypes.bool.isRequired,
};