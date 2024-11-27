// App.js
import { Container, Row } from "react-bootstrap";
import { Routes, Route, Outlet } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ListDocuments from "./components/ListDocuments";
import SplashPage from "./components/SplashPage";
import "bootstrap-icons/font/bootstrap-icons.css";
import Map from "./components/Map";
import { LoginComponent } from "./components/LoginPage";
import "./App.css";
import { useState } from "react";
import API from "./API";

function App() {
  const [user, setUser] = useState(null);
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = async (credentials) => {
    console.log("App.handleLogin", credentials);
    const user = await API.logIn(credentials);
    setUser(user);
    setLoggedIn(true);
  }
  
  const handleLogout = async () => {
    await API.logOut();
    setLoggedIn(false);
    setUser(null);
  }

  return (
    <div>
      <Header loggedIn={loggedIn} userInfo={user} logout={handleLogout}/>
      <Container fluid className="d-flex flex-column min-vh-100 p-0 mt-5">
        <Routes>
          <Route
            element={
              <>
                <Outlet />
              </>
            }
          >
            <Route path="/documents" element={<ListDocuments />} />
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
      <Footer />
    </div>
  );
}

export default App;
