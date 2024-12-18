import L from "leaflet";
import prescriptive_kommun from "../public/icons/prescriptive doc municipalty.png"
import prescriptive_kommun_whiteArkitekter from "../public/icons/prescriptive doc municipalty +architectural firms.png"
import prescriptive_others from "../public/icons/prescriptive doc  others.png"
import prescriptive_LKAB from "../public/icons/Prescriptive-document-LKAB.png"
import informative_whiteArkitekter from "../public/icons/informative doc architecture firms.png"
import informative_LKAB from "../public/icons/informative doc LKAB.png"
import informative_kommun from "../public/icons/informative doc municipalty.png"
import informative_kommun_residents from "../public/icons/informative doc municipalty+ population.png"
import informative_kommun_whiteArkitekter from "../public/icons/informative doc municipalty+architectur firms.png"
import informative_others from "../public/icons/informative doc others.png"
import design_LKAB from "../public/icons/Design-document-LKAB.png"
import design_whiteArkitekter from "../public/icons/design doc architecture firms.png"
import design_LKAB_whiteArkitekter from "../public/icons/deesign doc LKAB + architecture firms.png"
import design_kommun_whiteArkitekter from "../public/icons/design doc municialty+ architecture firms.png"
import design_kommun from "../public/icons/design doc municipalty.png"
import design_others from "../public/icons/design doc others.png"
import material_LKAB from "../public/icons/material action LKAB.png"
import material_others from "../public/icons/material action others.png"
import technical_whiteArkitekter from "../public/icons/technical doc architecture firms.png"
import technical_Country from "../public/icons/technical doc County.png"
import technical_LKAB_whiteArkitekter from "../public/icons/technical doc LKAB + architecture firms.png"
import technical_LKAB from "../public/icons/technical doc LKAB.png"
import technical_kommun from "../public/icons/technical doc municipalty.png"
import technical_kommun_whiteArkitekter from "../public/icons/technical doc municipalty+ firms.png"

// Icon mapping
const iconMapping = {
  "Prescriptive document": {
    "LKAB": new L.Icon({
      iconUrl: prescriptive_LKAB,
      iconSize: [45, 45],
      iconAnchor: [20, 37],
      popupAnchor: [1, -25],
    }),
    "Kiruna kommun,White Arkitekter": new L.Icon({
      iconUrl: prescriptive_kommun_whiteArkitekter,
      iconSize: [45, 45],
      iconAnchor: [20, 37],
      popupAnchor: [1, -25],
    }),
    "Kiruna kommun": new L.Icon({
      iconUrl: prescriptive_kommun,
      iconSize: [45, 45],
      iconAnchor: [20, 37],
      popupAnchor: [1, -25],
    }),
    "Others": new L.Icon({
      iconUrl: prescriptive_others,
      iconSize: [45, 45],
      iconAnchor: [20, 37],
      popupAnchor: [1, -25],
    }),
  },
  "Informative document": {
    "White Arkitekter": new L.Icon({
      iconUrl: informative_whiteArkitekter,
      iconSize: [45, 45],
      iconAnchor: [20, 37],
      popupAnchor: [1, -25],
    }),
    "LKAB": new L.Icon({
      iconUrl: informative_LKAB,
      iconSize: [45, 45],
      iconAnchor: [20, 37],
      popupAnchor: [1, -25],
    }),
    "Kiruna kommun": new L.Icon({
      iconUrl: informative_kommun,
      iconSize: [45, 45],
      iconAnchor: [20, 37],
      popupAnchor: [1, -25],
    }),
    "Kiruna kommun,Residents": new L.Icon({
      iconUrl: informative_kommun_residents,
      iconSize: [45, 45],
      iconAnchor: [20, 37],
      popupAnchor: [1, -25],
    }),
    "Kiruna kommun,White Arkitekter": new L.Icon({
      iconUrl: informative_kommun_whiteArkitekter,
      iconSize: [45, 45],
      iconAnchor: [20, 37],
      popupAnchor: [1, -25],
    }),
    "Others": new L.Icon({
      iconUrl: informative_others,
      iconSize: [45, 45],
      iconAnchor: [20, 37],
      popupAnchor: [1, -25],
    }),
  },
  "Design document": {
    "LKAB": new L.Icon({
      iconUrl: design_LKAB,
      iconSize: [45, 45],
      iconAnchor: [20, 37],
      popupAnchor: [1, -25],
    }),
    "White Arkitekter": new L.Icon({
      iconUrl: design_whiteArkitekter,
      iconSize: [45, 45],
      iconAnchor: [20, 37],
      popupAnchor: [1, -25],
    }),
    "LKAB,White Arkitekter": new L.Icon({
      iconUrl: design_LKAB_whiteArkitekter,
      iconSize: [45, 45],
      iconAnchor: [20, 37],
      popupAnchor: [1, -25],
    }),
    "Kiruna kommun,White Arkitekter": new L.Icon({
      iconUrl: design_kommun_whiteArkitekter,
      iconSize: [45, 45],
      iconAnchor: [20, 37],
      popupAnchor: [1, -25],
    }),
    "Kiruna kommun": new L.Icon({
      iconUrl: design_kommun,
      iconSize: [45, 45],
      iconAnchor: [20, 37],
      popupAnchor: [1, -25],
    }),
    "Others": new L.Icon({
      iconUrl: design_others,
      iconSize: [45, 45],
      iconAnchor: [20, 37],
      popupAnchor: [1, -25],
    }),
  },
  "Material effect": {
    "LKAB": new L.Icon({
      iconUrl: material_LKAB,
      iconSize: [50, 50],
      iconAnchor: [20, 37],
      popupAnchor: [1, -25],
    }),
    "Others": new L.Icon({
      iconUrl: material_others,
      iconSize: [45, 45],
      iconAnchor: [20, 37],
      popupAnchor: [1, -25],
    }),
  },
  "Technical document": {
    "White Arkitekter": new L.Icon({
      iconUrl: technical_whiteArkitekter,
      iconSize: [45, 45],
      iconAnchor: [20, 37],
      popupAnchor: [1, -25],
    }),
    "Country": new L.Icon({
      iconUrl: technical_Country,
      iconSize: [45, 45],
      iconAnchor: [20, 37],
      popupAnchor: [1, -25],
    }),
    "LKAB,White Arkitekter": new L.Icon({
      iconUrl: technical_LKAB_whiteArkitekter,
      iconSize: [45, 45],
      iconAnchor: [20, 37],
      popupAnchor: [1, -25],
    }),
    "LKAB": new L.Icon({
      iconUrl: technical_LKAB,
      iconSize: [45, 45],
      iconAnchor: [20, 37],
      popupAnchor: [1, -25],
    }),
    "Kiruna kommun": new L.Icon({
      iconUrl: technical_kommun,
      iconSize: [45, 45],
      iconAnchor: [20, 37],
      popupAnchor: [1, -25],
    }),
    "Kiruna kommun,White Arkitekter": new L.Icon({
      iconUrl: technical_kommun_whiteArkitekter,
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

const getIconUrlForDocument = (type, stakeholders) => {
  if (iconMapping[type]) {
    const stakeholdersKey = stakeholders.sort().join(",");
    const icon = iconMapping[type][stakeholdersKey];
    return icon?.options?.iconUrl || defaultIcon.options.iconUrl;
  }
  return defaultIcon.options.iconUrl;
};


export { iconMapping, getIconForDocument, defaultIcon, getIconUrlForDocument };