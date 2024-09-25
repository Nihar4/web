import React from "react";
import CustomButton from "../../CustomComponents/CustomButton/CustomButton";
import { Routes, Route, useNavigate } from "react-router-dom";
import AssetAllocation from "../AssetManagement/AssetAllocation";
import PortfolioManagement from "../PortfolioManagement/PortfolioManagement";
import {
  AddStrategyPortfolio,
  PortfolioStrategyCreated,
} from "../PortfolioManagement/AddStrategyPortfolio";
import {
  AddStrategyMain,
  StrategyCreated,
} from "../AssetManagement/AddStrategy";
import JobQueue from "../JobQueue/JobQueue";

const Dashboard = () => {
  const email_id = localStorage.getItem("userData")
    ? localStorage.getItem("userData")
    : null;
  return (
    <Routes>
      <Route path="/dashboard/asset" element={<AssetAllocation />} />

      <Route
        path="/dashboard/portfolio-management"
        element={<PortfolioManagement />}
      />
      <Route
        path="/dashboard/portfolio-management/addstrategy/:id"
        element={<AddStrategyPortfolio />}
      />
      <Route
        path="/dashboard/portfolio-management/addstrategy/"
        element={<AddStrategyPortfolio />}
      />
      <Route
        path="/dashboard/portfolio-management/strategy"
        element={<PortfolioStrategyCreated />}
      />

      <Route path="/dashboard" element={<DashboardMain />} />
      <Route path="/dashboard/addstrategy/:id" element={<AddStrategyMain />} />
      <Route path="/dashboard/addstrategy/" element={<AddStrategyMain />} />
      <Route path="/dashboard/strategy" element={<StrategyCreated />} />
      <Route path="/dashboard/jobqueue" element={<JobQueue />} />
      {/* <Route path="/dashboard/edurekahedge" element={<EurekaHedge />} /> */}
      {/* <Route
        path="/dashboard/eureka/addstrategy/:id"
        element={<AddStrategyMain_Eureka />}
      />
      <Route
        path="/dashboard/eureka/addstrategy/"
        element={<AddStrategyMain_Eureka />}
      />
      <Route
        path="/dashboard/eureka/strategy/"
        element={<StrategyCreated_Eureka />}
      /> */}
    </Routes>
  );
};

const DashboardMain = () => {
  const navigate = useNavigate();

  const forward = () => {
    navigate("/accounts/dashboard/asset");
  };

  return (
    <div>
      <CustomButton
        text="Asset"
        classname="swift-accounts-content-button"
        onClick={forward}
      />
    </div>
  );
};

export default Dashboard;
