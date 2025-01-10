import PropTypes from "prop-types";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./MapUI.css";

const MapStyleToggle = ({ setTileLayer }) => {
    const [isSatellite, setIsSatellite] = useState(true);

    const toggleMapStyle = () => {
        if (isSatellite) {
            setTileLayer("paper");
        } else {
            setTileLayer("satellite");
        }
        setIsSatellite(!isSatellite);
    };

    return (
        <div className="map-style-toggle">
            <button
                className={`main-button no-caret ${isSatellite ? "satellite" : "paper"}`}
                onClick={toggleMapStyle}
                title={isSatellite ? "Switch to Paper Map" : "Switch to Satellite Map"}
            >
                <i className="bi bi-layers"></i>
            </button>
        </div>
    );
};

MapStyleToggle.propTypes = {
    setTileLayer: PropTypes.func.isRequired,
};

export default MapStyleToggle;
