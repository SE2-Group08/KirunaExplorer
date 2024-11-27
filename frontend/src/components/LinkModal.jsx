import { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import PropTypes from "prop-types";

const LinkModal = ({
  showModal,
  handleClose,
  document,
  setSelectedLinkDocuments,
  links
}) => {
  const [selectedLinks, setSelectedLinks] = useState([]);
  const [errors, setErrors] = useState({});

  const linkTypes = [
    "Direct consequence",
    "Collateral consequence",
    "Prevision",
    "Update",
  ];

  useEffect(() => {
    if (showModal) {
      // Initialize selectedLinks based on the links prop
      const initialSelectedLinks = links
        .filter((link) => link.document.id === document.id)
        .map((link) => link.linkType);
      setSelectedLinks(initialSelectedLinks);
    }
  }, [showModal, links, document.id]);

  const handleChange = (e) => {
    const { value, checked } = e.target;
    setSelectedLinks((prevSelectedLinks) =>
      checked
        ? [...prevSelectedLinks, value]
        : prevSelectedLinks.filter((link) => link !== value)
    );
  };

  const handleSave = () => {
    if (selectedLinks.length === 0) {
      setErrors({ type: "At least one link type must be selected." });
    } else {
      setErrors({});
      setSelectedLinkDocuments((prevSelectedLinkDocuments) => [
        ...prevSelectedLinkDocuments,
        ...selectedLinks.map((linkType) => ({ document, linkType })),
      ]);
      setSelectedLinks([]);
      handleClose();
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
          <Form.Label>Link Types *</Form.Label>
          {linkTypes.map((linkType) => (
            <Form.Check
              key={linkType}
              type="checkbox"
              label={linkType}
              value={linkType}
              checked={selectedLinks.includes(linkType)}
              onChange={handleChange}
              isInvalid={!!errors.type}
            />
          ))}
          <div style={{ color: "#dc3545", fontSize: "0.875rem" }}>
            {errors.type}
          </div>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button
          variant="primary"
          disabled={!selectedLinks.length}
          onClick={handleSave}
        >
          Save
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
  links: PropTypes.array.isRequired
};

export default LinkModal;
