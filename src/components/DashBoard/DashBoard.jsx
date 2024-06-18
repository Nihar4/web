import React from "react";
import CustomButton from "../CustomComponents/CustomButton/CustomButton";
import { Routes, Route, useNavigate } from "react-router-dom";
import AssetAllocation from "../Accounts/AssetAllocation";
import {
  AddStrategy,
  AddStrategyMain,
  StrategyCreated,
} from "../Accounts/AddStrategy";
import Jobqueu from "../Accounts/Jobqueu";
import EdurekaHedge from "../Accounts/EdurekaHedge";
import {
  AddStrategyMain_Eureka,
  StrategyCreated_Eureka,
} from "../Accounts/AddStrategyEureka";
import Auth from "../AccessManagement/Auth";

const Dashboard = () => {
  return (
    <Routes>
      <Route path="/dashboard/asset" element={<AssetAllocation />} />
      <Route path="/dashboard" element={<DashboardMain />} />
      <Route path="/dashboard/addstrategy/:id" element={<AddStrategyMain />} />
      <Route path="/dashboard/addstrategy/" element={<AddStrategyMain />} />
      <Route path="/dashboard/strategy" element={<StrategyCreated />} />
      <Route path="/dashboard/jobqueue" element={<Jobqueu />} />
      <Route path="/dashboard/edurekahedge" element={<EdurekaHedge />} />
      <Route
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
      />
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
