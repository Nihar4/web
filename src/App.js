import React from "react";
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

function App() {
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
                <Header />
                <DashBoard />
              </div>
            </Auth>
          }
        />
        <Route
          path="/back-office/*"
          element={
            <Auth>
              <BackOfficeDashboard />
            </Auth>
          }
        />
        <Route path="/404" element={<Error />} />
      </Routes>
    </Router>
  );
}

export default App;
