import { useEffect, useState, useRef, useContext } from "react";
import { Button } from "react-bootstrap";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polygon,
  useMap,
} from "react-leaflet";
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
import SearchBar from './SearchBar.jsx';

// Icon mapping
const iconMapping = {
  "Prescriptive document": {
    LKAB: new L.Icon({
      iconUrl: prescpritiveDocument_LKAB,
      iconSize: [45, 45],
      iconAnchor: [20, 37],
      popupAnchor: [1, -25],
    }),
    "Kiruna kommun": new L.Icon({
      iconUrl: prescriptiveDocument_Kommun,
      iconSize: [45, 45],
      iconAnchor: [20, 37],
      popupAnchor: [1, -25],
    }),
  },
  "Informative document": {
    LKAB: new L.Icon({
      iconUrl: informativeDocument_LKAB,
      iconSize: [45, 45],
      iconAnchor: [20, 37],
      popupAnchor: [1, -25],
    }),
    "Kiruna kommun,Residents": new L.Icon({
      iconUrl: informativeDocument_KommunResidents,
      iconSize: [45, 45],
      iconAnchor: [20, 37],
      popupAnchor: [1, -25],
    }),
  },
  "Design document": {
    LKAB: new L.Icon({
      iconUrl: designDocument_LKAB,
      iconSize: [45, 45],
      iconAnchor: [20, 37],
      popupAnchor: [1, -25],
    }),
    "Kiruna kommun,White Arkitekter": new L.Icon({
      iconUrl: designDocument_KommunWhiteArkitekter,
      iconSize: [45, 45],
      iconAnchor: [20, 37],
      popupAnchor: [1, -25],
    }),
  },
  "Material effect": {
    LKAB: new L.Icon({
      iconUrl: actionDocument_LKAB,
      iconSize: [45, 45],
      iconAnchor: [20, 37],
      popupAnchor: [1, -25],
    }),
  },
  "Technical document": {
    LKAB: new L.Icon({
      iconUrl: technicalDocument_LKAB,
      iconSize: [45, 45],
      iconAnchor: [20, 37],
      popupAnchor: [1, -25],
    }),
  },
};

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const getIconForDocument = (type, stakeholders) => {
  if (iconMapping[type]) {
    const stakeholdersKey = stakeholders.sort().join(",");
    return iconMapping[type][stakeholdersKey] || defaultIcon;
  }
  return defaultIcon;
};

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
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showDocumentSidePanel, setShowDocumentSidePanel] = useState(true);
  const [showLegend, setShowLegend] = useState(false);
  const kirunaPosition = [67.84, 20.2253];
  const zoomLevel = 12;
  const [tileLayer, setTileLayer] = useState("satellite");
  const { setFeedbackFromError } = useContext(FeedbackContext);
    const { setFeedbackFromError, setShouldRefresh } =
        useContext(FeedbackContext);
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
    }, [setFeedbackFromError]);

  useEffect(() => {
    API.getAllDocumentSnippets()
      .then(setDocuments)
      .catch((error) => setFeedbackFromError(error));
  }, []);

    useEffect(() => {
        API.getDocumentsByPageNumber()
            .then((response) => {
                setDocuments(response[0].documentSnippets);
            })
            .then(() => setShouldRefresh(false))
            .catch((error) => setFeedbackFromError(error));
    }, []);

  const handleDocumentClick = (document) => {
    API.getDocumentById(document.id)
      .then((response) => {
        setSelectedDocument(response);
        setShowDocumentSidePanel(true);
      })
      .catch((error) => setFeedbackFromError(error));
  };

  const closeSidePanel = () => {
    setShowDocumentSidePanel(false);
    setSelectedDocument(null);
  };

  const kirunaBorderCoordinates = getKirunaArea();

  const handleSearch = (keyword) => {
    if (!keyword) {
      setFilteredDocuments(documents);
      return;
    }

    API.searchDocuments(keyword)
        .then((data) => {
          setFilteredDocuments(data);
          console.log("Filtered documents: ", data);
        })
        .catch((error) => {
          setFeedbackFromError(error);
        });
  };

  return (
    <div style={{ display: "flex", height: "100vh", position: "relative" }}>
        <div style={{position: 'absolute', top: '10px', left: '30px', zIndex: 1000, marginBottom:"5rem",
            marginLeft: '5rem'

        }}>
            <SearchBar
                onSearch={handleSearch}
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
            {filteredDocuments.map((doc, index) => {
              const position = doc.geolocation.latitude
                ? [doc.geolocation.latitude, doc.geolocation.longitude]
                : kirunaPosition;

                {
                    console.log(
                        "Icon Path Map:",
                        getIconForDocument(doc.type, doc.stakeholders)
                    );
                }

              return (
                <Marker
                  key={index}
                  position={position}
                  icon={getIconForDocument(doc.type, doc.stakeholders)}
                  eventHandlers={{
                    click: () => handleDocumentClick(doc),
                    mouseover: (e) => {
                      const marker = e.target;
                      // Showing the title of the document as a tooltip
                      marker
                        .bindTooltip(doc.title, {
                          permanent: false,
                          offset: [2, -33],
                          direction: "top",
                        })
                        .openTooltip();
                      // Showing the polygon when mouseover on the document
                      if (
                        doc.geolocation.municipality === "Entire municipality"
                      ) {
                        const map = marker._map;
                        if (!kirunaPolygonRef.current) {
                          kirunaPolygonRef.current = L.polygon(
                            kirunaBorderCoordinates,
                            {
                              color: "purple",
                              weight: 3,
                              fillOpacity: 0.1,
                            }
                          ).addTo(map);
                        }
                      }
                    },
                    mouseout: (e) => {
                      const marker = e.target;
                      marker.closeTooltip();

                      // Removing the polygon when mouseout
                      if (kirunaPolygonRef.current) {
                        const map = marker._map;
                        map.removeLayer(kirunaPolygonRef.current);
                        kirunaPolygonRef.current = null;
                      }
                    },
                  }}
                />
              );
            })}
          </MarkerClusterGroup>
          {selectedDocument && selectedDocument.geolocation.latitude ? (
            <ZoomToMarker
              position={[
                selectedDocument.geolocation.latitude,
                selectedDocument.geolocation.longitude,
              ]}
              zoomLevel={15}
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

export default MapKiruna;
