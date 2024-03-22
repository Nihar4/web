import React from "react";
import CustomButton from "../CustomComponents/CustomButton/CustomButton";
import { Routes, Route, useNavigate } from "react-router-dom";
import AssetAllocation from "../Accounts/AssetAllocation";
import {AddStrategy,AddStrategyMain,StrategyCreated} from "../Accounts/AddStrategy";
import Jobqueu from "../Accounts/Jobqueu";

const Dashboard = () => {
  return (
    <Routes>
      <Route path="/dashboard/asset" element={<AssetAllocation />} />
      <Route path="/dashboard" element={<DashboardMain />} />
      <Route path="/dashboard/addstrategy/:id" element={<AddStrategyMain />} />
      <Route path="/dashboard/addstrategy/" element={<AddStrategyMain />} />
      <Route path="/dashboard/strategy" element={<StrategyCreated/>} />
      <Route path="/dashboard/jobqueue" element={<Jobqueu/>} />
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
