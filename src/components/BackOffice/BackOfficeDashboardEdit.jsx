import React, { useRef, useState } from "react";
import CustomButton from "../CustomComponents/CustomButton/CustomButton";
import CustomInputError from "../CustomComponents/CustomInput/CustomInputError";
import ServerRequest from "../../utils/ServerRequest";
import * as XLSX from "xlsx";
import { isEmpty } from "../../utils/Validation";
import SwiftModal from "../CustomComponents/SwiftModal/SwiftModal";
import Close from "../../assets/crossicon.svg";
import { Alert } from "../CustomComponents/CustomAlert/CustomAlert";
import Pulse from "../Loader/Pulse";
import AllocationFormat from "../../assets/files/UploadFormatAllocation.csv";
import PerformanceFormat from "../../assets/files/UploadFormatPerformance.csv";

const BackOfficeDashboardEdit = ({ fundDetail, setReset, setCurrentPage }) => {
  const [fundDetails, setFundDetails] = useState(fundDetail);
  const [errors, setErrors] = useState({
    fundDescriptionError: "",
    firmAssetsError: "",
    strategyAssetsError: "",
    strategyUrlError: "",
    teamMemberErrors: [],
    logoError: "",
  });
  const [teamMembers, setTeamMembers] = useState(fundDetail.team_members || []);
  const [loading, setLoading] = useState(false);
  const [performanceData, setPerformanceData] = useState(
    fundDetail.performance_data || []
  );
  const [allocationData, setAllocationData] = useState(
    fundDetail.allocation_data || []
  );
  const [top10Data, setTop10Data] = useState();

  const [performancePopup, setPerformancePopup] = useState();
  const [allocationPopup, setAllocationPopup] = useState();
  const [top10Popup, setTop10Popup] = useState();

  const [selectedFile, setSelectedFile] = useState(null);
  const [oldFile, setOldFile] = useState(
    () => fundDetail.logo_url?.split("||")[1] || null
  );

  const fileInputRef = useRef(null);

  const handleChange = (name, value) => {
    setFundDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [`${name}Error`]: "",
    }));
  };

  const handleTeamMemberChange = (index, name, value) => {
    const updatedTeamMembers = teamMembers.map((member, i) =>
      i === index ? { ...member, [name]: value } : member
    );
    setTeamMembers(updatedTeamMembers);
  };

  const handleAddTeamMember = () => {
    setTeamMembers([
      ...teamMembers,
      {
        team_member_name: "",
        designation: "",
        team_member_description: "",
        linkedin_url: "",
      },
    ]);
  };

  const handleDeleteTeamMember = (index) => {
    setTeamMembers(teamMembers.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    let hasError = false;
    let newErrors = {
      fundDescriptionError: "",
      firmAssetsError: "",
      strategyAssetsError: "",
      strategyUrlError: "",
      teamMemberErrors: [],
      logoError: "",
    };

    if (!selectedFile && !oldFile) {
      newErrors.logoError = "Logo Required";
      hasError = true;
      setErrors(newErrors);
      return;
    }
    if (!performanceData || performanceData.length == 0) {
      showError("Performance Data Required");
      hasError = true;
      return;
    }
    if (!allocationData || allocationData.length == 0) {
      hasError = true;
      showError("Allocation Data Required");
      return;
    }
    if (!fundDetails.fund_description) {
      newErrors.fundDescriptionError = "Fund description cannot be empty";
      hasError = true;
      setErrors(newErrors);
      return;
    }

    if (!fundDetails.firm_assets) {
      newErrors.firmAssetsError = "Firm assets cannot be empty";
      hasError = true;
      setErrors(newErrors);
      return;
    }

    if (!fundDetails.strategy_assets) {
      newErrors.strategyAssetsError = "Strategy assets cannot be empty";
      hasError = true;
      setErrors(newErrors);
      return;
    }

    if (!fundDetails.strategy_url) {
      newErrors.strategyUrlError = "Strategy URL cannot be empty";
      hasError = true;
      setErrors(newErrors);
      return;
    }

    let newTeamMemberErrors = [...newErrors.teamMemberErrors];

    teamMembers.forEach((member, index) => {
      if (!member.team_member_name) {
        newTeamMemberErrors[index] = {
          ...newTeamMemberErrors[index],
          team_member_nameError: "Name cannot be empty",
        };
        hasError = true;
        newErrors.teamMemberErrors = newTeamMemberErrors;
        setErrors(newErrors);
        return;
      }

      if (!member.designation) {
        newTeamMemberErrors[index] = {
          ...newTeamMemberErrors[index],
          designationError: "designation cannot be empty",
        };
        hasError = true;
        newErrors.teamMemberErrors = newTeamMemberErrors;
        setErrors(newErrors);
        return;
      }

      if (!member.team_member_description) {
        newTeamMemberErrors[index] = {
          ...newTeamMemberErrors[index],
          team_member_descriptionError: "description cannot be empty",
        };
        hasError = true;
        newErrors.teamMemberErrors = newTeamMemberErrors;
        setErrors(newErrors);
        return;
      }
    });

    newErrors.teamMemberErrors = newTeamMemberErrors;
    setErrors(newErrors);

    if (hasError) {
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      formData.append("teamMembers", JSON.stringify(teamMembers));
      formData.append("fundDetails", JSON.stringify(fundDetails));
      formData.append("performanceData", JSON.stringify(performanceData));
      formData.append("allocationData", JSON.stringify(allocationData));

      const data1 = await ServerRequest({
        method: "post",
        URL: `/back-office/funds/edit?email=${fundDetails.email}`,
        data: formData,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setReset(Math.random());
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setTimeout(() => {
        setLoading(false);
        setCurrentPage("preview");
      }, 1000);
    }
  };

  const expectedMonths = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const currentYear = new Date().getFullYear();

  const showError = (msg) => {
    return Alert({
      TitleText: "Warning",
      Message: msg,
      BandColor: "#e51a4b",

      AutoClose: {
        Active: true,
        Line: true,
        LineColor: "#e51a4b",
        Time: 3,
      },
    });
  };
  const handleFileUploadPerformance = (e) => {
    const file = e.target.files[0];
    let maxYear = 0;
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const sheetData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

        const first13Columns = sheetData.map((row) => row.slice(0, 13));

        const splitByEmptyRow = (data) => {
          const result = [];
          let currentBlock = [];

          data.forEach((row) => {
            if (row.some((cell) => cell !== undefined && cell !== "")) {
              currentBlock.push(row);
            } else if (currentBlock.length > 0) {
              result.push(currentBlock);
              currentBlock = [];
            }
          });

          if (currentBlock.length > 0) result.push(currentBlock); // Push the last block

          return result;
        };

        let hasError = false;
        const shareClassData = splitByEmptyRow(first13Columns).map((block) => {
          const shareClassName = block[0][0]; // First cell of the first row is the ShareClass name

          if (isEmpty(shareClassName)) {
            showError("Share Class Name Can Not Be Empty");
            hasError = true;
            return;
          }
          // Build key-value pairs for each year
          const shareClassEntries = [];
          const months = block[0].slice(1); // Extract months (Jan to Dec)
          if (
            months.length !== 12 ||
            !months.every((month, idx) => month === expectedMonths[idx])
          ) {
            showError("Months");
            hasError = true;

            return;
          }
          for (let i = 1; i < block.length; i++) {
            const year = block[i][0]; // First cell in each row is the year

            if (
              !year ||
              isNaN(year) ||
              String(year).length !== 4 ||
              year > currentYear
            ) {
              showError("error year");
              hasError = true;

              return;
            }
            if (year) {
              maxYear = Math.max(maxYear, year);
              const rowEntries = {};
              months.forEach((month, index) => {
                if (
                  typeof block[i][index + 1] !== "number" &&
                  block[i][index + 1]
                ) {
                  showError("Error in type value ", block[i][index + 1]);
                  hasError = true;

                  return;
                }
                if (month && block[i][index + 1] !== undefined) {
                  rowEntries[`${month}${year}`] = block[i][index + 1];
                }
              });
              if (Object.keys(rowEntries).length > 0) {
                shareClassEntries.push(rowEntries);
              }
            }
          }
          if (shareClassEntries.length == 0) {
            hasError = true;
            showError(`${shareClassName} cells can not be empty`);
            return;
          }
          return {
            name: shareClassName,
            entries: shareClassEntries,
          };
        });
        e.target.value = "";
        if (!hasError) {
          setPerformanceData(shareClassData);
          setPerformancePopup(true);
        }
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleFileUploadAllocation = (e) => {
    const file = e.target.files[0];

    e.target.value = "";
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: "array" });
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
        const sheetData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

        const monthYearColumns = sheetData[0].slice(1);
        const classDataRows = sheetData.slice(1);
        let hasError = false;

        const monthYearRegex = /^[A-Za-z]{3}-\d{2}$/;
        for (let i = 0; i < monthYearColumns.length; i++) {
          if (!monthYearRegex.test(monthYearColumns[i])) {
            showError(`Invalid month format: ${monthYearColumns[i]}`);
            hasError = true;
            return;
          }
        }

        for (let i = 1; i < monthYearColumns.length; i++) {
          const currentMonth = new Date(monthYearColumns[i] + "-01");
          const previousMonth = new Date(monthYearColumns[i - 1] + "-01");
          if (currentMonth >= previousMonth) {
            showError(
              `Months are not in descending order: ${
                monthYearColumns[i]
              } after ${monthYearColumns[i - 1]}`
            );
            hasError = true;

            return;
          }
        }

        const totalAllocationsPerMonth = new Array(
          monthYearColumns.length
        ).fill(0);

        const allocationData = classDataRows.map((row) => {
          const className = row[0];
          if (!className) {
            showError("Class Name cannot be empty");
            hasError = true;

            return;
          }

          const rowEntries = {};

          monthYearColumns.forEach((monthYear, index) => {
            const value = row[index + 1] ? row[index + 1] : 0;

            if (typeof value === "number") {
              const numValue = value * 100;
              if (isNaN(numValue) || numValue < 0 || numValue > 100) {
                showError(
                  `Invalid percentage value in ${className} for ${monthYear}: ${value}`
                );
                hasError = true;

                return;
              }
              totalAllocationsPerMonth[index] += numValue;

              rowEntries[monthYear.replace("-", "")] = numValue;
            } else {
              showError(
                `Invalid format for percentage in ${className} for ${monthYear}: ${value}`
              );
              hasError = true;

              return;
            }
          });

          return {
            name: className,
            entries: rowEntries,
          };
        });

        for (let i = 0; i < totalAllocationsPerMonth.length; i++) {
          if (totalAllocationsPerMonth[i] !== 100) {
            showError(
              `Total allocation for ${monthYearColumns[i]} must be 100%. Current total: ${totalAllocationsPerMonth[i]}%`
            );
            return;
          }
        }

        const validAllocationData = allocationData.filter(Boolean);
        if (validAllocationData) {
          setAllocationData(validAllocationData);
          setAllocationPopup(true);
        }
      };

      reader.readAsArrayBuffer(file);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setErrors({
        ...errors,
        logoError: "",
      });
    }
    fileInputRef.current.value = "";
    setOldFile(null);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    fileInputRef.current.value = "";
    setOldFile(null);
  };

  const handleDownload = (UploadFormat, name) => {
    fetch(UploadFormat)
      .then((response) => response.blob())
      .then((blob) => {
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute("download", name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      })
      .catch((error) => console.error("Error downloading the file", error));
  };

  const handleDownloadPerformance = () => {
    const excelData = [];

    const notes = [
      "1. Please add years as additional rows",
      "2. Add and delete blocks of share classes as needed",
      "3. Change share class names as needed",
      "4. Keep at least one row blank between share class blocks",
    ];

    let notesCount = 0;

    fundDetail.performance_data.forEach((shareClass, index) => {
      const headerRow = [
        shareClass.name,
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
        "",
        "",
      ];
      if (index == 0) headerRow.push("Notes");
      excelData.push(headerRow);

      shareClass.entries.forEach((entry) => {
        const year = Object.keys(entry)[0].slice(-4);

        const monthOrder = [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];

        const sortedEntries = Object.entries(entry).sort(([keyA], [keyB]) => {
          const monthA = keyA.slice(0, 3);
          const monthB = keyB.slice(0, 3);
          return monthOrder.indexOf(monthA) - monthOrder.indexOf(monthB);
        });

        const sortedKeys = sortedEntries.map(([key]) => key);
        const sortedValues = sortedEntries.map(([, value]) => value);

        console.log(sortedValues, sortedKeys);
        const rowData = [year, ...sortedValues];
        if (notesCount < 4) {
          rowData.push("");
          rowData.push("");
          rowData.push(notes[notesCount]);
          notesCount = notesCount + 1;
        }

        // const filledRow = [...rowData, ...Array(13 - rowData.length).fill("--")];

        excelData.push(rowData);
      });

      excelData.push(Array(13).fill(""));
    });

    const worksheet = XLSX.utils.aoa_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Performance Data");

    XLSX.writeFile(workbook, "PerformanceData.xlsx");
  };

  const getCurrentMonth = () => {
    const date = new Date();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear().toString().slice(-2);

    return month + year;
  };

  const handleDownloadAllocation = () => {
    const currentMonth = getCurrentMonth();

    const updatedAllocationData = allocationData.map((shareClass) => {
      const entries = { ...shareClass.entries };

      if (!entries.hasOwnProperty(currentMonth)) {
        entries[currentMonth] = null;
      }

      const sortedEntries = Object.keys(entries)
        .sort((a, b) => {
          const [monthA, yearA] = [a.slice(0, 3), a.slice(-2)]; // Extract month and year
          const [monthB, yearB] = [b.slice(0, 3), b.slice(-2)];

          if (yearA !== yearB) {
            return yearB - yearA; // Sort years in descending order
          }

          const monthOrder = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
          ];
          return monthOrder.indexOf(monthB) - monthOrder.indexOf(monthA);
        })
        .reduce((acc, key) => {
          acc[key] = entries[key];
          return acc;
        }, {});

      return {
        name: shareClass.name,
        entries: sortedEntries,
      };
    });

    const excelData = [];

    const headerRow = ["", ...Object.keys(updatedAllocationData[0].entries)];
    excelData.push(headerRow);

    updatedAllocationData.forEach((shareClass) => {
      const row = [shareClass.name, ...Object.values(shareClass.entries)];
      excelData.push(row);
    });

    const worksheet = XLSX.utils.aoa_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "AllocationData");

    XLSX.writeFile(workbook, "AllocationData.xlsx");
  };

  return loading ? (
    <div className="swift-aseet-loader">
      <p>Loading</p>
      <Pulse />
    </div>
  ) : (
    <div className="swift-back-office-fund-edit">
      <div className="swift-back-office-fund-edit-save">
        <p>Last saved 15 minutes ago</p>
        <div className="swift-back-office-strategy-add-btn">
          <CustomButton
            text="Save"
            classname="swift-accounts-content-button"
            onClick={handleSave}
          />
        </div>
      </div>
      <div className="swift-back-office-fund-edit-body">
        <div className="swift-back-office-fund-edit-upload-logo">
          <p className="swift-back-office-fund-edit-upload-logo-title">
            Upload logo
          </p>

          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={() => fileInputRef.current.click()}
            style={{ cursor: "pointer" }}
          >
            <path
              d="M6.71 5.70501L9 3.40501V12.995C9 13.2602 9.10536 13.5146 9.29289 13.7021C9.48043 13.8897 9.73478 13.995 10 13.995C10.2652 13.995 10.5196 13.8897 10.7071 13.7021C10.8946 13.5146 11 13.2602 11 12.995V3.40501L13.29 5.70501C13.383 5.79874 13.4936 5.87314 13.6154 5.9239C13.7373 5.97467 13.868 6.00081 14 6.00081C14.132 6.00081 14.2627 5.97467 14.3846 5.9239C14.5064 5.87314 14.617 5.79874 14.71 5.70501C14.8037 5.61205 14.8781 5.50145 14.9289 5.37959C14.9797 5.25773 15.0058 5.12703 15.0058 4.99501C15.0058 4.863 14.9797 4.7323 14.9289 4.61044C14.8781 4.48858 14.8037 4.37798 14.71 4.28501L10.71 0.285014C10.6149 0.193973 10.5028 0.122608 10.38 0.0750135C10.1365 -0.0250045 9.86346 -0.0250045 9.62 0.0750135C9.49725 0.122608 9.3851 0.193973 9.29 0.285014L5.29 4.28501C5.19676 4.37825 5.1228 4.48894 5.07234 4.61076C5.02188 4.73259 4.99591 4.86315 4.99591 4.99501C4.99591 5.12687 5.02188 5.25744 5.07234 5.37926C5.1228 5.50108 5.19676 5.61178 5.29 5.70501C5.38324 5.79825 5.49393 5.87221 5.61575 5.92267C5.73757 5.97313 5.86814 5.9991 6 5.9991C6.13186 5.9991 6.26243 5.97313 6.38425 5.92267C6.50607 5.87221 6.61676 5.79825 6.71 5.70501ZM19 9.99501C18.7348 9.99501 18.4804 10.1004 18.2929 10.2879C18.1054 10.4754 18 10.7298 18 10.995V16.995C18 17.2602 17.8946 17.5146 17.7071 17.7021C17.5196 17.8897 17.2652 17.995 17 17.995H3C2.73478 17.995 2.48043 17.8897 2.29289 17.7021C2.10536 17.5146 2 17.2602 2 16.995V10.995C2 10.7298 1.89464 10.4754 1.70711 10.2879C1.51957 10.1004 1.26522 9.99501 1 9.99501C0.734784 9.99501 0.48043 10.1004 0.292893 10.2879C0.105357 10.4754 0 10.7298 0 10.995V16.995C0 17.7907 0.316071 18.5537 0.87868 19.1163C1.44129 19.6789 2.20435 19.995 3 19.995H17C17.7956 19.995 18.5587 19.6789 19.1213 19.1163C19.6839 18.5537 20 17.7907 20 16.995V10.995C20 10.7298 19.8946 10.4754 19.7071 10.2879C19.5196 10.1004 19.2652 9.99501 19 9.99501Z"
              fill="black"
            />
          </svg>

          <input
            type="file"
            id="file-upload"
            accept=".jpg,.png"
            style={{ display: "none" }}
            onChange={handleFileChange}
            ref={fileInputRef}
          />

          {selectedFile && (
            <div className="swift-back-office-fund-edit-upload-logo-file-deatil">
              <p>{selectedFile.name}</p>
              <p
                style={{ fontStyle: "italic", cursor: "pointer" }}
                onClick={handleRemoveFile}
              >
                Remove
              </p>
            </div>
          )}
          {oldFile && (
            <div className="swift-back-office-fund-edit-upload-logo-file-deatil">
              <p>{oldFile}</p>
              <p
                style={{ fontStyle: "italic", cursor: "pointer" }}
                onClick={() => setOldFile(null)}
              >
                Remove
              </p>
            </div>
          )}

          {errors.logoError && (
            <p className="swift-back-office-error">{errors.logoError}</p>
          )}
          {!errors.logoError && !oldFile && !selectedFile && (
            <p className="swift-back-office-error">{errors.logoError}</p>
          )}
        </div>
        <div className="swift-back-office-fund-edit-about-main">
          <div className="swift-back-office-fund-edit-about">
            <p>About the Strategy</p>
            <textarea
              name="fund_description"
              id=""
              rows={7}
              placeholder="Maximum 500 characters"
              value={fundDetails.fund_description}
              onChange={(e) => handleChange(e.target.name, e.target.value)}
              style={{ overflow: "hidden" }}
            ></textarea>
            <p className="swift-back-office-error">
              {errors.fundDescriptionError}
            </p>
          </div>
          <div className="swift-back-office-fund-edit-about-firm">
            <CustomInputError
              labelText="Firm assets"
              classnameLabel="swift-back-office-input-label"
              classnameDiv="swift-back-office-input-div"
              classnameInput="swift-back-office-input-text"
              classnameError="swift-back-office-error"
              type="text"
              name="firm_assets"
              placeholder="in numbers"
              styleInput={{ width: "200px" }}
              onInputChange={handleChange}
              value={fundDetails.firm_assets}
              error={errors.firmAssetsError}
            />
            <CustomInputError
              labelText="Strategy assets"
              classnameLabel="swift-back-office-input-label"
              classnameDiv="swift-back-office-input-div"
              classnameInput="swift-back-office-input-text"
              classnameError="swift-back-office-error"
              type="text"
              name="strategy_assets"
              placeholder="in numbers"
              styleInput={{ width: "200px" }}
              onInputChange={handleChange}
              value={fundDetails.strategy_assets}
              error={errors.strategyAssetsError}
            />
          </div>
          <div className="swift-back-office-fund-edit-about-url">
            <CustomInputError
              labelText="Url of the strategy"
              classnameLabel="swift-back-office-input-label"
              classnameDiv="swift-back-office-input-div"
              classnameInput="swift-back-office-input-text"
              classnameError="swift-back-office-error"
              type="text"
              name="strategy_url"
              placeholder="https://www.swiftfolios.co.uk/funds/"
              styleInput={{ width: "450px" }}
              onInputChange={handleChange}
              value={fundDetails.strategy_url}
              error={errors.strategyUrlError}
            />
          </div>
        </div>
        <div className="swift-back-office-fund-edit-team">
          <p className="swift-back-office-fund-edit-team-heading">Team</p>
          {teamMembers.map((member, index) => {
            const memberErrors = errors.teamMemberErrors[index] || {};
            const total = teamMembers.length;
            return (
              <div
                className="swift-back-office-fund-edit-team-row"
                style={{
                  paddingBottom: "20px",
                  display: "flex",
                  flexDirection: "column",
                  rowGap: "15px",
                }}
              >
                <p className="swift-back-office-fund-edit-team-heading">
                  Member {index + 1}
                </p>

                <div className="swift-back-office-fund-edit-team-row-1">
                  <CustomInputError
                    labelText="Please enter person's name below."
                    classnameLabel="swift-back-office-input-label"
                    classnameDiv="swift-back-office-input-div"
                    classnameInput="swift-back-office-input-text"
                    classnameError="swift-back-office-error"
                    type="text"
                    name="team_member_name"
                    placeholder="Name"
                    styleInput={{ width: "200px" }}
                    onInputChange={(name, value) =>
                      handleTeamMemberChange(index, "team_member_name", value)
                    }
                    value={member.team_member_name}
                    error={memberErrors.team_member_nameError}
                  />
                  <CustomInputError
                    labelText="Designation"
                    classnameLabel="swift-back-office-input-label"
                    classnameDiv="swift-back-office-input-div"
                    classnameInput="swift-back-office-input-text"
                    classnameError="swift-back-office-error"
                    type="text"
                    name="designation"
                    placeholder="Designation"
                    styleInput={{ width: "200px" }}
                    onInputChange={(name, value) =>
                      handleTeamMemberChange(index, "designation", value)
                    }
                    value={member.designation}
                    error={memberErrors.designationError}
                  />
                </div>
                <div className="swift-back-office-fund-edit-team-row-2">
                  <p>Description</p>
                  <textarea
                    name="team_member_description"
                    rows={5}
                    placeholder="Maximum 500 characters"
                    value={member.team_member_description}
                    onChange={(e) =>
                      handleTeamMemberChange(
                        index,
                        "team_member_description",
                        e.target.value
                      )
                    }
                  ></textarea>
                  <p className="swift-back-office-error">
                    {memberErrors.team_member_descriptionError}
                  </p>
                </div>
                <div className="swift-back-office-fund-edit-team-row-3">
                  <CustomInputError
                    labelText="Linkedin url(optional)"
                    classnameLabel="swift-back-office-input-label"
                    classnameDiv="swift-back-office-input-div"
                    classnameInput="swift-back-office-input-text"
                    classnameError="swift-back-office-error"
                    type="text"
                    name="linkedin_url"
                    placeholder="https://www.swiftfolios.co.uk/funds/"
                    styleInput={{ width: "450px" }}
                    onInputChange={(name, value) =>
                      handleTeamMemberChange(index, "linkedin_url", value)
                    }
                    value={member.linkedin_url}
                    errorDisplay={false}
                  />
                </div>

                <div className="swift-back-office-fund-edit-team-row-4">
                  {index == total - 1 && (
                    <div className="swift-back-office-strategy-add-btn">
                      <CustomButton
                        text="Add team member"
                        classname="swift-accounts-content-button"
                        onClick={handleAddTeamMember}
                      />
                    </div>
                  )}
                  <div className="swift-back-office-strategy-add-btn">
                    <CustomButton
                      text="Delete"
                      classname="swift-accounts-content-button"
                      onClick={() => handleDeleteTeamMember(index)}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <div className="swift-back-office-fund-edit-upload-data">
          <div className="swift-back-office-edit-upload-data-row">
            <p>Performance</p>
            <div className="right-side-div">
              <p
                onClick={() => {
                  if (
                    !fundDetail.performance_data ||
                    fundDetail.performance_data?.length == 0
                  )
                    handleDownload(
                      PerformanceFormat,
                      "UploadFormatPerformance"
                    );
                  else handleDownloadPerformance();
                }}
                style={{ cursor: "pointer" }}
              >
                Download
              </p>
              <label htmlFor="performance-upload" style={{ cursor: "pointer" }}>
                Upload
              </label>
              <input
                id="performance-upload"
                type="file"
                accept=".xlsx, .xls ,.csv"
                style={{ display: "none" }}
                onChange={(e) => handleFileUploadPerformance(e)}
              />
            </div>
          </div>
          <div className="swift-back-office-edit-upload-data-row">
            <p>Allocation</p>
            <div className="right-side-div">
              <p
                onClick={() => {
                  if (
                    !fundDetail.allocation_data ||
                    fundDetail.allocation_data?.length == 0
                  )
                    handleDownload(AllocationFormat, "UploadFormatAllocation");
                  else handleDownloadAllocation();
                }}
                style={{ cursor: "pointer" }}
              >
                Download
              </p>

              <label htmlFor="allocation-upload" style={{ cursor: "pointer" }}>
                Upload
              </label>
              <input
                id="allocation-upload"
                type="file"
                accept=".xlsx, .xls ,.csv"
                style={{ display: "none" }}
                onChange={(e) => handleFileUploadAllocation(e)}
              />
            </div>
          </div>
          <div className="swift-back-office-edit-upload-data-row">
            <p>Top 10</p>
            <div className="right-side-div">
              <p>Download</p>
              <p>Upload</p>

              {/* <label htmlFor="top10-upload" style={{ cursor: "pointer" }}>
                Upload
              </label>
              <input
                id="top10-upload"
                type="file"
                accept=".xlsx, .xls ,.csv"
                style={{ display: "none" }}
                onChange={(e) => handleFileUploadTop10(e)}
              /> */}
            </div>
          </div>
        </div>
      </div>

      {performancePopup && (
        <SwiftModal
          closeModal={() => {
            setPerformancePopup();
            setPerformanceData();
          }}
          top="10px"
          className="swift-back-office-table-popup"
        >
          <div className="swift-back-office-table-popup-content">
            <div className="custom__alert__close">
              <img
                src={Close}
                alt="X"
                onClick={() => {
                  setPerformancePopup();
                  setPerformanceData();
                }}
              />
            </div>
            <div className="swift-back-office-table">
              <table border="1" cellPadding="10">
                <tbody>
                  {performanceData.map((shareClass) => {
                    return (
                      <>
                        <tr style={{ backgroundColor: "#fff" }}>
                          <th>{shareClass.name}</th>
                          <th>Jan</th>
                          <th>Feb</th>
                          <th>Mar</th>
                          <th>Apr</th>
                          <th>May</th>
                          <th>Jun</th>
                          <th>Jul</th>
                          <th>Aug</th>
                          <th>Sep</th>
                          <th>Oct</th>
                          <th>Nov</th>
                          <th>Dec</th>
                        </tr>

                        {shareClass.entries.map((entry, index) => {
                          const year = Object.keys(entry)[0].slice(-4); // Extracting year from the key
                          return (
                            <tr
                              key={`${shareClass.name}-${year}-${index}`}
                              style={{
                                backgroundColor:
                                  index % 2 == 0 ? "#fafafa" : "#fff",
                              }}
                            >
                              <td>{year}</td>
                              {Object.values(entry).map((value, idx) => (
                                <td key={`${year}-${idx}`}>{value}</td>
                              ))}
                              {Array.from({
                                length: 12 - Object.keys(entry).length,
                              }).map((_, idx) => (
                                <td key={`${year}-empty-${idx}`}>--</td>
                              ))}
                            </tr>
                          );
                        })}

                        <tr style={{ height: "26px", backgroundColor: "#fff" }}>
                          <td colSpan={13}></td>
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="swift-back-office-popup-btn">
              <CustomButton
                text="Proceed"
                classname="swift-accounts-content-button"
                onClick={() => {
                  setPerformancePopup();
                  Alert({
                    TitleText: "Success",
                    Message: "Excel Uploaded Successfully",
                    BandColor: "#e51a4b",

                    AutoClose: {
                      Active: true,
                      Line: true,
                      LineColor: "#e51a4b",
                      Time: 3,
                    },
                  });
                }}
              />
            </div>
          </div>
        </SwiftModal>
      )}

      {allocationPopup && (
        <SwiftModal
          closeModal={() => {
            setAllocationData();
            setAllocationPopup();
          }}
          top="10px"
          className="swift-back-office-table-popup"
        >
          <div className="swift-back-office-table-popup-content">
            <div className="custom__alert__close">
              <img
                src={Close}
                alt="X"
                onClick={() => {
                  setAllocationData();
                  setAllocationPopup();
                }}
              />
            </div>
            <div className="swift-back-office-table">
              <table border="1" cellPadding="10">
                <tbody>
                  <tr style={{ backgroundColor: "#fff" }}>
                    <th></th>
                    {Object.keys(allocationData[0].entries).map((item) => (
                      <th>{item}</th>
                    ))}
                  </tr>
                  {allocationData.map((shareClass, index) => {
                    return (
                      <>
                        <tr
                          key={`${shareClass.name}-${index}`}
                          style={{
                            backgroundColor:
                              index % 2 == 0 ? "#fafafa" : "#fff",
                          }}
                        >
                          <td>{shareClass.name}</td>
                          {Object.values(shareClass.entries).map(
                            (value, idx) => (
                              <td key={`${shareClass.name}-${idx}`}>{value}</td>
                            )
                          )}
                        </tr>
                      </>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="swift-back-office-popup-btn">
              <CustomButton
                text="Proceed"
                classname="swift-accounts-content-button"
                onClick={() => {
                  setAllocationPopup();
                  Alert({
                    TitleText: "Success",
                    Message: "Excel Uploaded Successfully",
                    BandColor: "#e51a4b",

                    AutoClose: {
                      Active: true,
                      Line: true,
                      LineColor: "#e51a4b",
                      Time: 3,
                    },
                  });
                }}
              />
            </div>
          </div>
        </SwiftModal>
      )}
    </div>
  );
};

export default BackOfficeDashboardEdit;
