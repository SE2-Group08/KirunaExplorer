import React from "react";
import { Button, ButtonGroup } from "react-bootstrap";
import PropTypes from "prop-types";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pageNumbers = [];
  for (let i = 0; i < totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination-container d-flex justify-content-center mt-4">
      <ButtonGroup>
        <Button
          variant="secondary"
          disabled={currentPage === 0}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Prev
        </Button>
        {pageNumbers.map((pageNumber) => (
          <Button
            key={pageNumber}
            variant={pageNumber === currentPage ? "primary" : "secondary"}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber + 1}
          </Button>
        ))}
        <Button
          variant="secondary"
          disabled={currentPage === totalPages - 1}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </ButtonGroup>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
