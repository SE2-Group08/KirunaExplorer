import { useState, useEffect, useContext } from "react";
import PropTypes from "prop-types";
import { Button, Card, Row, Col, ListGroup } from "react-bootstrap";
import API from "../API.mjs";
import "../App.scss";
import FeedbackContext from "../contexts/FeedbackContext.js";
import { getIconUrlForDocument } from "../utils/iconMapping"; // Import the icon mapping utility

const ListDocumentLinks = ({
  documentId,
  isOpen,
  onClose,
  onSnippetClick,
  authToken,
}) => {
  const [snippets, setSnippets] = useState([]);
  const { setFeedbackFromError } = useContext(FeedbackContext);

  useEffect(() => {
    if (isOpen) {
      API.getAllLinksOfDocument(documentId, authToken)
          .then((response) => {
            setSnippets(response);
          })
          .catch((error) => {
            setFeedbackFromError(error)
          });
    }
  }, [isOpen]);

  return (
    <div className={`slider ${isOpen ? "open" : ""}`}>
      <button
        type="button"
        className="btn-close"
        aria-label="Close"
        onClick={onClose}
        style={{ position: "absolute", top: "20px", right: "10px" }}
      ></button>
      <div className="snippet-list">
        <Row xs={1} className="g-4" style={{ width: "100%" }}>
          <Card.Title>Linked documents</Card.Title>
          {snippets.length ? (
            snippets.map((snippet, index) => (
              <Col key={index}>
                <Card className="document-card slider-card">
                  <Card.Body>
                    <Card.Title className="document-card-title">
                      <img
                        src={getIconUrlForDocument(
                          snippet.document.type,
                          snippet.document.stakeholders
                        )}
                        alt="Document Icon"
                        className="me-2"
                        style={{ width: "40px", height: "40px" }}
                      />
                      {snippet.document.title}
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="ms-2"
                        onClick={() => onSnippetClick(snippet.document)}
                        title="Open document"
                        style={{ position: "absolute", top: "24px", right: "10px" }}
                      >
                        <i className="bi bi-eye"></i>
                      </Button>
                    </Card.Title>
                    <div className="divider" />
                    <Card.Text className="document-card-text">
                      <strong>Scale:</strong> {snippet.document.scale}
                    </Card.Text>
                    <Card.Text className="document-card-text">
                      <strong>Issuance Date:</strong>{" "}
                      {snippet.document.issuanceDate}
                    </Card.Text>
                    <Card.Text className="document-card-text">
                      <strong>Type:</strong> {snippet.document.type}
                    </Card.Text>
                    <Card.Text className="document-card-text">
                      <strong>Stakeholders:</strong>{" "}
                      {snippet.document.stakeholders.join(", ")}
                    </Card.Text>
                    <Card.Text className="document-card-text">
                      <strong>Links:</strong>
                    </Card.Text>
                    <ListGroup>
                      {snippet.links.map((link, idx) => (
                        <ListGroup.Item key={idx}>
                          {link.linkType
                            .toLowerCase()
                            .replace(
                              /_([a-z])/g,
                              (match, letter) => ` ${letter.toUpperCase()}`
                            )
                            .replace(/^\w/, (c) => c.toUpperCase())}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : (
            <Col>
              <div>
                <p>This document has not been linked yet.</p>
                <p>
                  Once you will have linked it to another document you will be
                  able to see here the type of link
                </p>
              </div>
            </Col>
          )}
        </Row>
      </div>
    </div>
  );
};
ListDocumentLinks.propTypes = {
  documentId: PropTypes.number.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSnippetClick: PropTypes.func.isRequired,
  document: PropTypes.object.isRequired,
    authToken: PropTypes.string.isRequired,
};

export default ListDocumentLinks;