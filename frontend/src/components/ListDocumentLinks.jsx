import React, { useState, useEffect } from 'react';
import { Button, Card, Row, Col, ListGroup } from 'react-bootstrap';
import API from '../API.mjs';
import '../App.css';

const ListDocumentLinks = ({ documentId, isOpen, onClose, onSnippetClick }) => {
  const [snippets, setSnippets] = useState([]);

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

  useEffect(() => {
    if (!isOpen) {
      setSnippets([]);
    }
  }, [isOpen]);

  const handleSnippetClick = (snippet) => {
    onSnippetClick(snippet);
    onClose();
  };

  return (
    <div className={`slider ${isOpen ? 'open' : ''}`}>
      <div className="snippet-list">
        <Row xs={1} className="g-4" style={{ width: "100%" }}>
          {snippets.map((snippet, index) => (
            <Col key={index}>
              <Card className="document-card slider-card" onClick={() => handleSnippetClick(snippet)}>
                <Card.Body>
                  <Card.Title className="document-card-title">
                    {snippet.document.title}
                  </Card.Title>
                  <div className="divider" />
                  <Card.Text className="document-card-text">
                    <strong>Scale:</strong> {snippet.document.scale}
                  </Card.Text>
                  <Card.Text className="document-card-text">
                    <strong>Issuance Date:</strong> {snippet.document.issuanceDate}
                  </Card.Text>
                  <Card.Text className="document-card-text">
                    <strong>Type:</strong> {snippet.document.type}
                  </Card.Text>
                  <Card.Text className="document-card-text">
                    <strong>Stakeholders:</strong> {snippet.document.stakeholders.join(', ')}
                  </Card.Text>
                  <Card.Text className="document-card-text">
                    <strong>Links:</strong>
                  </Card.Text>
                  <ListGroup>
                    {snippet.links.map((link, idx) => (
                      <ListGroup.Item key={idx}>
                        {link.linkType}
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
      <Button variant="secondary" onClick={onClose} className="close-button">
        Close
      </Button>
    </div>
  );
};

export default ListDocumentLinks;
