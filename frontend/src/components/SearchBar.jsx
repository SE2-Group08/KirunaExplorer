// SearchBar.jsx

import { useState } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import PropTypes from 'prop-types';
import './SearchBar.css';

function SearchBar({ onSearch }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearchTermChange = (e) => {
        setSearchTerm(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const trimmedSearchTerm = searchTerm.trim();

        if (!trimmedSearchTerm) {
            alert('Please enter a search term.');
            return;
        }

        onSearch(trimmedSearchTerm);

        setSearchTerm('');
    };

    const handleClear = () => {
        setSearchTerm('');
        onSearch(''); // Assuming passing an empty string resets the search
    };

    return (
        <Container fluid>
            <Form className="d-flex search-bar-form" onSubmit={handleSubmit} role="search" aria-label="Document Search">
                <Form.Control
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchTermChange}
                    placeholder="Search documents..."
                    className="me-2"
                    aria-label="Search documents"
                />
                <Button variant="outline-primary" type="submit" aria-label="Search">
                    Search
                </Button>
                <Button variant="outline-secondary" type="button" onClick={handleClear} className="ms-2" aria-label="Clear Search">
                    Clear
                </Button>
            </Form>
        </Container>
    );
}

SearchBar.propTypes = {
    onSearch: PropTypes.func.isRequired,
};

export default SearchBar;