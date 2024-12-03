import { useEffect, useState } from 'react';
import { Form, Button, Dropdown, Row, Col, FormCheck, Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './SearchBar.css';
import API from "../API.mjs";

function SearchBar({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState([]);
    const [stakeholderFilter, setStakeholderFilter] = useState([]);
    const [stakeholders, setStakeholders] = useState([]);

    /*useEffect(() => {
        API.getAllStakeholders()
            .then(setStakeholders)
            .catch(() => setStakeholders([]));
    }, []);*/

    // Handles input change for the search bar
    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value);
    };

    // Handles the form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        onSearch(searchTerm.trim(), typeFilter, stakeholderFilter);
    };

    // Handles filter selection for document types
    const handleTypeFilterChange = (type) => {
        setTypeFilter((prev) =>
            prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
        );
    };

    // Handles filter selection for stakeholders
    const handleStakeholderFilterChange = (stakeholder) => {
        setStakeholderFilter((prev) =>
            prev.includes(stakeholder) ? prev.filter((s) => s !== stakeholder) : [...prev, stakeholder]
        );
    };

    return (
        <Form className="search-bar-form" onSubmit={handleSubmit} role="search">
            <Container fluid>
                <Form className="d-flex" onSubmit={handleSubmit}>
                    <Form.Control
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchTermChange}
                        placeholder="Search"
                        className="me-2"
                        aria-label="Search"
                    />
                    <Dropdown className="filter-dropdown">
                        <Dropdown.Toggle variant="outline-secondary" id="filter-dropdown" className="filter-button">
                            <i className="bi bi-funnel"></i>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                            <Dropdown.Header>Document Type</Dropdown.Header>
                            <Dropdown.Item as="div">
                                <FormCheck
                                    type="checkbox"
                                    label="Design document"
                                    checked={typeFilter.includes('Design document')}
                                    onChange={() => handleTypeFilterChange('Design document')}
                                />
                            </Dropdown.Item>
                            <Dropdown.Item as="div">
                                <FormCheck
                                    type="checkbox"
                                    label="Technical document"
                                    checked={typeFilter.includes('Technical document')}
                                    onChange={() => handleTypeFilterChange('Technical document')}
                                />
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Header>Stakeholders</Dropdown.Header>
                            {stakeholders.length > 0 ? (
                                stakeholders.map((stakeholder) => (
                                    <Dropdown.Item as="div" key={stakeholder.name}>
                                        <FormCheck
                                            type="checkbox"
                                            label={stakeholder.name}
                                            checked={stakeholderFilter.includes(stakeholder.name)}
                                            onChange={() => handleStakeholderFilterChange(stakeholder.name)}
                                        />
                                    </Dropdown.Item>
                                ))
                            ) : (
                                <Dropdown.Item disabled>No stakeholders available</Dropdown.Item>
                            )}
                        </Dropdown.Menu>
                    </Dropdown>

                    <Button variant="outline-primary" type="submit">
                        Search
                    </Button>
                </Form>
            </Container>
        </Form>
    );
}

SearchBar.propTypes = {
    onSearch: PropTypes.func.isRequired,
    onSuggestionSelected: PropTypes.func,
};

export default SearchBar;
