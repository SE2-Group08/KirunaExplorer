import { useState, useEffect, useContext } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import PropTypes from "prop-types";
import API from "../API.mjs";
import FeedbackContext from "../contexts/FeedbackContext.js";

const LinkModal = ({
                     showModal,
                     handleClose,
                     document,
                     setSelectedLinkDocuments,
                     links,
                     selectedDocumentToLink,
                   }) => {
  const [selectedLinks, setSelectedLinks] = useState([]);
  const [initialSelectedLinks, setInitialSelectedLinks] = useState([]);
  const { setFeedbackFromError, setFeedback } = useContext(FeedbackContext);

  // Map dei tipi di link per coerenza
  const linkTypesMap = {
    DIRECT_CONSEQUENCE: "Direct consequence",
    COLLATERAL_CONSEQUENCE: "Collateral consequence",
    PREVISION: "Prevision",
    UPDATE: "Update",
  };

  const linkTypes = Object.values(linkTypesMap);

  useEffect(() => {
    if (showModal) {
      const selectedDocument = links.find(
          (link) => link.document.id === selectedDocumentToLink.id
      );
      const alreadyPresentLinks = selectedDocument
          ? selectedDocument.links.map((linkDetail) => ({
            linkId: linkDetail.linkId,
            linkType: linkTypesMap[linkDetail.linkType],
          }))
          : [];
      setInitialSelectedLinks(alreadyPresentLinks);
      setSelectedLinks(alreadyPresentLinks);
    }
  }, [showModal, links, document.id, selectedDocumentToLink.id]);

  const handleChange = (e) => {
    const { value, checked } = e.target;
    const linkType = value;
    const linkId = selectedDocumentToLink.id;

    setSelectedLinks((prevSelectedLinks) =>
        checked
            ? [...prevSelectedLinks, { linkId, linkType }]
            : prevSelectedLinks.filter((link) => link.linkType !== linkType)
    );
  };

  const handleSave = async () => {
    const linksToCreate = selectedLinks.filter(
        (link) =>
            !initialSelectedLinks.some(
                (initialLink) => initialLink.linkType === link.linkType
            )
    );
    const linksToDelete = initialSelectedLinks.filter(
        (initialLink) =>
            !selectedLinks.some((link) => link.linkType === initialLink.linkType)
    );

    try {
      await Promise.all([
        ...linksToCreate.map((link) =>
            API.createLink(document.id, {
              type: link.linkType,
              documentId: link.linkId,
            })
                .then(() =>
                    setFeedback({
                      type: "success",
                      message: "Link created successfully",
                    })
                )
                .catch((error) => setFeedbackFromError(error))
        ),
        ...linksToDelete.map((link) =>
            API.deleteLink(link.linkId)
                .then(() =>
                    setFeedback({
                      type: "success",
                      message: "Link deleted successfully",
                    })
                )
                .catch((error) => setFeedbackFromError(error))
        ),
      ]);

      setSelectedLinkDocuments((prevSelectedLinkDocuments) => [
        ...prevSelectedLinkDocuments,
        ...selectedLinks.map((link) => ({ document, linkType: link.linkType })),
      ]);
      setSelectedLinks([]);
      handleClose();
    } catch (error) {
      setFeedbackFromError(error);
    }
  };

  return (
      <Modal
          show={showModal}
          onHide={handleClose}
          centered
          className="document-modal"
      >
        <Modal.Header closeButton>
          <Modal.Title>Select Link Types</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="formLinkTypes">
            <Form.Label>Link Types</Form.Label>
            {linkTypes.map((linkType) => (
                <Form.Check
                    key={linkType}
                    type="checkbox"
                    label={linkType}
                    value={linkType}
                    checked={selectedLinks.some((link) => link.linkType === linkType)}
                    onChange={handleChange}
                />
            ))}
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
              variant="primary"
              disabled={selectedLinks === initialSelectedLinks}
              onClick={handleSave}
          >
            Save
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
  );
};

LinkModal.propTypes = {
  showModal: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  document: PropTypes.object.isRequired,
  setSelectedLinkDocuments: PropTypes.func.isRequired,
  links: PropTypes.array.isRequired,
  selectedDocumentToLink: PropTypes.object.isRequired,
};

export default LinkModal;