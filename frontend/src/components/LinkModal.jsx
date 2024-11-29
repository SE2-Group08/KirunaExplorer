import { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import PropTypes from 'prop-types';

const LinkModal = ({ showModal, handleClose, document, setSelectedLinkDocuments }) => {
  const [selectedLinks, setSelectedLinks] = useState([{ id: Date.now(), value: '' }]);
  const [errors, setErrors] = useState({});

  const handleChange = (id, value) => {
    setSelectedLinks((prevLinks) =>
      prevLinks.map((link) => (link.id === id ? { ...link, value } : link))
    );
  };

  const handleAddType = () => {
    setSelectedLinks((prevLinks) => [
      ...prevLinks,
      { id: Date.now(), value: '' },
    ]);
  };

  const handleConfirm = () => {
    const invalidLinks = selectedLinks.filter((link) => !link.value);
    if (invalidLinks.length > 0) {
      setErrors({ type: 'Please select a link type for all fields.' });
      return;
    }
    setSelectedLinkDocuments((prevDocuments) => [
      ...prevDocuments,
      ...selectedLinks.map((link) => ({
        document,
        linkType: link.value,
      })),
    ]);
    setSelectedLinks([{ id: Date.now(), value: '' }]);
    handleClose();
  };

  const handleRemoveType = (id) => {
    setSelectedLinks((prevLinks) => prevLinks.filter((link) => link.id !== id));
  };

  return (
    <Modal show={showModal} onHide={handleClose} centered className="document-modal">
      <Modal.Header closeButton>
        <Modal.Title>Select a Link</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {selectedLinks.map((link) => (
            <div className="d-flex mb-3 align-items-center" key={link.id}>
              <Form.Control
                as="select"
                value={link.value}
                onChange={(e) => handleChange(link.id, e.target.value)}
                isInvalid={!!errors.type && !link.value}
                required
                className="me-2"
              >
                <option value="">Select type</option>
                <option value="Direct consequence">Direct consequence</option>
                <option value="Collateral consequence">Collateral consequence</option>
                <option value="Prevision">Prevision</option>
                <option value="Update">Update</option>
              </Form.Control>
              <Button
                variant="danger"
                onClick={() => handleRemoveType(link.id)}
                title="Delete link"
              >
                <i className="bi bi-trash"></i>
              </Button>
            </div>
          ))}
          <Button className="mt-2" variant="primary" onClick={handleAddType} title="Add type">
            <i className="bi bi-plus-square"></i>
          </Button>
          {errors.type && (
            <div className="text-danger mt-2">{errors.type}</div>
          )}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleConfirm}>
          Confirm
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

LinkModal.propTypes = {
  handleAddType: PropTypes.func.isRequired,
  showModal: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  document: PropTypes.object.isRequired,
  setSelectedLinkDocuments: PropTypes.func.isRequired,
  selectedLinkDocuments: PropTypes.array.isRequired,
};

export default LinkModal;
