import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "../src/css/global.css";
import "../src/components/CustomComponents/CustomTable/CustomTable.css"
import Login from "./components/AccessManagement/Login";
import Signup from "./components/AccessManagement/Signup";
import Home from "./components/Home/Home";
import DashBoard from "./components/DashBoard/DashBoard";
import Error from "./components/Error";
import Searchbar from "./components/Accounts/Searchbar";
import SearchLive from "./components/Accounts/SearchLive";
import Sample from "./components/Sample";
import Auth from "./components/AccessManagement/Auth";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/table" element={<Sample />} /> */}
        <Route path="/login/*" element={<Login />} />
        <Route path="/signup/*" element={<Signup />} />
        <Route
          path="/accounts/*"
          element={
            <Auth>
              <DashBoard />
            </Auth>
          }
        />
        {/* <Route path='/addstrategy/:id' element={<AddStrategy />} /> Modify the route to include :id parameter */}
        <Route path="/404" element={<Error />} />
        {/* <Route path='/addstrategy' element={<AddStrategy />} /> */}
        <Route path="/search" element={<Searchbar />} />
        <Route path="/searchlive" element={<SearchLive />} />
      </Routes>
    </Router>
  );
}

export default App;
