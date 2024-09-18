import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import BackOfficeDashboardMain from "./BackOfficeDashboardMain";
import BackOfficeHeader from "./BackOfficeHeader";
import "../../css/BackOffice/BackOfficeMain.css";

const BackOfficeDashboard = () => {
  const email_id = localStorage.getItem("userData")
    ? localStorage.getItem("userData")
    : null;

  return (
    <div className="swift-back-office-wrapper">
      <BackOfficeHeader />
      <Routes>
        <Route path="/" element={<BackOfficeDashboardMain />} />
      </Routes>
    </div>
  );
};

export default BackOfficeDashboard;
