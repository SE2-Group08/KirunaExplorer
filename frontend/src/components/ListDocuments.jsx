import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
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
import API from "../API";
import LinkModal from "./LinkModal";
import FeedbackContext from "../contexts/FeedbackContext";
import Pagination from "./Pagination";
import { getIconUrlForDocument } from "../utils/iconMapping";
import LegendModal from "./Legend";
import DocumentFormComponent from "./DocumentForm";
import DocumentDescriptionComponent from "./DocumentDescription";
import SearchBar from "./SearchBar"; // Import the updated SearchBar component

export default function ListDocuments({
  shouldRefresh,
  loggedIn,
  isUrbanPlanner,
  authToken,
}) {
  const [allDocuments, setAllDocuments] = useState([]);
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDescriptionModal, setShowDescriptionModal] = useState(false);
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [showLegendModal, setShowLegendModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [linking, setLinking] = useState(false);
  const [selectedLinkDocuments, setSelectedLinkDocuments] = useState([]);
  const [selectedDocumentToLink, setSelectedDocumentToLink] = useState(null);
  const [compactView, setCompactView] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [links, setLinks] = useState([]);
  const [allLinksOfSelectedDocument, setAllLinksOfSelectedDocument] = useState(
    []
  );
  const navigate = useNavigate();
  const { setFeedbackFromError, setShouldRefresh } =
    useContext(FeedbackContext);

  useEffect(() => {
    if (!loggedIn || !isUrbanPlanner) {
      navigate("/login");
    }
  }, [loggedIn, isUrbanPlanner, navigate]);

  useEffect(() => {
    // Scroll to top of the page
    window.scrollTo(0, 0);

    // Fetch documents by page number
    API.getDocumentsByPageNumber(currentPage, authToken)
      .then((response) => {
        setAllDocuments(response[0].documentSnippets);
        setFilteredDocuments(response[0].documentSnippets); // Initialize filtered documents
        setTotalPages(response[0].totalPages);
      })
      .then(() => setShouldRefresh(false))
      .catch((error) => setFeedbackFromError(error));

    // Fetch all links of the selected document if linking is true
    if (linking) {
      API.getAllLinksOfDocument(selectedDocumentToLink.id, authToken)
        .then(setAllLinksOfSelectedDocument)
        .catch((error) => setFeedbackFromError(error));
    }
  }, [
    linking,
    showLinkModal,
    shouldRefresh,
    setShouldRefresh,
    setFeedbackFromError,
    currentPage,
    // selectedDocumentToLink.id,
  ]);

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
        const dLinks = await API.getAllLinksOfDocument(
          newDoc.id,
          authToken
        ).catch((error) => setFeedbackFromError(error));
        setLinks(dLinks);
        if (
          selectedDocumentToLink &&
          document.id === selectedDocumentToLink.id
        ) {
          return;
        }
        setShowLinkModal(true);
      } else {
        setShowDescriptionModal(true);
      }
    } catch (error) {
      setFeedbackFromError(error);
    }
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

  const handleSearchInput = ({
    keyword = "",
    documentTypes = [],
    stakeholders = [],
    scales = [],
  }) => {
    const lowerCaseKeyword = keyword.toLowerCase();

    const filtered = allDocuments.filter((doc) => {
      const matchesKeyword =
        !keyword || doc.title.toLowerCase().includes(lowerCaseKeyword);
      const matchesDocumentTypes =
        documentTypes.length === 0 || documentTypes.includes(doc.type);
      const matchesStakeholders =
        stakeholders.length === 0 ||
        stakeholders.some((id) => doc.stakeholders.includes(id));
      const matchesScales = scales.length === 0 || scales.includes(doc.scale);

      return (
        matchesKeyword &&
        matchesDocumentTypes &&
        matchesStakeholders &&
        matchesScales
      );
    });

    setFilteredDocuments(filtered);
  };

  const handleSearch = async ({
    keyword = "",
    documentTypes = [],
    stakeholders = [],
    scales = [],
  }) => {
    try {
      const params = new URLSearchParams();
      if (keyword) params.append("keyword", keyword);
      if (documentTypes.length > 0)
        params.append("type", documentTypes.join(","));
      if (stakeholders.length > 0)
        params.append("stakeholderNames", stakeholders.join(","));
      if (scales.length > 0) params.append("scale", scales.join(","));

      const response = await API.searchDocuments(params.toString());
      setAllDocuments(response); // Update the master list with backend results
      setFilteredDocuments(response); // Update the filtered list
    } catch (error) {
      setFeedbackFromError(error);
    }
  };

  let content;

  if (!allDocuments) {
    content = (
      <Spinner animation="border" className="mx-auto">
        <output className="visually-hidden">Loading...</output>
      </Spinner>
    );
  } else if (allDocuments.length === 0) {
    content = (
      <>
        <p className="text-center">
          No document has been stored yet.
        </p>
        {loggedIn && isUrbanPlanner && (
          <p className="text-center">Click on the plus button in the top right to add a new one</p>
        )}
      </>
    );
  } else if (compactView) {
    content = (
      <Row className="g-4 mx-auto">
        <DocumentSnippetTableComponent
          documents={filteredDocuments}
          onSelect={handleSelection}
          isLinkedDocument={isLinkedDocument}
          allLinksOfSelectedDocument={allLinksOfSelectedDocument}
          linking={linking}
        />
      </Row>
    );
  } else {
    content = (
      <Row xs={1} sm={2} md={3} lg={4} className="g-4 mx-auto">
        {filteredDocuments.map((document) => (
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
    );
  }

  return (
    <Container fluid className="scrollable-list-documents">
      <Row>
        <Col>
          <h1>{linking ? "Link a Document" : "Documents"}</h1>
          <LegendModal
            show={showLegendModal}
            onHide={() => setShowLegendModal(false)}
          />
        </Col>
        <Col xs="auto">
          {linking ? (
            <Button
              title="Confirm links"
              className="me-4"
              variant="success"
              onClick={handleCompleteLink}
            >
              <i className="bi bi-check-square"></i>
            </Button>
          ) : (
            <Button
              title="Add new document"
              className="me-4"
              variant="primary"
              onClick={() => {
                setShowFormModal(true);
              }}
            >
              <i className="bi bi-plus-square"></i>
            </Button>
          )}
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
              setShowLegendModal(!showLegendModal);
            }}
          >
            <i className="bi bi-question-circle"></i>
          </Button>
        </Col>
      </Row>

      {/* SearchBar Component */}
      <Row className="my-4">
        <Col>
          <SearchBar
            onSearch={handleSearch}
            onRealTimeSearch={handleSearchInput}
          />
        </Col>
      </Row>

      <Row className="g-2 mx-auto" style={{ width: "100%" }}>
        {content}
      </Row>

      {totalPages > 1 && (
        <Row className="mt-4">
          <Col>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </Col>
        </Row>
      )}

      {/* Modal for viewing a document's description */}
      {selectedDocument && (
        <DocumentDescriptionComponent
          onLinkToClick={handleLinkToClick}
          show={showDescriptionModal}
          onHide={() => {
            setSelectedDocument(null);
            setShowDescriptionModal(false);
          }}
          document={selectedDocument}
          onSnippetClick={handleSelection}
          // handleDelete={handleDelete}
          authToken={authToken}
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
          authToken={authToken}
        />
      )}
      {showFormModal && (
        <DocumentFormComponent
          document={undefined}
          show={showFormModal}
          onHide={() => setShowFormModal(false)}
          authToken={authToken}
        />
      )}
    </Container>
  );
}

ListDocuments.propTypes = {
  shouldRefresh: PropTypes.bool.isRequired,
  loggedIn: PropTypes.bool.isRequired,
  isUrbanPlanner: PropTypes.bool.isRequired,
  authToken: PropTypes.string,
};

function DocumentSnippetTableComponent({
  documents,
  onSelect,
  isLinkedDocument,
  // allLinksOfSelectedDocument,
  // linking,
}) {
  // const documentLinks =
  //   allLinksOfSelectedDocument.find((doc) => doc.document.id === document.id)
  //     ?.links || [];

  // const linkInitials = documentLinks.map((link) => {
  //   switch (link.linkType) {
  //     case "PREVISION":
  //       return "P";
  //     case "DIRECT_CONSEQUENCE":
  //       return "DC";
  //     case "COLLATERAL_CONSEQUENCE":
  //       return "CC";
  //     case "UPDATE":
  //       return "U";
  //     default:
  //       return "";
  //   }
  // });
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
              border: isLinkedDocument(document) ? "4px solid #AAA598" : "none",
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
            {/* {linking && linkInitials.length > 0 ? (
              <td>{linkInitials.join(", ")}</td>
            ) : (
              ""
            )} */}
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

export const DocumentSnippetCardComponent = ({
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
