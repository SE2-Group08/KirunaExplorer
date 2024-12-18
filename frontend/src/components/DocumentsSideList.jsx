import { Offcanvas } from "react-bootstrap";
import "./DocumentsSideList.scss";
import { useEffect, useState, useContext } from "react";
import PropTypes from "prop-types";
import API from "../API.mjs";
import FeedbackContext from "../contexts/FeedbackContext";

const DocumentsSideList = ({ area, onClose }) => {
  const [documents, setDocuments] = useState([]);
  const { setFeedbackFromError } = useContext(FeedbackContext);

  useEffect(() => {
    API.getDocumentsByAreaName(area.name)
      .then((documents) => {
        setDocuments(documents);
      })
      .catch((error) => {
        setFeedbackFromError(error);
      });
  }, [area.name, setFeedbackFromError]);
  
  return (
    <Offcanvas
      show={true}
      onHide={onClose}
      placement="end"
      backdrop={false}
      scroll={true}
      className="custom-offcanvas"
    >
      <Offcanvas.Header closeButton>
        <Offcanvas.Title>Documents in this area</Offcanvas.Title>
      </Offcanvas.Header>
      <Offcanvas.Body>
        <ul className="documents-list">
          {documents.map((document) => (
            <li key={document.id} className="document-item">
              <div className="document-item-title">{document.title}</div>
              <div className="document-item-description">
                {document.description}
              </div>
            </li>
          ))}
        </ul>
      </Offcanvas.Body>
    </Offcanvas>
  );
};

DocumentsSideList.propTypes = {
  area: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DocumentsSideList;
