import PropTypes from "prop-types";
import {
  getStakeholderColors,
  getDocumentTypeIcon,
} from "../utils/iconMapping";

const DocumentIcon = ({ documentType, stakeholders }) => {
  const iconClass = getDocumentTypeIcon(documentType);
  const color = getStakeholderColors(stakeholders);

  return (
    <div>
      <i className={iconClass} style={{ fontSize: "1.5rem", color: color }}></i>
    </div>
  );
};

DocumentIcon.propTypes = {
  documentType: PropTypes.string.isRequired,
  stakeholders: PropTypes.arrayOf(PropTypes.string).isRequired,
};

export default DocumentIcon;
