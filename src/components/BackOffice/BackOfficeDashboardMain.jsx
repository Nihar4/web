import React, { useEffect, useState } from "react";
import BackOfficeStrategy from "./BackOfficeStrategy";
import CustomInput from "../CustomComponents/CustomInput/CustomInput";
import CustomError from "../CustomComponents/CustomError/CustomError";
import CustomInputError from "../CustomComponents/CustomInput/CustomInputError";
import CustomButton from "../CustomComponents/CustomButton/CustomButton";
import BackOfficeDashboardEdit from "./BackOfficeDashboardEdit";
import BackOfficeDashboardPreview from "./BackOfficeDashboardPreview";
import BackOfficeAddFund from "./BackOfficeAddFund";
import BackOfficeBodyLeft from "./BackOfficeBodyLeft";
import BackOfficeBodyRight from "./BackOfficeBodyRight";

import ServerRequest from "../../utils/ServerRequest";
import Pulse from "../Loader/Pulse";

const BackOfficeDashboardMain = () => {
  const [selectedfund, setSelectedFund] = useState();
  const [addFundName, setAddFundName] = useState("");
  const [currentpage, setCurrentPage] = useState("preview");
  const [reset, setReset] = useState(1);
  const [loading, setLoading] = useState(true);
  const [funds, setFunds] = useState([]);

  const email_id = localStorage.getItem("userData")
    ? localStorage.getItem("userData")
    : null;

  useEffect(() => {
    const fetchdata = async () => {
      setLoading(true);
      try {
        const data1 = await ServerRequest({
          method: "get",
          URL: `/back-office/funds/details?email=${email_id}`,
        });
        setFunds(data1.data);
        setSelectedFund(data1.data[0].id);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };
    fetchdata();
  }, [email_id]);

  useEffect(() => {
    const fetchdata = async () => {
      //  setLoading(true);
      try {
        const data1 = await ServerRequest({
          method: "get",
          URL: `/back-office/funds/details?email=${email_id}`,
        });
        setFunds(data1.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };
    fetchdata();
  }, [reset]);

  return loading ? (
    <div className="swift-aseet-loader">
      <p>Loading</p>
      <Pulse />
    </div>
  ) : (
    <div className="swift-back-office-main-wrapper">
      <BackOfficeStrategy
        funds={funds}
        setSelectedFund={setSelectedFund}
        selectedfund={selectedfund}
        setCurrentPage={setCurrentPage}
      />

      <div className="swift-back-office-main-content">
        {funds.length > 0 || currentpage == "add" ? (
          <>
            <BackOfficeBodyLeft
              setAddFundName={setAddFundName}
              addFundName={addFundName}
              currentpage={currentpage}
              setCurrentPage={setCurrentPage}
              funds={funds}
              selectedfund={selectedfund}
              setReset={setReset}
              setSelectedFund={setSelectedFund}
            />
            <BackOfficeBodyRight currentpage={currentpage} selectedfund={selectedfund}/>
          </>
        ) : (
          <>No Funds</>
        )}
      </div>
    </div>
  );
};

export default BackOfficeDashboardMain;
