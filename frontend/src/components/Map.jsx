import { useEffect, useState, useRef, useContext } from "react";
import { Button } from "react-bootstrap";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/dist/styles.min.css";
import L from "leaflet";
import "leaflet-editable";
import API from "../API";
import PropTypes from "prop-types";
import DocumentSidePanel from "./DocumentSidePanel";
import getKirunaArea from "./KirunaArea";
import MapStyleToggle from "./MapStyleToggle";
import FeedbackContext from "../contexts/FeedbackContext";
import { getIconForDocument } from "../utils/iconMapping";
import LegendModal from "./Legend";
import SearchBar from "./SearchBar.jsx";

const ZoomToMarker = ({ position, zoomLevel }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.flyTo(position, zoomLevel || map.getZoom(), { duration: 1.5 }); // Default to current zoom if zoomLevel not provided
    }
  }, [position, zoomLevel, map]);

  return null;
};

ZoomToMarker.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number).isRequired,
  zoomLevel: PropTypes.number,
};

const MapKiruna = () => {
  const [documents, setDocuments] = useState([]);
  const [areas, setAreas] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedArea, setSelectedArea] = useState(null);
  const [showDocumentSidePanel, setShowDocumentSidePanel] = useState(true);
  const [show, setShow] = useState(true);
  const [showLegend, setShowLegend] = useState(false);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const kirunaPosition = [67.84, 20.2253];
  const zoomLevel = 12;
  const [tileLayer, setTileLayer] = useState("satellite");
  const { setFeedbackFromError, shouldRefresh } = useContext(FeedbackContext);
  const [filteredDocuments, setFilteredDocuments] = useState([]);

  // Reference for dynamic Polygon
  const kirunaPolygonRef = useRef(null);

  useEffect(() => {
    API.getAllDocumentSnippets()
      .then((docs) => {
        setDocuments(docs);
        setFilteredDocuments(docs);
      })
      .catch((error) => setFeedbackFromError(error));

    API.getAllAreasSnippets()
      .then((areas) => {
        setAreas(areas);
      })
      .catch((error) => setFeedbackFromError(error));
  }, [setFeedbackFromError, shouldRefresh]);

  const handleDocumentClick = async (document) => {
    await API.getDocumentById(document.id)
      .then((response) => {
        setSelectedDocument(response);
        setShow(true);
        setShowDocumentSidePanel(true);
      })
      .then(
        setSelectedPosition(
          document.geolocation.pointCoordinates?.coordinates ||
            document.geolocation.area.areaCentroid
        )
      )
      .catch((error) => setFeedbackFromError(error));
  };

  const handleAreaClick = async (area) => {
    await API.getAreaById(area.id)
      .then((response) => {
        setSelectedArea(response);
      })
      .then(setSelectedPosition(area.centroid))
      .catch((error) => setFeedbackFromError(error));
  };

  const closeSidePanel = () => {
    setShow(false);
    setShowDocumentSidePanel(false);
    selectedDocument ? setSelectedDocument(null) : setSelectedArea(null);
  };

  const kirunaBorderCoordinates = getKirunaArea();

  const handleSearch = async ({
    keyword = "",
    documentTypes = [],
    stakeholders = [],
    scales = [],
  }) => {
    if (!keyword) {
      setFilteredDocuments(documents);
      return;
    }

    API.searchDocuments(keyword)
      .then((data) => {
        setFilteredDocuments(data);
      })
      .catch((error) => {
        setFeedbackFromError(error);
      });
  };

  const onRealTimeSearch = async ({
    keyword = "",
    documentTypes = [],
    stakeholders = [],
    scales = [],
  }) => {
    const lowerCaseKeyword = keyword.toLowerCase();

    const filtered = documents.filter((doc) => {
      const matchesKeyword =
        !keyword || doc.title.toLowerCase().includes(lowerCaseKeyword);
      const matchesDocumentTypes =
        documentTypes.length === 0 || documentTypes.includes(doc.type);
      const matchesStakeholders =
        stakeholders.length === 0 ||
        stakeholders.some((id) => doc.stakeholders.includes(id));
      const matchesScales = scales.length === 0 || scales.includes(doc.scale);

      return (
        matchesKeyword &&
        matchesDocumentTypes &&
        matchesStakeholders &&
        matchesScales
      );
    });

    setFilteredDocuments(filtered);
  };
  return (
    <div style={{ display: "flex", height: "91vh", position: "relative" }}>
      <div
        style={{
          position: "absolute",
          top: "12px",
          left: "30px",
          zIndex: 1000,
          marginBottom: "5rem",
          marginLeft: "5rem",
        }}
      >
        <SearchBar
          onSearch={handleSearch}
          onRealTimeSearch={onRealTimeSearch}
        />
      </div>
      <MapStyleToggle setTileLayer={setTileLayer} />
      <Button
        title={"legend"}
        variant="white"
        onClick={() => {
          setShowLegend(!showLegend);
        }}
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          zIndex: 1000,
        }}
      >
        <i className="bi bi-question-circle"></i>
      </Button>
      <Button
        title={"center-map"}
        variant="white"
        onClick={() => setShowDocumentSidePanel(!showDocumentSidePanel)}
        style={{
          position: "absolute",
          top: "50px",
          right: "10px",
          zIndex: 1000,
        }}
      >
        <i className="bi bi-geo-alt"></i>
      </Button>
      <div style={{ flex: 2, position: "relative" }}>
        <MapContainer
          center={kirunaPosition}
          zoom={zoomLevel}
          style={{ height: "100%", width: "100%" }}
        >
          <TileLayer
            url={
              tileLayer === "paper"
                ? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            }
            attribution={
              tileLayer === "paper"
                ? "&copy; OpenStreetMap contributors"
                : "Tiles © Esri — Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            }
          />
          <MarkerClusterGroup>
            <DocumentMarkers
              filteredDocuments={filteredDocuments}
              handleDocumentClick={handleDocumentClick}
              kirunaPolygonRef={kirunaPolygonRef}
              kirunaBorderCoordinates={kirunaBorderCoordinates}
            />
            <AreaMarkers areas={areas} handleAreaClick={handleAreaClick} />
          </MarkerClusterGroup>
          {selectedDocument || selectedArea ? (
            <ZoomToMarker
              position={[selectedPosition.latitude, selectedPosition.longitude]}
              zoomLevel={10}
            />
          ) : (
            <ZoomToMarker position={kirunaPosition} zoomLevel={12} />
          )}
        </MapContainer>
      </div>

      {selectedDocument && showDocumentSidePanel && (
        <DocumentSidePanel
          document={selectedDocument}
          onClose={closeSidePanel}
        />
      )}
      {showLegend && (
        <LegendModal show={showLegend} onHide={() => setShowLegend(false)} />
      )}
    </div>
  );
};

const DocumentMarkers = ({
  filteredDocuments,
  handleDocumentClick,
  kirunaPolygonRef,
  kirunaBorderCoordinates,
}) => {
  return filteredDocuments.map((doc, index) => {
    const position = doc.geolocation.pointCoordinates
      ? [
          doc.geolocation.pointCoordinates.coordinates.latitude,
          doc.geolocation.pointCoordinates.coordinates.longitude,
        ]
      : [
          doc.geolocation.area.areaCentroid.latitude,
          doc.geolocation.area.areaCentroid.longitude,
        ];

    const handleMouseOver = (e) => {
      const marker = e.target;
      marker
        .bindTooltip(doc.title, {
          permanent: false,
          offset: [2, -33],
          direction: "top",
        })
        .openTooltip();

      if (doc.geolocation.area?.name === "Entire municipality") {
        const map = marker._map;
        if (!kirunaPolygonRef.current) {
          kirunaPolygonRef.current = L.polygon(kirunaBorderCoordinates, {
            color: "purple",
            weight: 3,
            fillOpacity: 0.1,
          }).addTo(map);
        }
      }
    };

    // const handleMouseOut = (e) => {
    //   const marker = e.target;
    //   marker.closeTooltip();

    //   if (kirunaPolygonRef.current) {
    //     const map = marker._map;
    //     map.removeLayer(kirunaPolygonRef.current);
    //     kirunaPolygonRef.current = null;
    //   }
    // };

    return (
      <Marker
        key={index}
        position={position}
        icon={getIconForDocument(doc.type, doc.stakeholders)}
        eventHandlers={{
          click: () => handleDocumentClick(doc),
          mouseover: handleMouseOver,
          //   mouseout: handleMouseOut,
        }}
      />
    );
  });
};

DocumentMarkers.propTypes = {
  filteredDocuments: PropTypes.array.isRequired,
  handleDocumentClick: PropTypes.func.isRequired,
  kirunaPolygonRef: PropTypes.object.isRequired,
  kirunaBorderCoordinates: PropTypes.array.isRequired,
};

const AreaMarkers = ({ areas, handleAreaClick }) => {
  return areas.map((area, index) => {
    const handleMouseHover = (e) => {
      const marker = e.target;
      marker
        .bindTooltip(area.name, {
          permanent: false,
          offset: [-15, -15],
          direction: "top",
        })
        .openTooltip();
    };
    return (
      <Marker
        key={index}
        position={[area.centroid.latitude, area.centroid.longitude]}
        eventHandlers={{
          click: () => handleAreaClick(area),
          mouseover: handleMouseHover,
        }}
      />
    );
  });
};

AreaMarkers.propTypes = {
  areas: PropTypes.array.isRequired,
  handleAreaClick: PropTypes.func.isRequired,
};

export default MapKiruna;
