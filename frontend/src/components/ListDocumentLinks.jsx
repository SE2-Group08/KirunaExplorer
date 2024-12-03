import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Button, Card, Row, Col, ListGroup } from "react-bootstrap";
import API from "../API.mjs";
import "../App.css";
// import LinkModal from "./LinkModal.jsx";

const ListDocumentLinks = ({
  documentId,
  isOpen,
  onClose,
  // onSnippetClick,
  // document,
}) => {
  const [snippets, setSnippets] = useState([]);
  // const [showLinkModal, setShowLinkModal] = useState(false);
  // const [selectedSnippet, setSelectedSnippet] = useState({});
  // const [selectedLinkDocuments, setSelectedLinkDocuments] = useState([]);
  const [links, setLinks] = useState([]);

  useEffect(() => {
    if (isOpen) {
      API.getAllLinksOfDocument(documentId)
        .then((response) => {
          setSnippets(response);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [isOpen]);

  // useEffect(() => {
  //   if (!isOpen) {
  //     setSnippets([]);
  //   }
  // }, [isOpen]);

  // const handleSnippetClick = async (snippet) => {
  //   setShowLinkModal(true);
  //   const dLinks = await API.getAllLinksOfDocument(snippet.document.id);
  //   setLinks(dLinks);
  //   setSelectedSnippet(snippet);
  // };

  return (
    <div className={`slider ${isOpen ? "open" : ""}`}>
      <div className="snippet-list">
        <Row xs={1} className="g-4" style={{ width: "100%" }}>
          <Card.Title>Linked documents</Card.Title>
          {snippets.length ? (
            snippets.map((snippet, index) => (
              <Col key={index}>
                <Card
                  className="document-card slider-card"
                  // onClick={() => handleSnippetClick(snippet)}
                >
                  <Card.Body>
                    <Card.Title className="document-card-title">
                      {snippet.document.title}
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
      <Button variant="secondary" onClick={onClose} className="close-button">
        Close
      </Button>

      {/* {showLinkModal && (
        <LinkModal
          showModal={showLinkModal}
          handleClose={() => setShowLinkModal(false)}
          document={selectedSnippet}
          links={links}
          selectedDocumentToLink={document}
          setSelectedLinkDocuments={setSelectedLinkDocuments}
        />
      )} */}
    </div>
  );
};
ListDocumentLinks.propTypes = {
  documentId: PropTypes.number.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSnippetClick: PropTypes.func.isRequired,
  document: PropTypes.object.isRequired,
};

export default ListDocumentLinks;
