import React, { useEffect, useRef, useState } from "react";
import ServerRequest from "../../../utils/ServerRequest";
import Pulse from "../../Loader/Pulse";
import moment from "moment";
import "../../../css/Accounts/AddStrategy.css";
import { numberFormatMatrix } from "../../../utils/utilsFunction";
import CustomButton from "../../CustomComponents/CustomButton/CustomButton";
import { Alert } from "../../CustomComponents/CustomAlert/CustomAlert";
import CustomNumberInput from "../../CustomComponents/CustomInput/CustomNumberInput";
import SwiftModal from "../../CustomComponents/SwiftModal/SwiftModal";
import Close from "../../../assets/crossicon.svg";
import * as XLSX from "xlsx";
import UploadFormat from "../../../assets/files/UploadFormat.xlsx";

const PortfolioTrades = ({ id }) => {
  const [tradeData, SetTradeData] = useState([]);
  const [loading, setloading] = useState(true);
  const [selectedTrades, setSelectedTrades] = useState([]);
  const [formData, setFormData] = useState();
  const [popup, setPopup] = useState(false);

  const uploadRef = useRef(null);
  const updateRef = useRef(null);

  const email_id = localStorage.getItem("userData")
    ? localStorage.getItem("userData")
    : null;

  const abortControllerRef = useRef(null);

  const fetchTradeData = async (strategyID) => {
    try {
      setloading(true);

      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();
      const signal = abortControllerRef.current.signal;

      const data = await ServerRequest({
        method: "get",
        URL: `/strategy/portfolio/trades?id=${strategyID}`,
        signal,
      });

      if (data.server_error) {
        alert("error");
      }

      if (data.error) {
        alert("error1");
      }

      SetTradeData(data.data);
      setTimeout(() => {
        setloading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching Trade data:", error);
    }
  };

  useEffect(() => {
    if (id) fetchTradeData(id);
  }, [id]);

  const handleCheckboxChange = (internalRefNumber) => {
    setSelectedTrades((prevSelected) => {
      if (prevSelected.includes(internalRefNumber)) {
        return prevSelected.filter((ref) => ref !== internalRefNumber);
      } else {
        return [...prevSelected, internalRefNumber];
      }
    });
  };

  const handleDelete = async () => {
    try {
      if (selectedTrades.length == 0) {
        Alert(
          {
            TitleText: "Warning",
            Message: `Select atleast 1 trade.`,
            BandColor: "#e51a4b",
            AutoClose: { Active: true, Time: 3 },
          },
          () => {}
        );
        return;
      }
      setloading(true);
      const data = await ServerRequest({
        method: "delete",
        URL: `/strategy/portfolio/trades?id=${id}`,
        data: selectedTrades,
      });

      if (data.server_error) {
        alert("error");
      }

      if (data.error) {
        alert("error1");
      }
      setSelectedTrades([]);
      await fetchTradeData(id);
    } catch (error) {
      console.error("Error fetching Trade data:", error);
    }
  };

  const handleUpload = async (excelData) => {
    try {
      setloading(true);
      const data = await ServerRequest({
        method: "post",
        URL: `/strategy/portfolio/trades?id=${id}&email=${email_id}`,
        data: excelData,
      });

      if (data.server_error) {
        alert("Server Error");
      }

      if (data.error) {
        Alert(
          {
            TitleText: "Warning",
            Message: data.message,
            BandColor: "#e51a4b",
            AutoClose: { Active: true, Time: 3 },
          },
          () => {}
        );
      }

      setSelectedTrades([]);
      await fetchTradeData(id);
    } catch (error) {
      console.error("Error fetching Trade data:", error);
    }
  };

  const handleBulkUpdate = async (excelData) => {
    try {
      setloading(true);
      const data = await ServerRequest({
        method: "put",
        URL: `/strategy/portfolio/trades/bulk?id=${id}&email=${email_id}`,
        data: excelData,
      });

      if (data.server_error) {
        alert("Server Error");
      }

      if (data.error) {
        Alert(
          {
            TitleText: "Warning",
            Message: data.message,
            BandColor: "#e51a4b",
            AutoClose: { Active: true, Time: 3 },
          },
          () => {}
        );
      }

      setSelectedTrades([]);
      await fetchTradeData(id);
    } catch (error) {
      console.error("Error fetching Trade data:", error);
    }
  };

  const handleUploadFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          raw: false,
        });

        console.log(jsonData);
        handleUpload(jsonData);
      };

      reader.readAsBinaryString(file);
    }
  };
  const handleUpdateFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (event) => {
        const binaryStr = event.target.result;
        const workbook = XLSX.read(binaryStr, { type: "binary" });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          raw: false,
        });

        console.log(jsonData);
        handleBulkUpdate(jsonData);
      };

      reader.readAsBinaryString(file);
    }
  };

  const handleUploadClick = () => {
    if (uploadRef.current) {
      uploadRef.current.click();
    }
  };

  const handleUpdateClick = () => {
    if (updateRef.current) {
      updateRef.current.click();
    }
  };

  const handleUpdate = async () => {
    try {
      if (!formData.quantity || !formData.netprice) {
        Alert(
          {
            TitleText: "Warning",
            Message: `Values cannot be empty`,
            BandColor: "#e51a4b",
            AutoClose: { Active: true, Time: 3 },
          },
          () => {}
        );
        return;
      }
      console.log(formData);
      setloading(true);
      const data = await ServerRequest({
        method: "put",
        URL: `/strategy/portfolio/trades?id=${id}`,
        data: formData,
      });

      if (data.server_error) {
        alert("error");
      }

      if (data.error) {
        alert("error1");
      }
      setSelectedTrades([]);
      setPopup(false);
      setFormData();
      await fetchTradeData(id);
    } catch (error) {
      console.error("Error fetching Trade data:", error);
    }
  };

  const handleDownload = () => {
    fetch(UploadFormat)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute("download", "UploadFormat.xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => console.error("Error downloading the file", error));
  };

  return !loading ? (
    <div className="swift-portfolio-trades ">
      <div className="swift-portfolio-trades-buttons">
        <div onClick={handleDownload}>Download Upload Format</div>
        <p onClick={handleDelete}>Delete</p>
        <p onClick={handleUpdateClick}>
          Bulk Update
          <input
            type="file"
            ref={updateRef}
            accept=".xlsx, .xls"
            onChange={handleUpdateFileChange}
            style={{ display: "none" }}
          />
        </p>
        <p onClick={handleUploadClick}>
          Upload
          <input
            type="file"
            ref={uploadRef}
            accept=".xlsx, .xls"
            onChange={handleUploadFileChange}
            style={{ display: "none" }}
          />
        </p>
      </div>
      <div className="swift-portfolio-table-wrapper">
        {tradeData.length > 0 ? (
          <table className="swift-strategy-created-table swift-portfolio-table">
            <thead>
              <tr>
                <th></th>
                <th>Strategy ID</th>
                <th>Internal Ref Number</th>
                <th>Symbol</th>
                <th>Category</th>
                <th>Quantity</th>
                <th>Tentative Price</th>
                <th>Net Price</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {tradeData &&
                tradeData.map((item, index) => (
                  <tr key={index}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedTrades.includes(
                          item.internal_ref_number
                        )}
                        onChange={() =>
                          handleCheckboxChange(item.internal_ref_number)
                        }
                      />
                    </td>
                    <td>{item.strategy_id}</td>
                    <td>{item.internal_ref_number}</td>
                    <td>{item.symbol}</td>
                    <td>{item.category}</td>
                    <td>{numberFormatMatrix(item.quantity, 0)}</td>
                    <td>{numberFormatMatrix(item.tentativeprice, 2)}</td>
                    <td>{numberFormatMatrix(item.netprice, 2)}</td>
                    <td>{numberFormatMatrix(item.amount, 0)}</td>
                    <td>{item.type}</td>
                    <td>
                      {moment
                        .tz(
                          new Date(item.date).toISOString(),
                          moment.tz.guess()
                        )

                        .format("DD-MM-YYYY HH:mm:ss")}
                    </td>
                    <td>
                      <p
                        className="swift-portfolio-trade-btn"
                        onClick={() => {
                          setFormData(item);
                          setPopup(true);
                        }}
                      >
                        Edit
                      </p>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        ) : (
          <p style={{ width: "100vw" }}>No Trades Available</p>
        )}
      </div>

      {popup && (
        <SwiftModal closeModal={() => setPopup(false)} top="10px">
          <div className="swift-input-modal-content">
            <div className="custom__alert__close">
              <img src={Close} alt="X" onClick={() => setPopup(false)} />
            </div>
            <div className="swift-trade-modal-body">
              <CustomNumberInput
                labelText="Quantity"
                type="number"
                classnameDiv="swift-modal-trade-input"
                name={"quantity"}
                placeholder=""
                styleDiv={{ paddingLeft: "10px" }}
                styleInput={{
                  // margin: "0",
                  width: "100%",
                  padding: "10px",
                  fontSize: "12px",
                  // border: "none",
                  // borderBottom: "1px solid #f0f0f0",
                  // backgroundColor: "#f1f1f1",
                }}
                onInputChange={(symbol, value) =>
                  setFormData((prev) => ({
                    ...prev,
                    quantity: value,
                    amount: value * formData.netprice,
                  }))
                }
                onClick={(e) => e.stopPropagation()}
                value={formData.quantity}
              />

              <CustomNumberInput
                labelText="Net Price"
                type="decimal"
                classnameDiv="swift-modal-trade-input"
                name={"net_price"}
                placeholder=""
                styleDiv={{ paddingLeft: "10px" }}
                styleInput={{
                  // margin: "0",
                  width: "100%",
                  padding: "10px",
                  fontSize: "12px",
                  // border: "none",
                  // borderBottom: "1px solid #f0f0f0",
                  // backgroundColor: "#f1f1f1",
                }}
                onInputChange={(symbol, value) =>
                  setFormData((prev) => ({
                    ...prev,
                    netprice: value,
                    amount: value * formData.quantity,
                  }))
                }
                onClick={(e) => e.stopPropagation()}
                value={formData.netprice}
              />
              {/* <div style={{ paddingLeft: "10px", width: "95%" }}>
                <CustomSelect
                  heading="Type"
                  placeholder="Please Select Type"
                  defaultIndex={types.indexOf(formData["type"])}
                  options={types}
                  onTypeChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      type: value,
                    }));
                  }}
                  // error={errors.user_role}
                />
              </div>

              <div style={{ paddingLeft: "10px", width: "95%" }}>
                <CustomSelect
                  heading="Type"
                  placeholder="Please Select Type"
                  defaultIndex={types.indexOf(formData["type"])}
                  options={types}
                  onTypeChange={(value) => {
                    setFormData((prev) => ({
                      ...prev,
                      type: value,
                    }));
                  }}
                  // error={errors.user_role}
                />
              </div> */}
            </div>

            <div className="swift-modal-apply-btn">
              <CustomButton
                text="Submit"
                classname="swift-accounts-content-button"
                onClick={handleUpdate}
              />
            </div>
          </div>
        </SwiftModal>
      )}
    </div>
  ) : (
    <div className="swift-aseet-loader">
      <p>Loading</p>
      <Pulse />
    </div>
  );
};

export default PortfolioTrades;
