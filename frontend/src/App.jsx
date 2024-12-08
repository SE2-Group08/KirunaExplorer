// App.js
import {Container, Row, Toast, ToastBody} from "react-bootstrap";
import {Routes, Route, Outlet, useNavigate} from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ListDocuments from "./components/ListDocuments";
import SplashPage from "./components/SplashPage";
import "bootstrap-icons/font/bootstrap-icons.css";
import Map from "./components/Map";
import {LoginComponent} from "./components/LoginPage";
import "./App.css";
import {useEffect, useState} from "react";
import API from "./API";
import "./App.scss";
import FeedbackContext from "./contexts/FeedbackContext";

function App() {
  const [userInfo, setUserInfo] = useState(null);
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
      const isUserLoggedIn = await API.getUserInfo();
      if (isUserLoggedIn) {
        setLoggedIn(true);
        setIsUrbanPlanner(true);
      } else {
        setLoggedIn(false);
        setUserInfo(null);
        setIsUrbanPlanner(false);
      }
    };

    verifyUserLoggedIn();
  }, []);

  const handleLogin = async (credentials) => {
    try {
      const user = await API.logIn(credentials);
      setUserInfo(user);
      setIsUrbanPlanner(user.role === 'URBAN_PLANNER');
      setLoggedIn(true);
    } catch (err) {
      setLoggedIn(false);
      setUserInfo(null);
      throw new Error(err.message);
    }
  };


  const handleLogout = async () => {
    await API.logOut()
    .then(() => {
      setUserInfo(null);
      setLoggedIn(false);
      navigate("/login");
    })
        .catch((error) => console.log(error));
  }

  return (
      <FeedbackContext.Provider
          value={{ setFeedback, setFeedbackFromError, setShouldRefresh }}
      >
        <div>
      <Header loggedIn={loggedIn} logout={handleLogout} isUrbanPlanner={isUrbanPlanner} />
      <Container fluid className="d-flex flex-column min-vh-100 p-0 mt-5">
        <Routes>
          <Route
            element={
              <>
                <Outlet/>
              </>
            }
          >
          { loggedIn && isUrbanPlanner &&
            <Route path="/documents" element={<ListDocuments shouldRefresh={shouldRefresh} />} /> }
            <Route path="/map" element={<Map />} />
            <Route path="/login" element={<LoginComponent login={handleLogin}/>} />
            <Route path="/" element={<SplashPage />} />
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
      </Container>
          <Toast
              show={feedback !== ""}
              autohide
              onClose={() => setFeedback("")}
              delay={4000}
              position="top-end"
              className="position-fixed end-0 m-3"
          >
            <ToastBody>
              {feedback.type === "danger" && <i className="bi bi-exclamation-circle-fill text-danger me-2"></i>}
              {feedback.type === "success" && <i className="bi bi-check-circle-fill text-success me-2"></i>}
              {feedback.message}
            </ToastBody>
          </Toast>
      <Footer/>
    </div>
      </FeedbackContext.Provider>
  );
}

export default App;