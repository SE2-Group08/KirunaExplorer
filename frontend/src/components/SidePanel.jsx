import { useEffect, useState, useContext } from "react";
import { Offcanvas } from "react-bootstrap";
import FeedbackContext from "../contexts/FeedbackContext";
import { DocumentSnippetCardComponent } from "./ListDocuments";
import { DocumentDescriptionFields } from "./DocumentDescription.jsx";
import API from "../API.mjs";
import "./DocumentOffcanvas.scss";
import PropTypes from "prop-types";

const DocumentOffcanvas = ({ document, area, onClose }) => {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(document);
  const [twoSteps, setTwoSteps] = useState(false);
  const { setFeedbackFromError } = useContext(FeedbackContext);

  useEffect(() => {
    if (area) {
      API.getDocumentsByAreaName(area.name)
        .then((documents) => {
          setDocuments(documents);
        })
        .catch((error) => {
          setFeedbackFromError(error);
        });
    }
  }, [area, setFeedbackFromError]);

  const handleSelectDocument = async (doc) => {
    await API.getDocumentById(doc.id)
      .then((document) => {
        setSelectedDocument(document);
      })
      .catch((error) => {
        setFeedbackFromError(error);
      });
  };

  const handleClose = () => {
    if (twoSteps) {
      setTwoSteps(false);
      setSelectedDocument(null);
    } else {
      onClose();
    }
  };

  return (
    <Offcanvas
      show={true}
      onHide={handleClose}
      placement="end"
      backdrop={false}
      scroll={true}
      className="custom-offcanvas"
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>
          {selectedDocument
            ? selectedDocument.title
            : `Documents in ${area?.name || "this area"}`}
        </Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        {selectedDocument ? (
          <DocumentDescriptionFields document={selectedDocument} vertical />
        ) : documents.length > 0 ? (
          documents.map((doc) => (
            <DocumentSnippetCardComponent
              key={doc.id}
              document={doc}
              isLinkedDocument={() => {}}
              onSelect={() => {
                handleSelectDocument(doc);
                setTwoSteps(true);
              }}
              allLinksOfSelectedDocument={[]}
              linking={false}
            />
          ))
        ) : (
          <p>No documents were found in this area</p>
        )}
      </Offcanvas.Body>
    </Offcanvas>
  );
};

DocumentOffcanvas.propTypes = {
  document: PropTypes.object,
  area: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default DocumentOffcanvas;
