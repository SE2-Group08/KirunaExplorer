import PropTypes from "prop-types";
import { Button, Col, Row, ListGroup, OverlayTrigger, Tooltip } from "react-bootstrap";
import { FaFilePdf, FaFileWord, FaFileExcel, FaFileImage, FaFileAlt } from "react-icons/fa";
import { AiOutlineDownload, AiOutlineDelete } from "react-icons/ai";
import "./DocumentResourcesGrid.css";
import "./DocumentResourcesList.css";

const DocumentResources = ({ resources, onDelete, onDownload, viewMode, isEditable}) => {
    const getFileIcon = (extension) => {
        switch (extension.toLowerCase()) {
            case "pdf":
                return <FaFilePdf size={50} />;
            case "doc":
            case "docx":
                return <FaFileWord size={50} />;
            case "xls":
            case "xlsx":
                return <FaFileExcel size={50} />;
            case "png":
            case "jpg":
            case "jpeg":
            case "gif":
                return <FaFileImage size={50} />;
            default:
                return <FaFileAlt size={50} />;
        }
    };

    return viewMode === "grid" ? (
        <Row className="gy-4">
            {resources.map((resource, index) => (
                <Col xs={6} sm={4} md={3} key={index} className="text-center">
                    <div className="resource-container">
                        {/* File Icon */}
                        <div className="icon-wrapper">{getFileIcon(resource.name.split(".").pop())}</div>

                        {/* Resource Name with Tooltip */}
                        <OverlayTrigger
                            placement="top"
                            overlay={<Tooltip id={`tooltip-${index}`}>{resource.name}</Tooltip>}
                        >
                            <div className="resource-name text-truncate">{resource.name}</div>
                        </OverlayTrigger>

                        {/* Resource Actions */}
                        <div className="resource-actions">
                            {isEditable &&<Button variant="outline-danger" size="sm" onClick={() => onDelete(resource.id)}>
                                <AiOutlineDelete />
                            </Button>}
                            <Button variant="outline-primary" size="sm" onClick={() => onDownload(resource.id,resource.name,resource.extension)}>
                                <AiOutlineDownload />
                            </Button>
                        </div>
                    </div>
                </Col>
            ))}
        </Row>
    ) : (
        <ListGroup>
            {resources.map((resource, index) => (
                <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                    <OverlayTrigger
                        placement="top"
                        overlay={<Tooltip id={`tooltip-${index}`}>{resource.name}</Tooltip>}
                    >
                        <div className="text-truncate">{resource.name}</div>
                    </OverlayTrigger>
                    <div>
                        {isEditable ?(<Button variant="outline-danger" size="sm" onClick={() => onDelete(resource.id)} className="me-2">
                            <AiOutlineDelete />
                        </Button>) : (
                            <Button variant="outline-primary" size="sm" onClick={() => onDownload(resource.id,resource.name,resource.extension)}>
                                <AiOutlineDownload />
                            </Button>
                            )}

                    </div>
                </ListGroup.Item>
            ))}
        </ListGroup>
    );
};

DocumentResources.propTypes = {
    resources: PropTypes.arrayOf(
        PropTypes.shape({
            name: PropTypes.string.isRequired,
        })
    ),
    onDelete: PropTypes.func,
    onDownload: PropTypes.func,
    viewMode: PropTypes.oneOf(["grid", "list"]).isRequired,
    isEditable: PropTypes.bool.isRequired,
};

export default DocumentResources;