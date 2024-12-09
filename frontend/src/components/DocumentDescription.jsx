import { useState } from "react";
import PropTypes from "prop-types";
import { Row, Col, Button, OverlayTrigger, Tooltip } from "react-bootstrap";
import dayjs from "dayjs";
import DocumentResources from "./DocumentResources";

//  default function DocumentDescriptionModalComponent({ document, existingFiles, handleDownload, isEditable }) {
//     return (

//     );
// });

export default function DocumentDescriptionComponent({ document, existingFiles, handleDownload, isEditable }) {
    const [viewMode, setViewMode] = useState("list");

    return (
        <div className="modal-body-component">
            <Row>
                <Col md={6}>
                    <div className="info-section">
                        <div className="info-item">
                            <label>Stakeholders:</label>
                            <span>
                {document.stakeholders ? document.stakeholders.join(", ") : ""}
              </span>
                        </div>
                        <div className="divider"></div>
                        <div className="info-item">
                            <label>Scale:</label>
                            <span>{document.scale}</span>
                        </div>
                        <div className="divider"></div>
                        <div className="info-item">
                            <label>Issuance Date:</label>
                            <span>
                {dayjs(document.issuanceDate).format(
                    document.issuanceDate.length === 4
                        ? "YYYY"
                        : document.issuanceDate.length === 7
                            ? "MM/YYYY"
                            : "DD/MM/YYYY"
                )}
              </span>
                        </div>
                        <div className="divider"></div>
                        <div className="info-item">
                            <label>Type:</label>
                            <span>{document.type}</span>
                        </div>
                        <div className="divider"></div>
                        <div className="info-item">
                            <label>Connections:</label>
                            <span>
                {document.nrConnections === 0 ? (
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip>
                                This document has no links yet. Remember to add them.
                            </Tooltip>
                        }
                    >
                        <i className="bi bi-exclamation-triangle"></i>
                    </OverlayTrigger>
                ) : (
                    document.nrConnections
                )}
              </span>
                        </div>
                        <div className="divider"></div>
                        <div className="info-item">
                            <label>Language:</label>
                            <span>{document.language ? `${document.language}` : "-"}</span>
                        </div>
                        <div className="divider"></div>

                        <div className="info-item">
                            <label>Pages:</label>
                            <span>{document.nrPages > 0 ? `${document.nrPages}` : "-"}</span>
                        </div>
                        <div className="divider"></div>
                        <div className="info-item">
                            <label>Location:</label>
                            <span>
                {document.geolocation.latitude && document.geolocation.longitude ? (
                    `${document.geolocation.latitude}, ${document.geolocation.longitude}`
                ) : document.geolocation.municipality ? (
                    `${document.geolocation.municipality}`
                ) : (
                    <OverlayTrigger
                        placement="top"
                        overlay={
                            <Tooltip>
                                This document hasn&apos;t been geolocated yet. Remember to
                                add it.
                            </Tooltip>
                        }
                    >
                        <i className="bi bi-exclamation-triangle"></i>
                    </OverlayTrigger>
                )}
              </span>
                        </div>
                    </div>
                </Col>
                <Col md={6}>
                    <div className="description-area">
                        <label>Description:</label>
                        <p>{document.description}</p>
                    </div>
                </Col>
            </Row>
            <div className="divider"></div>
            <Row className="mt-4">
                <Col>
                    <div className="document-resources-section">
                        <div className="info-item d-flex justify-content-between align-items-center mb-3">
                            <label>Resources: </label>
                            {existingFiles.length>0 ? (<Button
                                    onClick={() => setViewMode((prev) => (prev === "list" ? "grid" : "list"))}
                                    title={`Switch to ${viewMode === "list" ? "grid" : "list"} view`}
                                >
                                    <i className={`bi ${viewMode === "list" ? "bi-grid" : "bi-list-task"}`}></i>
                                </Button>) :
                                (
                                    <OverlayTrigger
                                        placement="top"
                                        overlay={
                                            <Tooltip>
                                                This document has no resources yet. Modify the document to add them.
                                            </Tooltip>
                                        }
                                    >
                                        <i className="bi bi-exclamation-triangle"></i>
                                    </OverlayTrigger>
                                )}
                        </div>
                        <DocumentResources
                            resources={existingFiles}
                            onDelete={() => {}} // Deleting files is not allowed in view mode
                            onDownload={handleDownload}
                            viewMode={viewMode}
                            isEditable={isEditable}
                        />
                    </div>
                </Col>
            </Row>
        </div>
    );
}

DocumentDescriptionComponent.propTypes = {
    document: PropTypes.object.isRequired,
    existingFiles: PropTypes.array.isRequired,
    handleDownload: PropTypes.func.isRequired,
    isEditable: PropTypes.bool.isRequired,
};