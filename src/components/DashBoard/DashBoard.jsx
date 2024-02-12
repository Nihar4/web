import React, { useEffect } from "react";
import CustomButton from "../CustomComponents/CustomButton/CustomButton";
import { useLocation, useNavigate } from "react-router-dom";
import AssetAllocation from "../Accounts/AssetAllocation";

const Dashboard = () => {
  const location = useLocation();
  useEffect(() => {
    console.log(location.pathname);
  }, [location.pathname]);
  return (
    <>
      {location.pathname === "/accounts/dashboard/asset" && <AssetAllocation />}
      {location.pathname === "/accounts/dashboard" && <DashboardMain />}
    </>
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
