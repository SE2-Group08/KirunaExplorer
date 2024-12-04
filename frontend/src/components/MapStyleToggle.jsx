import PropTypes from "prop-types";
import { Dropdown } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./MapStyleToggle.css";

const MapStyleToggle = ({ setTileLayer }) => {
    return (
        <div className="map-style-toggle">
            <Dropdown>
                <Dropdown.Toggle
                    variant="light"
                    className="main-button no-caret"
                    id="map-style-toggle"
                >
                    <i className="bi bi-layers"></i>
                </Dropdown.Toggle>

                <Dropdown.Menu className="dropdown-menu">
                    <Dropdown.Item
                        className="dropdown-item"
                        onClick={() => setTileLayer("paper")}
                    >
                        Paper Map

                    </Dropdown.Item>
                    <Dropdown.Item
                        className="dropdown-item"
                        onClick={() => setTileLayer("satellite")}
                    >
                        Satellite Map
                    </Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
        </div>
    );
};

MapStyleToggle.propTypes = {
    setTileLayer: PropTypes.func.isRequired,
};

export default MapStyleToggle;
