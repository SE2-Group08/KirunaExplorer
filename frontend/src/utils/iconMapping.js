import L from "leaflet";
import prescpritiveDocument_LKAB from "../public/icons/Prescriptive-document-LKAB.png";
import designDocument_LKAB from "../public/icons/Design-document-LKAB.png";
import actionDocument_LKAB from "../public/icons/Action-LKAB.png";
import informativeDocument_LKAB from "../public/icons/Informative-document-LKAB.png";
import technicalDocument_LKAB from "../public/icons/Technical-document-LKAB.png";
import prescriptiveDocument_Kommun from "../public/icons/Prescriptive-document-KOMMUN.png";
import informativeDocument_KommunResidents from "../public/icons/Informative-document-KOMMUN-RESIDENTS.png";
import designDocument_KommunWhiteArkitekter from "../public/icons/Design-document-KOMMUN-ARKITEKTER.png";

// Icon mapping
const iconMapping = {
// "Prescriptive document": {
//     LKAB: new L.Icon({
//       iconUrl: prescpritiveDocument_LKAB,
//       iconSize: [45, 45],
//       iconAnchor: [20, 37],
//       popupAnchor: [1, -25],
//     }),
//     "Kiruna kommun": new L.Icon({
//       iconUrl: prescriptiveDocument_Kommun,
//       iconSize: [45, 45],
//       iconAnchor: [20, 37],
//       popupAnchor: [1, -25],
//     }),
//   },
//   "Informative document": {
//     LKAB: new L.Icon({
//       iconUrl: informativeDocument_LKAB,
//       iconSize: [45, 45],
//       iconAnchor: [20, 37],
//       popupAnchor: [1, -25],
//     }),
//     "Kiruna kommun,Residents": new L.Icon({
//       iconUrl: informativeDocument_KommunResidents,
//       iconSize: [45, 45],
//       iconAnchor: [20, 37],
//       popupAnchor: [1, -25],
//     }),
//   },
//   "Design document": {
//     LKAB: new L.Icon({
//       iconUrl: designDocument_LKAB,
//       iconSize: [45, 45],
//       iconAnchor: [20, 37],
//       popupAnchor: [1, -25],
//     }),
//     "Kiruna kommun,White Arkitekter": new L.Icon({
//       iconUrl: designDocument_KommunWhiteArkitekter,
//       iconSize: [45, 45],
//       iconAnchor: [20, 37],
//       popupAnchor: [1, -25],
//     }),
//   },
//   "Material effect": {
//     LKAB: new L.Icon({
//       iconUrl: actionDocument_LKAB,
//       iconSize: [45, 45],
//       iconAnchor: [20, 37],
//       popupAnchor: [1, -25],
//     }),
//   },
//   "Technical document": {
//     LKAB: new L.Icon({
//       iconUrl: technicalDocument_LKAB,
//       iconSize: [45, 45],
//       iconAnchor: [20, 37],
//       popupAnchor: [1, -25],
//     }),
//   },

  "Prescriptive document": new L.Icon({
    iconUrl: prescpritiveDocument_LKAB,
    iconSize: [45, 45],
    iconAnchor: [20, 37],
    popupAnchor: [1, -25],
  }),
  "Informative document": new L.Icon({
    iconUrl: informativeDocument_LKAB,
    iconSize: [45, 45],
    iconAnchor: [20, 37],
    popupAnchor: [1, -25],
  }),
  "Design document": new L.Icon({
    iconUrl: designDocument_LKAB,
    iconSize: [45, 45],
    iconAnchor: [20, 37],
    popupAnchor: [1, -25],
  }),
  "Material effect": new L.Icon({
    iconUrl: actionDocument_LKAB,
    iconSize: [45, 45],
    iconAnchor: [20, 37],
    popupAnchor: [1, -25],
  }),
  "Technical document": new L.Icon({
    iconUrl: technicalDocument_LKAB,
    iconSize: [45, 45],
    iconAnchor: [20, 37],
    popupAnchor: [1, -25],
  }),
};

const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

// const getIconForDocument = (type, stakeholders) => {
//   if (iconMapping[type]) {
//     const stakeholdersKey = stakeholders.sort().join(",");
//     return iconMapping[type][stakeholdersKey] || defaultIcon;
//   }
//   return defaultIcon;
const getIconForDocument = (type) => {
  return iconMapping[type] || defaultIcon;
};

// const getIconUrlForDocument = (type, stakeholders) => {
//   if (iconMapping[type]) {
//     const stakeholdersKey = stakeholders.sort().join(",");
//     const icon = iconMapping[type][stakeholdersKey];
//     return icon?.options?.iconUrl || defaultIcon.options.iconUrl;
//   }
//   return defaultIcon.options.iconUrl;
// };
const getIconUrlForDocument = (type) => {
  return iconMapping[type]?.options?.iconUrl || defaultIcon.options.iconUrl;
};

export { iconMapping, getIconForDocument, defaultIcon, getIconUrlForDocument };
