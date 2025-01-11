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
import getKirunaArea from "./KirunaArea";
import MapStyleToggle from "./MapStyleToggle";
import FeedbackContext from "../contexts/FeedbackContext";
import { getIconForDocument } from "../utils/iconMapping";
import LegendModal from "./Legend";
import SearchBar from "./SearchBar.jsx";
import DocumentOffcanvas from "./SidePanel";
import "./MapUI.css";

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
    const [municipalityArea, setMunicipalityArea] = useState(null);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [selectedArea, setSelectedArea] = useState(null);
    const [showSidePanel, setShowSidePanel] = useState(false);
    const [showLegend, setShowLegend] = useState(false);
    const [tileLayer, setTileLayer] = useState("satellite");
    const [filteredDocuments, setFilteredDocuments] = useState([]);
    const [mapRef, setMapRef] = useState(null);
    const kirunaPosition = [67.84, 20.2253];
    const zoomLevel = 12;
    const kirunaBorderCoordinates = getKirunaArea();
    const { setFeedbackFromError, shouldRefresh } = useContext(FeedbackContext);

    // Reference for dynamic Polygon
    const kirunaPolygonRef = useRef(null);

    useEffect(() => {
        API.getAllDocumentSnippets("point-only")
            .then((docs) => {
                setDocuments(docs);
                setFilteredDocuments(docs);
            })
            .catch((error) => setFeedbackFromError(error));

        API.getAllAreasSnippets()
            .then((areas) => {
                const filteredAreas = areas.filter(
                    (area) => area.name !== "Entire Municipality"
                );
                setAreas(filteredAreas);
                const municipality = areas.find(
                    (area) => area.name === "Entire Municipality"
                );
                if (municipality) {
                    setMunicipalityArea(municipality);
                }
            })
            .catch((error) => setFeedbackFromError(error));
    }, [setFeedbackFromError, shouldRefresh]);

    const clearHighlightedArea = () => {
        if (mapRef && kirunaPolygonRef.current) {
            mapRef.removeLayer(kirunaPolygonRef.current);
            kirunaPolygonRef.current = null;
        }
    };

    const highlightArea = (area) => {
        if (area.geometry) {
            clearHighlightedArea(mapRef);
            if (mapRef) {
                const polygon = L.polygon(area.geometry.coordinates, {
                    color: "blue",
                    weight: 3,
                    fillOpacity: 0.1,
                }).addTo(mapRef);
                kirunaPolygonRef.current = polygon;

                // Calculate the bounds of the polygon
                const bounds = polygon.getBounds();
                // Adjust the map view to fit the bounds of the polygon
                mapRef.flyToBounds(bounds, { duration: 1.5 });
            }
        }
    };

    const handleDocumentClick = async (document) => {
        clearHighlightedArea(mapRef);
        setShowSidePanel(false);
        setSelectedArea(null);
        try {
            const response = await API.getDocumentById(document.id);
            setSelectedDocument(response);
            setShowSidePanel(true);

            const position =
                document.geolocation.pointCoordinates?.coordinates ||
                document.geolocation.area.areaCentroid;

            if (document.geolocation.area) {
                const areaResponse = await API.getAreaById(
                    document.geolocation.area.areaId
                );
                highlightArea(areaResponse);
            } else {
                mapRef.flyTo([position.latitude, position.longitude], 11, {
                    duration: 1.5,
                });
            }
        } catch (error) {
            setFeedbackFromError(error);
        }
    };

    const handleAreaClick = async (area) => {
        setShowSidePanel(false);
        setSelectedDocument(null);
        await API.getAreaById(area.id)
            .then((response) => {
                setSelectedArea(response);
                highlightArea(response, mapRef);
            })
            .catch((error) => setFeedbackFromError(error));

        setShowSidePanel(true);
    };

    const closeSidePanel = () => {
        clearHighlightedArea(mapRef);
        setShowSidePanel(false);
        setSelectedDocument(null);
        setSelectedArea(null);
    };

    const handleSearch = async ({
                                    keyword = "",
                                    // documentTypes = [],
                                    // stakeholders = [],
                                    // scales = [],
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

    const handleEntireMunicipalityClick = async () => {
        setShowSidePanel(false);
        setSelectedDocument(null);
        setSelectedArea(municipalityArea);
        setShowSidePanel(true);
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

    const maxBounds = [
        [66.0, 10.0],
        [70.5, 30.0],
    ];

    return (
        <div style={{ display: "flex", height: "88vh", position: "relative" }}>
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
            <Button
                title={"legend"}
                variant="white"
                onClick={() => {
                    setShowLegend(!showLegend);
                }}
                className="legend-button"
            >
                <i className="bi bi-question-circle"></i>
            </Button>
            {/* <Button
        title={"center-map"}
        variant="white"
        onClick={() => setShowSidePanel(!showSidePanel)}
        className="center-map-button"
        >
        <i className="bi bi-geo-alt"></i>
        </Button> */}
            <Button
                title={"Documents of Entire Municipality"}
                variant="white"
                onClick={() => {
                    handleEntireMunicipalityClick();
                }}
                className="entire-municipality-button"
            >
                <i className="bi bi-map"></i>
            </Button>
            <MapStyleToggle setTileLayer={setTileLayer} />
            <div style={{ flex: 2, position: "relative" }}>
                <MapContainer
                    center={kirunaPosition}
                    zoom={zoomLevel}
                    style={{ height: "100%", width: "100%" }}
                    ref={setMapRef}
                    maxBounds={maxBounds}
                    maxBoundsViscosity={1.0}
                    minZoom={6}
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
                            mapType={tileLayer}
                        />
                        <AreaMarkers areas={areas} handleAreaClick={handleAreaClick} />
                    </MarkerClusterGroup>
                </MapContainer>
            </div>
            {showSidePanel && (
                <DocumentOffcanvas
                    document={selectedDocument}
                    area={selectedArea}
                    onClose={() => {
                        closeSidePanel();
                    }}
                />
            )}
            {showLegend && (
                <LegendModal show={showLegend} onHide={() => setShowLegend(false)} />
            )}
        </div>
    );
};

const DocumentMarkers = ({ filteredDocuments, handleDocumentClick, mapType }) => {
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
        };

        const icon = getIconForDocument(doc.type, doc.stakeholders);
        icon.options.className = `document-icon ${mapType === "paper" ? "paper-map" : "satellite-map"}`;

        return (
            <Marker
                key={index}
                position={position}
                icon={getIconForDocument(doc.type, doc.stakeholders)}
                eventHandlers={{
                    click: () => handleDocumentClick(doc),
                    mouseover: handleMouseOver,
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
    mapType: PropTypes.string.isRequired,
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