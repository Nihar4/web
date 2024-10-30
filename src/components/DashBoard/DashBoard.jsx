import React, { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Header from "../Accounts/Header/Header";
import Footer from "../Accounts/Footer/Footer";
import Pulse from "../Loader/Pulse";
import AssetAllocation from "../Accounts/AssetManagement/AssetAllocation";
import PortfolioManagement from "../Accounts/PortfolioManagement/PortfolioManagement";
import { AddStrategyPortfolio } from "../Accounts/PortfolioManagement/AddStrategyPortfolio";
import {
  AddStrategyMain,
  StrategyCreated,
} from "../Accounts/AssetManagement/AddStrategy";
import JobQueue from "../Accounts/JobQueue/JobQueue";
import CustomButton from "../CustomComponents/CustomButton/CustomButton";

const Dashboard = () => {
  const [loading, setLoading] = useState(false);

  const MainLayout = ({ children }) => {
    return (
      <>
        <Header setLoading={setLoading} />
        {children}
        <Footer />
      </>
    );
  };

  return loading ? (
    <div className="swift-aseet-loader">
      <p>Loading</p>
      <Pulse />
    </div>
  ) : (
    <Routes>
      <Route
        path="/dashboard/asset"
        element={
          <MainLayout>
            <AssetAllocation />
          </MainLayout>
        }
      />
      <Route
        path="/dashboard/portfolio-management"
        element={
          <>
            <Header setLoading={setLoading} />
            <PortfolioManagement />
            <Footer />
          </>
        }
      />
      <Route
        path="/dashboard/portfolio-management/addstrategy/:id"
        element={
          <MainLayout>
            <AddStrategyPortfolio />
          </MainLayout>
        }
      />
      <Route
        path="/dashboard/portfolio-management/addstrategy"
        element={
          <MainLayout>
            <AddStrategyPortfolio />
          </MainLayout>
        }
      />
      <Route
        path="/dashboard"
        element={
          <MainLayout>
            <DashboardMain />
          </MainLayout>
        }
      />
      <Route
        path="/dashboard/addstrategy/:id"
        element={
          <MainLayout>
            <AddStrategyMain />
          </MainLayout>
        }
      />
      <Route
        path="/dashboard/addstrategy"
        element={
          <MainLayout>
            <AddStrategyMain />
          </MainLayout>
        }
      />
      <Route
        path="/dashboard/strategy"
        element={
          <MainLayout>
            <StrategyCreated />
          </MainLayout>
        }
      />
      <Route
        path="/dashboard/jobqueue"
        element={
          <MainLayout>
            <JobQueue />
          </MainLayout>
        }
      />
      {/* <Route
        path="/dashboard/edurekahedge"
        element={
          <MainLayout>
            <EdurekaHedge />
          </MainLayout>
        }
      />
      <Route
        path="/dashboard/eureka/addstrategy/:id"
        element={
          <MainLayout>
            <AddStrategyMain_Eureka />
          </MainLayout>
        }
      />
      <Route
        path="/dashboard/eureka/addstrategy"
        element={
          <MainLayout>
            <AddStrategyMain_Eureka />
          </MainLayout>
        }
      />
      <Route
        path="/dashboard/eureka/strategy"
        element={
          <MainLayout>
            <StrategyCreated_Eureka />
          </MainLayout>
        }
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
