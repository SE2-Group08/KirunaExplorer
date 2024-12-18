import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import {allowedLanguages} from "./allowedLanguages";

dayjs.extend(customParseFormat);

export const validateForm = (
  document,
  combinedIssuanceDate,
  kirunaBorderCoordinates
) => {
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

  const typeError = validateType(document.type);
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

  const geolocationErrors = validateGeolocation(
    document.geolocation,
    kirunaBorderCoordinates
  );
  console.log(geolocationErrors)
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
  } else if (title.trim().length < 2 || title.length > 64) {
    return "Title must be between 2 and 64 characters.";
  }

  return null;
};

const validateStakeholders = (stakeholders) => {
  if (
    !Array.isArray(stakeholders) ||
    stakeholders.length === 0 ||
    stakeholders.some((s) => typeof s !== "string" || !s.trim())
  ) {
    return "At least one stakeholder is required, and all must be non-empty strings.";
  } else if (
    new Set(stakeholders.map((s) => s.trim().toLowerCase())).size !==
    stakeholders.length
  ) {
    return "Stakeholders must not contain duplicates.";
  } else if (stakeholders.some((s) => s.trim().toLowerCase() === "other")) {
    return "Stakeholders cannot be named 'other'.";
  } else if (
    stakeholders.some((s) => s.trim().length < 2 || s.trim().length > 64)
  ) {
    return "Each stakeholder must be between 2 and 64 characters.";
  }
  return null;
};

const validateScale = (scale) => {
  const pattern = /^(1:[1-9]\d*$|[a-zA-Z\s/]+)$/;
  if (!pattern.test(scale)) {
    return "Scale must match the pattern '1:x' where x is a positive integer, or be a textual scale.";
  } else if (typeof scale !== "string" || !scale.trim()) {
    return "Scale is required.";
  } else if (scale.trim().length < 2 || scale.length > 64) {
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
  if (
    !combinedIssuanceDate ||
    typeof combinedIssuanceDate !== "string" ||
    !dayjs(
      combinedIssuanceDate,
      ["YYYY-MM-DD", "YYYY-MM", "YYYY"],
      true
    ).isValid()
  ) {
    return "Issuance date is required and must be in the format DD/MM/YYYY, MM/YYYY or YYYY.";
  }
  return null;
};

const validateType = (type) => {
  if (!type.trim()) {
    return "Type is required.";
  } else if (type === "Other") {
    return "Type cannot be 'Other'.";
  } else if (type.length > 64 || type.trim().length < 2) {
    return "Type must be between 2 and 64 characters.";
  }
  return null;
};

const validateLanguage = (language) => {
  if (language) {
    if (/\d/.test(language)) {
      return "Language must not contain numbers.";
    }
    if (language.trim().length < 2 || language.length > 64) {
      return "Language must be between 2 and 64 characters.";
    }
    if (!allowedLanguages.has(language.trim())) {
      return `The language '${language}' is not supported.`;
    }
  }
  return null;
};

const validateNrPages = (nrPages) => {
  if (nrPages) {
    if (!Number.isInteger(nrPages)) {
      return "Number of pages must be an integer.";
    } else if (nrPages < 1) {
      return "Number of pages must be a positive integer.";
    }
  }
  return null;
};

const validateGeolocation = (geolocation, kirunaBorderCoordinates) => {
  const newErrors = {};
  if (geolocation.pointCoordinates) {
    const point = {
      lat: geolocation.pointCoordinates.coordinates.latitude,
      lng: geolocation.pointCoordinates.coordinates.longitude
    };

    const [x, y] = [point.lng, point.lat]; // Ensure [lng, lat]

    const switchCoordinates = (polygon) => {
      return polygon.map(ring => ring.map(([lat, lng]) => [lng, lat]));
    };

    const isPointInRing = (point, ring) => {
      let inside = false;

      for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
        const [xi, yi] = ring[i];
        const [xj, yj] = ring[j];

        const intersect =
            yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
        if (intersect) inside = !inside;
      }

      return inside;
    };

    const isPointInPolygon = (point, polygon) => {
      const [outerRing, ...holes] = polygon;

      if (!isPointInRing(point, outerRing)) return false;

      for (const hole of holes) {
        if (isPointInRing(point, hole)) return false;
      }

      return true;
    };

    let insideAnyPolygon = false;

    for (const polygon of kirunaBorderCoordinates) {
      const switchedPolygon = switchCoordinates(polygon);
      if (isPointInPolygon([x, y], switchedPolygon)) {
        insideAnyPolygon = true;
        break;
      }
    }

    console.log(insideAnyPolygon);
    if (!insideAnyPolygon) {
      newErrors.latitude = "Geolocation must be within the Kiruna boundary.";
      newErrors.longitude = "Geolocation must be within the Kiruna boundary.";
    }
  }

  return newErrors;
};

const validateDescription = (description) => {
  if (description && description.length > 1000) {
    return "Description must not exceed 1000 characters.";
  }
  return null;
};
