import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

export const validateForm = (document, combinedIssuanceDate, kirunaBorderCoordinates) => {
    const newErrors = {};

    const titleError = validateTitle(document.title);
    if (titleError) {
        newErrors.title = titleError;
    }

    const stakeholdersError = validateStakeholders(document.stakeholders);
    if (stakeholdersError) {
        newErrors.stakeholders = stakeholdersError;
    }

    const scaleError = validateScale(document.scale);
    if (scaleError) {
        newErrors.scale = scaleError;
    }

    const issuanceDateError = validateIssuanceDate(combinedIssuanceDate);
    if (issuanceDateError) {
        newErrors.issuanceDate = issuanceDateError;
    }

    const typeError = validateType(document.type, document.customType);
    if (typeError) {
        newErrors.type = typeError;
    }

    const languageError = validateLanguage(document.language);
    if (languageError) {
        newErrors.language = languageError;
    }

    const nrPagesError = validateNrPages(document.nrPages);
    if (nrPagesError) {
        newErrors.nrPages = nrPagesError;
    }

    const geolocationErrors = validateGeolocation(document.geolocation, kirunaBorderCoordinates);
    if (Object.keys(geolocationErrors).length > 0) {
        newErrors.geolocation = geolocationErrors;
    }

    const descriptionError = validateDescription(document.description);
    if (descriptionError) {
        newErrors.description = descriptionError;
    }

    return newErrors;
};

const validateTitle = (title) => {
    if (typeof title !== "string" || !title.trim()) {
      return "Title is required and must be a non-empty string.";
    } else if (title.length < 2) {
      return "Title must be at least 2 characters.";
    } else if (title.length > 64) {
      return "Title must be less than 64 characters.";
    }
    return null;
  };
  
  const validateStakeholders = (stakeholders) => {
    if (!Array.isArray(stakeholders) || stakeholders.length === 0 || stakeholders.some((s) => typeof s !== "string" || !s.trim())) {
      return "At least one stakeholder is required, and all must be non-empty strings.";
    } else if (new Set(stakeholders.map((s) => s.trim().toLowerCase())).size !== stakeholders.length) {
      return "Stakeholders must not contain duplicates.";
    } else if (stakeholders.some((s) => s.trim().toLowerCase() === "other")) {
      return "Stakeholders cannot be named 'other'.";
    } else if (stakeholders.some((s) => s.trim().length < 2 || s.trim().length > 64)) {
      return "Each stakeholder must be between 2 and 64 characters.";
    }
    return null;
  };
  
  const validateScale = (scale) => {
    if (typeof scale !== "string" || !scale.trim()) {
      return "Scale is required and must match one of the defined patterns.";
    } else if (scale.length < 2 || scale.length > 64) {
      return "Scale must be between 2 and 64 characters.";
    } else if (scale.includes(":")) {
      const [first, second] = scale.split(":").map(Number);
      if (first > second) {
        return "The first number of the scale must be smaller than the second one.";
      }
    }
    return null;
  };
  
  const validateIssuanceDate = (combinedIssuanceDate) => {
    if (typeof combinedIssuanceDate !== "string" || !dayjs(combinedIssuanceDate, ["YYYY-MM-DD", "YYYY-MM", "YYYY"], true).isValid()) {
      return "Issuance date is required and must be in the format DD/MM/YYYY, MM/YYYY or YYYY.";
    }
    return null;
  };
  
  const validateType = (type, customType) => {
    if (!type || (type === "Other" && !customType)) {
      return "Type is required.";
    } else if (type === "Other") {
      return "Type cannot be 'Other'.";
    } else if (type.length > 64 || type.length < 2) {
      return "Type must be between 2 and 64 characters.";
    }
    return null;
  };
  
  const validateLanguage = (language) => {
    if (language && (language.length < 2 || language.length > 64)) {
      return "Language must be between 2 and 64 characters.";
    }
    return null;
  };
  
  const validateNrPages = (nrPages) => {
    if (nrPages && typeof nrPages !== "number") {
      return "Number of pages must be an integer.";
    }
    return null;
  };
  
  const validateGeolocation = (geolocation, kirunaBorderCoordinates) => {
    const newErrors = {};
    if (geolocation.latitude && geolocation.longitude) {
      const point = { lat: geolocation.latitude, lng: geolocation.longitude };
      const kirunaBorderCoordinatesLngLat = kirunaBorderCoordinates.map(([lat, lng]) => [lng, lat]);
      const polygon = [...kirunaBorderCoordinatesLngLat, kirunaBorderCoordinatesLngLat[0]]; // Close the loop
      const [x, y] = [point.lng, point.lat]; // Ensure [lng, lat]
      let inside = false;
  
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        const [xi, yi] = polygon[i];
        const [xj, yj] = polygon[j];
  
        const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
      }
  
      if (!inside) {
        newErrors.latitude = "Geolocation must be within the Kiruna boundary.";
        newErrors.longitude = "Geolocation must be within the Kiruna boundary.";
      }
    }
    if ((geolocation.latitude || geolocation.longitude) && geolocation.municipality === "Entire municipality") {
      newErrors.municipality = "Geolocation must be 'Entire municipality' or a valid coordinate.";
    }
    return newErrors;
  };
  
  const validateDescription = (description) => {
    if (description && description.length > 1000) {
      return "Description must not exceed 1000 characters.";
    }
    return null;
  };

