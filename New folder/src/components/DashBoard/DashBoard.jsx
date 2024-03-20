import React from "react";
import CustomButton from "../CustomComponents/CustomButton/CustomButton";
import { Routes, Route, useNavigate } from "react-router-dom";
import AssetAllocation from "../Accounts/AssetAllocation";
import AddStrategy from "../Accounts/AddStrategy";
import StrategyCreated from "../Accounts/StrategyCreated";

const Dashboard = () => {
  return (
    <Routes>
      <Route path="/dashboard/asset" element={<AssetAllocation />} />
      <Route path="/dashboard" element={<DashboardMain />} />
      <Route path="/dashboard/addstrategy/:id" element={<AddStrategy />} />
      <Route path="/dashboard/addstrategy" element={<AddStrategy />} />
      <Route path="/dashboard/strategy" element={<StrategyCreated />} />
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
