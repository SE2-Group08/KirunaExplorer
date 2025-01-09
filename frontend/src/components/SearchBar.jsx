import { useState, useEffect } from "react";
import { Form, Button, Dropdown, Accordion, Container, Badge, Row, Col } from "react-bootstrap";
import PropTypes from "prop-types";
import "./SearchBar.scss";
import API from "../API.mjs";

function SearchBar({ onSearch, onRealTimeSearch }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [typeFilter, setTypeFilter] = useState([]);
    const [stakeholderFilter, setStakeholderFilter] = useState([]);
    const [scaleFilter, setScaleFilter] = useState([]);

    const [availableTypes, setAvailableTypes] = useState([]);
    const [availableStakeholders, setAvailableStakeholders] = useState([]);
    const [availableScales, setAvailableScales] = useState([]);

    // Fetch filter options
    useEffect(() => {
        const fetchFilters = async () => {
            try {
                const documentTypes = await API.getAllDocumentTypes();
                const stakeholders = await API.getAllStakeholders();
                const scales = await API.getAllScales();

                setAvailableTypes(documentTypes);
                setAvailableStakeholders(stakeholders);
                setAvailableScales(scales);
            } catch (error) {
                console.error("Error fetching filter options:", error);
            }
        };

        fetchFilters();
    }, []);

    const handleFilterChange = (setter, filter, value) => {
        const updatedFilter = filter.includes(value)
            ? filter.filter((item) => item !== value)
            : [...filter, value];

        setter(updatedFilter);

        // Trigger real-time search on filter change
        const filters = {
            keyword: searchTerm,
            documentTypes: setter === setTypeFilter ? updatedFilter : typeFilter,
            stakeholders: setter === setStakeholderFilter ? updatedFilter : stakeholderFilter,
            scales: setter === setScaleFilter ? updatedFilter : scaleFilter,
        };

        onRealTimeSearch(filters);
    };

    const removeFilter = (setter, filter, value) => {
        const updatedFilter = filter.filter((item) => item !== value);
        setter(updatedFilter);

        // Trigger real-time search on filter removal
        const filters = {
            keyword: searchTerm,
            documentTypes: setter === setTypeFilter ? updatedFilter : typeFilter,
            stakeholders: setter === setStakeholderFilter ? updatedFilter : stakeholderFilter,
            scales: setter === setScaleFilter ? updatedFilter : scaleFilter,
        };

        onRealTimeSearch(filters);
    };

    const handleSearchInputChange = (e) => {
        const keyword = e.target.value;
        setSearchTerm(keyword);
        onRealTimeSearch({
            keyword,
            documentTypes: typeFilter,
            stakeholders: stakeholderFilter,
            scales: scaleFilter,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const filters = {
            keyword: searchTerm,
            documentTypes: typeFilter,
            stakeholders: stakeholderFilter,
            scales: scaleFilter,
        };

        onRealTimeSearch(filters);
    };

    return (
        <Container fluid>
            {/* Search Form */}
            <Form className="search-bar-form d-flex flex-wrap mb-3" onSubmit={handleSubmit}>
                <Form.Control
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchInputChange}
                    placeholder="Search documents..."
                    aria-label="Search documents"
                    className="search-input"
                />
                <Dropdown className="filter-dropdown ms-2">
                    <Dropdown.Toggle variant="outline-secondary" id="dropdown-basic">
                        <i className="bi bi-funnel"></i>
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="custom-dropdown-menu">
                        <Accordion>
                            {/* Document Type Filter */}
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Document Types</Accordion.Header>
                                <Accordion.Body>
                                    {availableTypes.map((type) => (
                                        <div
                                            key={type.id}
                                            className={`filter-item ${typeFilter.includes(type.name) ? "selected" : ""}`}
                                            onClick={() => handleFilterChange(setTypeFilter, typeFilter, type.name)}
                                        >
                                            <Form.Check
                                                type="checkbox"
                                                checked={typeFilter.includes(type.name)}
                                                onChange={(e) => {
                                                    e.stopPropagation(); // Prevent double toggle
                                                    handleFilterChange(setTypeFilter, typeFilter, type.name);
                                                }}
                                                label={type.name}
                                            />
                                        </div>
                                    ))}
                                </Accordion.Body>
                            </Accordion.Item>
                            {/* Stakeholders Filter */}
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>Stakeholders</Accordion.Header>
                                <Accordion.Body>
                                    {availableStakeholders.map((stakeholder) => (
                                        <div
                                            key={stakeholder.id}
                                            className={`filter-item ${
                                                stakeholderFilter.includes(stakeholder.name) ? "selected" : ""
                                            }`}
                                            onClick={() =>
                                                handleFilterChange(setStakeholderFilter, stakeholderFilter, stakeholder.name)
                                            }
                                        >
                                            <Form.Check
                                                type="checkbox"
                                                checked={stakeholderFilter.includes(stakeholder.name)}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    handleFilterChange(setStakeholderFilter, stakeholderFilter, stakeholder.name);
                                                }}
                                                label={stakeholder.name}
                                            />
                                        </div>
                                    ))}
                                </Accordion.Body>
                            </Accordion.Item>
                            {/* Scales Filter */}
                            <Accordion.Item eventKey="2">
                                <Accordion.Header>Scales</Accordion.Header>
                                <Accordion.Body>
                                    {availableScales.map((scale) => (
                                        <div
                                            key={scale.id}
                                            className={`filter-item ${scaleFilter.includes(scale.name) ? "selected" : ""}`}
                                            onClick={() => handleFilterChange(setScaleFilter, scaleFilter, scale.name)}
                                        >
                                            <Form.Check
                                                type="checkbox"
                                                checked={scaleFilter.includes(scale.name)}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    handleFilterChange(setScaleFilter, scaleFilter, scale.name);
                                                }}
                                                label={scale.name}
                                            />
                                        </div>
                                    ))}
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </Dropdown.Menu>
                </Dropdown>
                <Button type="submit" variant="outline-info" className="search-button ms-2">
                    Search
                </Button>

                {/* Filter Badges Section */}
                {(typeFilter.length > 0 || stakeholderFilter.length > 0 || scaleFilter.length > 0) && (
                    <Row className="filter-badges mt-2 w-100">
                        {typeFilter.map((filter, index) => (
                            <Col key={`type-${index}`} xs="auto" className="mb-2">
                                <Badge bg="white" className="p-2" text="info">
                                    {filter}{" "}
                                    <i
                                        className="bi bi-x-circle ms-1"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => removeFilter(setTypeFilter, typeFilter, filter)}
                                    ></i>
                                </Badge>
                            </Col>
                        ))}
                        {stakeholderFilter.map((filter, index) => (
                            <Col key={`stakeholder-${index}`} xs="auto" className="mb-2">
                                <Badge bg="white" className="p-2" text="info">
                                    {filter}{" "}
                                    <i
                                        className="bi bi-x-circle ms-1"
                                        style={{ cursor: "pointer" }}
                                        onClick={() =>
                                            removeFilter(setStakeholderFilter, stakeholderFilter, filter)
                                        }
                                    ></i>
                                </Badge>
                            </Col>
                        ))}
                        {scaleFilter.map((filter, index) => (
                            <Col key={`scale-${index}`} xs="auto" className="mb-2">
                                <Badge bg="white" className="p-2" text="info">
                                    {filter}{" "}
                                    <i
                                        className="bi bi-x-circle ms-1"
                                        style={{ cursor: "pointer" }}
                                        onClick={() => removeFilter(setScaleFilter, scaleFilter, filter)}
                                    ></i>
                                </Badge>
                            </Col>
                        ))}
                    </Row>
                )}
            </Form>
        </Container>
    );
}

SearchBar.propTypes = {
    onSearch: PropTypes.func.isRequired,
    onRealTimeSearch: PropTypes.func.isRequired,
};

export default SearchBar;