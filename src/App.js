import React from "react";
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "../src/css/global.css";
import "../src/components/CustomComponents/CustomTable/CustomTable.css"
import Login from "./components/AccessManagement/Login";
import Signup from "./components/AccessManagement/Signup";
import Home from "./components/Home/Home";
import DashBoard from "./components/Accounts/DashBoard/DashBoard";
import Error from "./components/Error";
import Auth from "./components/AccessManagement/Auth";
import BackOfficeDashboard from "./components/BackOffice/BackOfficeDashboard";
import Header from "./components/Accounts/Header/Header";
import Footer from "./components/Accounts/Footer/Footer";

function App() {

  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenWidth = () => {
      if (window.innerWidth < 1366) {
        setIsSmallScreen(true);
      } else {
        setIsSmallScreen(false);
      }
    };

    checkScreenWidth();

    window.addEventListener("resize", checkScreenWidth);

    return () => window.removeEventListener("resize", checkScreenWidth);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/*" element={<Login />} />
        <Route path="/signup/*" element={<Signup />} />
        <Route
          path="/accounts/*"
          element={
            <Auth>
              <div className="swift-dashboard-main-wrapper">
                {isSmallScreen ? (<div className="swift-small-screen-container">
                  <div className="analysis-pending">
                    <p className="analysis-pending-heading">Oops!</p>
                    <p className="analysis-pending-content">
                      This screeen is not sufficient for optimum display of our
                      platform. The minimun screen resolution required is 1366 x 768
                    </p>
                  </div>
                </div>) :
                  (<>
                    <Header />
                    <DashBoard />
                    <Footer />
                  </>)}
              </div>
            </Auth>
          }
        />
        <Route
          path="/back-office/*"
          element={
            <Auth>
              {isSmallScreen ? (
                <div className="analysis-pending">
                  <p className="analysis-pending-heading">Oops!</p>
                  <p className="analysis-pending-content">
                    This screeen is not sufficient for optimum display of our
                    platform. The minimun screen resolution required is 1366 x 768
                  </p>
                </div>
              ) :
                (<>
                  <BackOfficeDashboard />
                </>)}
            </Auth>
          }
        />
        <Route path="/404" element={<Error />} />
      </Routes>
    </Router >
  );
}

export default App;
