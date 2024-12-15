// import L from "leaflet";
import actionDocument from "../public/icons/Action.png";
import agreementDocument from "../public/icons/Agreement.png";
import designDocument from "../public/icons/Design-document.png";
import informativeDocument from "../public/icons/Informative-document.png";
import prescpritiveDocument from "../public/icons/Prescriptive-document.png";
import technicalDocument from "../public/icons/Technical-document.png";

const stakeholderColors = {
  "LKAB": "#191A19",
  "Municipality": "#755953",
  "Regional authority": "#51232A",
  "Architecture firms": "#A39E8C",
  "Residents": "#A3C5C1",
  "default": "#7D9593"
};

const documentTypeIcons = {
  "Action document": "bi bi-file-earmark-arrow-down-fill",
  "Agreement document": "bi bi-hand-thumbs-up-fill",
  "Design document": "bi bi-house-door-fill",
  "Informative document": "bi bi-info-circle-fill",
  "Prescriptive document": "bi bi-arrow-right-circle-fill",
  "Technical document": "bi bi-gear-fill",
  "default": "bi bi-file-earmark-text-fill"
}

export const getStakeholderColors = (stakeholders) => {
  if (stakeholders.length > 1) {
    return [stakeholderColors.default];
  }
  return stakeholderColors[stakeholders[0]] || stakeholderColors.default;
}

export const getDocumentTypeIcon = (documentType) => {
  return documentTypeIcons[documentType] || documentTypeIcons.default;
}


// Icon mapping
// const iconMapping = {
//   "Prescriptive document": {
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
// };

// const defaultIcon = new L.Icon({
//   iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
//   popupAnchor: [1, -34],
//   shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
//   shadowSize: [41, 41],
// });

// const getIconForDocument = (type, stakeholders) => {
//   if (iconMapping[type]) {
//     const stakeholdersKey = stakeholders.sort().join(",");
//     return iconMapping[type][stakeholdersKey] || defaultIcon;
//   }
//   return defaultIcon;
// };

// const getIconUrlForDocument = (type, stakeholders) => {
//   if (iconMapping[type]) {
//     const stakeholdersKey = stakeholders.sort().join(",");
//     const icon = iconMapping[type][stakeholdersKey];
//     return icon?.options?.iconUrl || defaultIcon.options.iconUrl;
//   }
//   return defaultIcon.options.iconUrl;
// };


// export { iconMapping, getIconForDocument, defaultIcon, getIconUrlForDocument };