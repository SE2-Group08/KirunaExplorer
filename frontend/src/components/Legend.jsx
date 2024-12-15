// import PropTypes from "prop-types";
// import { Modal, Row, Col } from "react-bootstrap";
// // import { getIconUrlForDocument } from "../utils/iconMapping";
// import "../App.scss";

export default function LegendModal({ show, onHide }) {
    return (
        <></>
//         <Modal show={show} onHide={onHide} centered backdrop keyboard size="lg">
//             <Modal.Header closeButton>
//                 <Modal.Title>Legend</Modal.Title>
//             </Modal.Header>
//             <Modal.Body>
//                 <Row>
//                     {/* Document Types Column */}
//                     <Col xs={12} md={4} className="mb-4">
//                         <Row className="mb-2">
//                             <strong>Document types:</strong>
//                         </Row>
//                         <Row>
//                             <ul className="list-unstyled m-0">
//                                 <li className="d-flex align-items-center mb-2">
//                                     <img
//                                         src={getIconUrlForDocument("Informative document", ["LKAB"])}
//                                         alt="Informative document icon"
//                                         className="me-1"
//                                         style={{ width: "30px", height: "30px" }}
//                                     />
//                                     Informative document
//                                 </li>
//                                 <li className="d-flex align-items-center mb-2">
//                                     <img
//                                         src={getIconUrlForDocument("Design document", ["LKAB"])}
//                                         alt="Design document icon"
//                                         className="me-1"
//                                         style={{ width: "30px", height: "30px" }}
//                                     />
//                                     Design document
//                                 </li>
//                                 <li className="d-flex align-items-center mb-2">
//                                     <img
//                                         src={getIconUrlForDocument("Technical document", ["LKAB"])}
//                                         alt="Technical document icon"
//                                         className="me-1"
//                                         style={{ width: "30px", height: "30px" }}
//                                     />
//                                     Technical document
//                                 </li>
//                                 <li className="d-flex align-items-center mb-2">
//                                     <img
//                                         src={getIconUrlForDocument("Prescriptive document", ["LKAB"])}
//                                         alt="Prescriptive document icon"
//                                         className="me-1"
//                                         style={{ width: "30px", height: "30px" }}
//                                     />
//                                     Prescriptive document
//                                 </li>
//                                 <li className="d-flex align-items-center">
//                                     <img
//                                         src={getIconUrlForDocument("Material effect", ["LKAB"])}
//                                         alt="Material effect icon"
//                                         className="me-1"
//                                         style={{ width: "30px", height: "30px" }}
//                                     />
//                                     Material effect
//                                 </li>
//                             </ul>
//                         </Row>
//                     </Col>

//                     {/* Stakeholders Column */}
//                     <Col xs={12} md={4} className="mb-4">
//                         <Row className="mb-2">
//                             <strong>Stakeholders:</strong>
//                         </Row>
//                         <Row>
//                             <ul className="list-unstyled m-0">
//                                 <li className="d-flex align-items-center mb-2">
//                                     <div
//                                         className="me-1"
//                                         style={{
//                                             width: "20px",
//                                             height: "20px",
//                                             backgroundColor: "#1A1B1D",
//                                         }}
//                                     ></div>
//                                     LKAB
//                                 </li>
//                                 <li className="d-flex align-items-center mb-2">
//                                     <div
//                                         className="me-1"
//                                         style={{
//                                             width: "20px",
//                                             height: "20px",
//                                             backgroundColor: "#7C615D",
//                                         }}
//                                     ></div>
//                                     Municipality
//                                 </li>
//                                 <li className="d-flex align-items-center mb-2">
//                                     <div
//                                         className="me-1"
//                                         style={{
//                                             width: "20px",
//                                             height: "20px",
//                                             backgroundColor: "#5B272E",
//                                         }}
//                                     ></div>
//                                     Central authority
//                                 </li>
//                                 <li className="d-flex align-items-center mb-2">
//                                     <div
//                                         className="me-1"
//                                         style={{
//                                             width: "20px",
//                                             height: "20px",
//                                             backgroundColor: "#AAA598",
//                                         }}
//                                     ></div>
//                                     Architecture firms
//                                 </li>
//                                 <li className="d-flex align-items-center mb-2">
//                                     <div
//                                         className="me-1"
//                                         style={{
//                                             width: "20px",
//                                             height: "20px",
//                                             backgroundColor: "#ACC9CC",
//                                         }}
//                                     ></div>
//                                     Residents
//                                 </li>
//                                 <li className="d-flex align-items-center">
//                                     <div
//                                         className="me-1"
//                                         style={{
//                                             width: "20px",
//                                             height: "20px",
//                                             backgroundColor: "#869B9E",
//                                         }}
//                                     ></div>
//                                     Others
//                                 </li>
//                             </ul>
//                         </Row>
//                     </Col>

//                     {/* Link Types Column */}
//                     <Col xs={12} md={4} className="mb-4">
//                         <Row className="mb-2">
//                             <strong>Link type:</strong>
//                         </Row>
//                         <Row>
//                             <ul className="list-unstyled m-0">
//                                 <li className="d-flex align-items-center mb-2">
//                                     <strong
//                                         className="me-1"
//                                         style={{
//                                             backgroundColor: "#e9ecef",
//                                             borderRadius: "4px",
//                                             padding: "2px 6px",
//                                             fontSize: "12px",
//                                             fontWeight: "bold",
//                                         }}
//                                     >
//                                         P
//                                     </strong>
//                                     Prevision
//                                 </li>
//                                 <li className="d-flex align-items-center mb-2">
//                                     <strong
//                                         className="me-1"
//                                         style={{
//                                             backgroundColor: "#e9ecef",
//                                             borderRadius: "4px",
//                                             padding: "2px 6px",
//                                             fontSize: "12px",
//                                             fontWeight: "bold",
//                                         }}
//                                     >
//                                         DC
//                                     </strong>
//                                     Direct Consequence
//                                 </li>
//                                 <li className="d-flex align-items-center mb-2">
//                                     <strong
//                                         className="me-1"
//                                         style={{
//                                             backgroundColor: "#e9ecef",
//                                             borderRadius: "4px",
//                                             padding: "2px 6px",
//                                             fontSize: "12px",
//                                             fontWeight: "bold",
//                                         }}
//                                     >
//                                         CC
//                                     </strong>
//                                     Collateral Consequence
//                                 </li>
//                                 <li className="d-flex align-items-center">
//                                     <strong
//                                         className="me-1"
//                                         style={{
//                                             backgroundColor: "#e9ecef",
//                                             borderRadius: "4px",
//                                             padding: "2px 6px",
//                                             fontSize: "12px",
//                                             fontWeight: "bold",
//                                         }}
//                                     >
//                                         U
//                                     </strong>
//                                     Update
//                                 </li>
//                             </ul>
//                         </Row>
//                     </Col>
//                 </Row>
//             </Modal.Body>
//         </Modal>
    );
}

// LegendModal.propTypes = {
//     show: PropTypes.bool.isRequired,
//     onHide: PropTypes.func.isRequired,
// };