import { Container, Row, Toast, ToastBody } from "react-bootstrap";
import { Routes, Route, Outlet, useNavigate, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer"; // Import the Footer component
import ListDocuments from "./components/ListDocuments";
import SplashPage from "./components/SplashPage";
import "bootstrap-icons/font/bootstrap-icons.css";
import Map from "./components/Map";
import { LoginComponent } from "./components/LoginPage";
import { useEffect, useState } from "react";
import API from "./API";  // Make sure this is pointing to the updated API code
import "./App.scss";
import FeedbackContext from "./contexts/FeedbackContext";
import Diagram from "./components/Diagram";

function App() {
    const [userInfo, setUserInfo] = useState(null);
    const [authToken, setAuthToken] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const [isUrbanPlanner, setIsUrbanPlanner] = useState(false);

    const [feedback, setFeedback] = useState("");
    const [shouldRefresh, setShouldRefresh] = useState(true);

    const setFeedbackFromError = (error) => {
        let msg = "";
        if (error.message) {
            msg = error.message;
        } else {
            msg = "Unknown error";
        }
        setFeedback({ type: "danger", message: msg });
    };

    const navigate = useNavigate();

    useEffect(() => {
        const verifyUserLoggedIn = async () => {
            const isUserLoggedIn = await API.getUserInfo(authToken);
            if (isUserLoggedIn) {
                setLoggedIn(true);
                if (userInfo) {
                    setIsUrbanPlanner(userInfo.role === 'URBAN_PLANNER');
                }
            } else {
                setLoggedIn(false);
                setUserInfo(null);
                setIsUrbanPlanner(false);
            }
        };
        verifyUserLoggedIn();
    }, [authToken, userInfo]);

    const handleLogin = async (credentials) => {
        try {
            const user = await API.logIn(credentials);
            setUserInfo(user);
            setAuthToken(user.token); // Store the token in state instead of localStorage
            setIsUrbanPlanner(user.role === 'URBAN_PLANNER');
            setLoggedIn(true);
        } catch (err) {
            setLoggedIn(false);
            setUserInfo(null);
            throw new Error(err.message);
        }
    };

    const handleLogout = async () => {
        try {
            await API.logOut(authToken);
            setUserInfo(null);
            setAuthToken(null);
            setLoggedIn(false);
            navigate("/login");
        } catch (err) {
            setFeedbackFromError(err);
        }
    };

    return (
        <FeedbackContext.Provider
            value={{ setFeedback, setFeedbackFromError, setShouldRefresh }}
        >
            <div className="d-flex flex-column min-vh-100">
                <Header loggedIn={loggedIn} logout={handleLogout} isUrbanPlanner={isUrbanPlanner} />
                <Container fluid className="flex-grow-1 p-0 mt-5">
                    <Routes>
                        <Route element={<Outlet />}>
                            <Route path="/documents" element={
                                (loggedIn && isUrbanPlanner) ? (
                                    <ListDocuments shouldRefresh={shouldRefresh} loggedIn={loggedIn} isUrbanPlanner={isUrbanPlanner} authToken={authToken} />
                                ) : (
                                    <Navigate to="/login" />
                                )}
                            />
                            <Route path="/map" element={<Map />} />
                            <Route path="/diagram" element={<Diagram />} />
                            <Route path="/login" element={<LoginComponent login={handleLogin} />} />
                            <Route path="/" element={<SplashPage loggedIn={loggedIn} />} />
                            <Route
                                path="*"
                                element={
                                    <Container className="d-flex justify-content-center align-items-center min-vh-100">
                                        <Row className="text-center">
                                            <h1>404 Not Found</h1>
                                            <p>Try searching for something else</p>
                                        </Row>
                                    </Container>
                                }
                            />
                        </Route>
                    </Routes>
                    <Toast
                        show={feedback !== ""}
                        autohide
                        onClose={() => setFeedback("")}
                        delay={4000}
                        className="notification-toast"
                    >
                        <ToastBody>
                            {feedback.type === "danger" && <i className="bi bi-exclamation-circle-fill text-danger me-2"></i>}
                            {feedback.type === "success" && <i className="bi bi-check-circle-fill text-success me-2"></i>}
                            {feedback.message}
                        </ToastBody>
                    </Toast>
                </Container>
                <Footer /> {/* Add the Footer component */}
            </div>
        </FeedbackContext.Provider>
    );
}

export default App;