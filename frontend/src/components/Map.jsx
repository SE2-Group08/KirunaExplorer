import { useEffect, useState, useRef, useContext } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
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
  const [show, setShow] = useState(true);
  const kirunaPosition = [67.84, 20.2253];
  const zoomLevel = 12;
  const [tileLayer, setTileLayer] = useState("satellite");
  const { setFeedbackFromError, setShouldRefresh } = useContext(FeedbackContext);

  // Per gestire il Polygon dinamico
  const kirunaPolygonRef = useRef(null);

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
        setShow(true);
      })
      .catch((error) => setFeedbackFromError(error));
  };

  const closeSidePanel = () => {
    setShow(false);
    setSelectedDocument(null);
  };

  const kirunaBorderCoordinates = getKirunaArea();

  return (
    <div style={{ display: "flex", height: "90vh", position: "relative" }}>
      <MapStyleToggle setTileLayer={setTileLayer} />
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
            {documents.map((doc, index) => {
              const position = doc.geolocation.latitude
                ? [doc.geolocation.latitude, doc.geolocation.longitude]
                : kirunaPosition;

                {console.log("Icon Path Map:", getIconForDocument(doc.type, doc.stakeholders))}
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

      {selectedDocument && show && (
        <DocumentSidePanel
          document={selectedDocument}
          onClose={closeSidePanel}
        />
      )}
    </div>
  );
};

export default MapKiruna;
