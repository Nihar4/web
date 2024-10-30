import { useEffect, useRef, useState } from "react";
import CustomCheckbox from "../CustomComponents/CustomCheckbox/CustomCheckbox";
import CustomSelect from "../CustomComponents/CustomSelect/CustomSelect";
import PerformanceChart from "./Charts/PerformanceChart";
import AllocationBarChart from "./Charts/BarChart";
import AllocationPieChart from "./Charts/PieChart";
import DrawdownLineChart from "./Charts/DrawdownLineChart";
import LineScatter from "./Charts/LineScatter";
import PositiveNegativeBarChart from "./Charts/PositiveNegativeBarChart";

const BackOfficeDashboardPreview = ({ fundDetail }) => {
  const demoData = [
    [
      "",
      "Jan",
      "Feb",
      "Mar",
      "Qtr. 1",
      "Apr",
      "May",
      "Jun",
      "Qtr. 2",
      "Jul",
      "Aug",
      "Sep",
      "Qtr. 3",
      "Oct",
      "Nov",
      "Dec",
      "Qtr. 4",
      "Year",
    ],
    [
      "2010",
      "0.25",
      "-0.36",
      "3.65",
      "5.45",
      "6.33",
      "0.33",
      "0.63",
      "8.33",
      "-2.56",
      "11.56",
      "3.65",
      "6.56",
      "5.33",
      "-8.55",
      "0.35",
      "15.63",
      "26.35",
    ],
    [
      "2010",
      "0.25",
      "-0.36",
      "3.65",
      "5.45",
      "6.33",
      "0.33",
      "0.63",
      "8.33",
      "-2.56",
      "11.56",
      "3.65",
      "6.56",
      "5.33",
      "-8.55",
      "0.35",
      "15.63",
      "26.35",
    ],
    [
      "2010",
      "0.25",
      "-0.36",
      "3.65",
      "5.45",
      "6.33",
      "0.33",
      "0.63",
      "8.33",
      "-2.56",
      "11.56",
      "3.65",
      "6.56",
      "5.33",
      "-8.55",
      "0.35",
      "15.63",
      "26.35",
    ],
    [
      "2010",
      "0.25",
      "-0.36",
      "3.65",
      "5.45",
      "6.33",
      "0.33",
      "0.63",
      "8.33",
      "-2.56",
      "11.56",
      "3.65",
      "6.56",
      "5.33",
      "-8.55",
      "0.35",
      "15.63",
      "26.35",
    ],
  ];
  const discretePerformanceData = [
    [
      " ",
      "1 month",
      "3 month",
      "6 month",
      "1 year",
      "3 year",
      "Inception",
      "Annualised",
    ],
    ["Share Class A", "0.25", "-0.36", "3.65", "5.45", "6.33", "0.33", "0.63"],
    ["Benchmark", "0.25", "-0.36", "3.65", "5.45", "6.33", "0.33", "0.63"],
    ["Difference", "0.25", "-0.36", "3.65", "5.45", "6.33", "0.33", "0.63"],
  ];
  const shareClassData = [
    [
      "Share Class",
      "ISIN",
      "Currency",
      "Min. Inv.",
      "Lock-up",
      "Hedged",
      "AMC",
      "OCF",
      "TER",
      "Settlement",
      "Dealing Freq.",
    ],
    [
      "Institutional Class A",
      "INE000125HUS",
      "USD",
      "10,000,000",
      "4 weeks",
      "No",
      1.95,
      0.65,
      2.25,
      "T+3",
      "Weekly",
    ],
    [
      "Institutional Class A",
      "INE000125HUS",
      "USD",
      "10,000,000",
      "4 weeks",
      "No",
      1.95,
      0.65,
      2.25,
      "T+3",
      "Weekly",
    ],
    [
      "Institutional Class A",
      "INE000125HUS",
      "USD",
      "10,000,000",
      "4 weeks",
      "No",
      1.95,
      0.65,
      2.25,
      "T+3",
      "Weekly",
    ],
  ];

  const perfData = [
    { date: "2024-09-01", value1: 100, value2: 105, value3: 110 },
    { date: "2024-09-02", value1: 102, value2: 107, value3: 112 },
    { date: "2024-09-03", value1: 104, value2: 108, value3: 114 },
    { date: "2024-09-04", value1: 103, value2: 106, value3: 113 },
    { date: "2024-09-05", value1: 105, value2: 109, value3: 115 },
    { date: "2024-09-06", value1: 107, value2: 111, value3: 117 },
    { date: "2024-09-07", value1: 106, value2: 110, value3: 116 },
    { date: "2024-09-08", value1: 108, value2: 113, value3: 118 },
    { date: "2024-09-09", value1: 110, value2: 115, value3: 120 },
    { date: "2024-09-10", value1: 112, value2: 117, value3: 122 },
    { date: "2024-09-11", value1: 111, value2: 116, value3: 121 },
    { date: "2024-09-12", value1: 113, value2: 118, value3: 123 },
    { date: "2024-09-13", value1: 115, value2: 120, value3: 125 },
    { date: "2024-09-14", value1: 114, value2: 119, value3: 124 },
    { date: "2024-09-15", value1: 116, value2: 121, value3: 126 },
  ];

  const drawData = [
    {
      date: "2017-12-01",
      value1: -3,
      value2: -2,
      value3: -5,
      value4: -4,
      value5: -3,
    },
    {
      date: "2018-03-01",
      value1: -2,
      value2: -4,
      value3: -1,
      value4: -3,
      value5: -6,
    },
    {
      date: "2018-06-01",
      value1: -5,
      value2: -1,
      value3: -6,
      value4: -2,
      value5: -4,
    },
    {
      date: "2018-09-01",
      value1: -1,
      value2: -3,
      value3: -2,
      value4: -5,
      value5: -7,
    },
    {
      date: "2018-12-01",
      value1: -3,
      value2: -4,
      value3: -5,
      value4: -2,
      value5: -1,
    },
    {
      date: "2019-03-01",
      value1: -6,
      value2: -2,
      value3: -7,
      value4: -4,
      value5: -3,
    },
    {
      date: "2019-06-01",
      value1: -3,
      value2: -5,
      value3: -6,
      value4: -7,
      value5: -2,
    },
    {
      date: "2019-09-01",
      value1: -4,
      value2: -1,
      value3: -8,
      value4: -3,
      value5: -5,
    },
    {
      date: "2019-12-01",
      value1: -2,
      value2: -7,
      value3: -4,
      value4: -6,
      value5: -8,
    },
    {
      date: "2020-03-01",
      value1: -15,
      value2: -18,
      value3: -20,
      value4: -17,
      value5: -21,
    },
    {
      date: "2020-06-01",
      value1: -7,
      value2: -9,
      value3: -8,
      value4: -6,
      value5: -10,
    },
    {
      date: "2020-09-01",
      value1: -5,
      value2: -6,
      value3: -7,
      value4: -4,
      value5: -9,
    },
    {
      date: "2020-12-01",
      value1: -8,
      value2: -5,
      value3: -9,
      value4: -10,
      value5: -4,
    },
    {
      date: "2021-03-01",
      value1: -3,
      value2: -2,
      value3: -6,
      value4: -5,
      value5: -4,
    },
    {
      date: "2021-06-01",
      value1: -6,
      value2: -7,
      value3: -3,
      value4: -4,
      value5: -8,
    },
    {
      date: "2021-09-01",
      value1: -7,
      value2: -5,
      value3: -2,
      value4: -6,
      value5: -9,
    },
    {
      date: "2021-12-01",
      value1: -4,
      value2: -8,
      value3: -10,
      value4: -3,
      value5: -2,
    },
    {
      date: "2022-03-01",
      value1: -11,
      value2: -9,
      value3: -12,
      value4: -8,
      value5: -10,
    },
    {
      date: "2022-06-01",
      value1: -20,
      value2: -25,
      value3: -22,
      value4: -21,
      value5: -18,
    },
    {
      date: "2022-09-01",
      value1: -12,
      value2: -14,
      value3: -13,
      value4: -10,
      value5: -11,
    },
    {
      date: "2022-12-01",
      value1: -8,
      value2: -5,
      value3: -10,
      value4: -7,
      value5: -9,
    },
  ];

  const barData = [
    { x: "2011 Q1", y: [65, 19, 16] },
    { x: "2011 Q2", y: [58, 24, 18] },
    { x: "2011 Q3", y: [54, 26, 20] },
    { x: "2011 Q4", y: [74, 9, 17] },
    { x: "2012 Q1", y: [39, 23, 38] },
    { x: "2012 Q2", y: [51, 32, 17] },
    { x: "2012 Q3", y: [30, 48, 22] },
    { x: "2012 Q4", y: [66, 16, 18] },
  ];

  const PNbarData = [
    { x: "2011 Q1", positive: 50, negative: -20, avg: (50 - 20) / 2 }, // Avg: 15
    { x: "2011 Q2", positive: 58, negative: -24, avg: (58 - 24) / 2 }, // Avg: 17
    { x: "2011 Q3", positive: 54, negative: -26, avg: (54 - 26) / 2 }, // Avg: 14
    { x: "2011 Q4", positive: 74, negative: -9, avg: (74 - 9) / 2 }, // Avg: 32.5
    { x: "2012 Q1", positive: 39, negative: -23, avg: (39 - 23) / 2 }, // Avg: 8
    { x: "2012 Q2", positive: 51, negative: -32, avg: (51 - 32) / 2 }, // Avg: 9.5
    { x: "2012 Q3", positive: 30, negative: -48, avg: (30 - 48) / 2 }, // Avg: -9
    { x: "2012 Q4", positive: 66, negative: -16, avg: (66 - 16) / 2 }, // Avg: 25
  ];

  const pieData = [
    { name: "Technology", volume: 10 },
    { name: "Healthcare", volume: 10 },
    { name: "Finance", volume: 10 },
    { name: "Energy", volume: 10 },
    { name: "Utilities", volume: 12 },
    { name: "Consumer Goods", volume: 13 },
    { name: "Industrials", volume: 20 },
    { name: "Real Estate", volume: 15 },
  ];

  const logo_url = fundDetail.logo_url?.split("||")[0];

  const graphContainerRef = useRef(null);

  const [graphDimensions, setGraphDimensions] = useState({
    width: 0,
    height: 0,
  });

  console.log(graphDimensions);
  useEffect(() => {
    const updateDimensions = () => {
      const container = graphContainerRef.current;

      if (container) {
        const containerWidth = container.offsetWidth;
        const containerHeight = container.offsetHeight;

        setGraphDimensions({ width: containerWidth, height: containerHeight });
      }
    };

    updateDimensions();

    window.addEventListener("resize", updateDimensions);

    return () => {
      window.removeEventListener("resize", updateDimensions);
    };
  }, [graphContainerRef, graphContainerRef.current]);

  if (!fundDetail.fund_description) return <>No Data Edit </>;

  return (
    <div className="swift-back-office-preview-container">
      <div className="swift-back-office-preview-title-logo">
        <div className="swift-back-office-preview-logo">
          <img
            src={logo_url}
            alt="Fund Logo"
            className="swift-back-office-preview-logo-img"
          />
        </div>
        <div className="swift-back-office-preview-title">
          <p>Mont Lake Capital Absolute Strategy Global Long Short Strategy</p>
          <p className="swift-back-office-preview-launch-date">
            Launch Date: 13th of July 2020
          </p>
        </div>
      </div>

      <div className="swift-back-office-preview-about">
        <p className="swift-back-office-preview-about-heading">
          About the fund
        </p>
        <p className="swift-back-office-preview-about-desc">
          {fundDetail.fund_description}
        </p>
      </div>

      <div className="swift-back-office-preview-team">
        <p className="swift-back-office-preview-team-heading">Team</p>
        <div className="swift-back-office-preview-team-members">
          {fundDetail.team_members.map((member) => (
            <div className="swift-back-office-preview-team-member">
              <p className="swift-back-office-preview-team-member-name">
                {member.team_member_name}
              </p>
              <p className="swift-back-office-preview-team-member-designation">
                {member.designation}
              </p>
              {member.linkedin_url && (
                <a href={member.linkedin_url}>
                  <img
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRokEYt0yyh6uNDKL8uksVLlhZ35laKNQgZ9g&s"
                    alt=""
                    className="swift-back-office-preview-team-member-url"
                  />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="swift-back-office-preview-benchmark"></div>

      <div className="swift-back-office-preview-performance-chart">
        <div className="swift-back-office-preview-performance-chart-row-1">
          <p className="swift-back-office-preview-team-heading">Performance</p>
          <div className="swift-back-office-preview-performance-chart-select">
            <CustomSelect
              heading=""
              placeholder=""
              defaultIndex={0}
              options={["shares1 ", "shares2"]}
              onTypeChange={(value) => {}}
              // error={errors.user_role}
            />
            <CustomSelect
              heading=""
              placeholder=""
              defaultIndex={0}
              options={["benchmark1", "benchmark2"]}
              onTypeChange={(value) => {}}
              // error={errors.user_role}
            />
            <CustomSelect
              heading=""
              placeholder=""
              defaultIndex={0}
              options={["USD", "INR"]}
              onTypeChange={(value) => {}}
              // error={errors.user_role}
            />
          </div>
          <CustomCheckbox label={"Relative"} value={1} onChange={() => {}} />
          <p className="swift-back-office-preview-performance-chart-add">Add</p>
        </div>
        <div
          className="swift-back-office-preview-performance-chart-container"
          ref={graphContainerRef}
        >
          {graphDimensions.width > 0 && graphDimensions.height > 0 && (
            <PerformanceChart
              data={perfData}
              width={graphDimensions.width}
              height={graphDimensions.height}
            />
          )}
        </div>
      </div>

      <div className="swift-back-office-preview-monthly-return">
        <div className="swift-back-office-preview-monthly-return-title">
          <p className="swift-back-office-preview-team-heading">
            Monthly Returns
          </p>
          <p className="swift-back-office-preview-monthly-return-sub-title">
            Full Performance
          </p>
        </div>
        <div className="swift-back-office-preview-monthly-return-table">
          <table>
            <thead>
              <tr>
                {demoData[0].map((header, index) => (
                  <th
                    key={index}
                    style={{
                      padding:
                        index % 4 == 0 && index != 0 ? "5px 10px" : "5px",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {demoData.slice(1).map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  style={{
                    backgroundColor: rowIndex % 2 == 0 ? "#fafafa" : "#fff",
                  }}
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      style={{
                        fontWeight:
                          (cellIndex % 4 == 0 || cellIndex == row.length - 1) &&
                          cellIndex != 0
                            ? "700"
                            : "400",
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="swift-back-office-preview-performance">
        <p className="swift-back-office-preview-team-heading">
          Discrete Performance
        </p>

        <div className="swift-back-office-preview-performance-table">
          <table>
            <thead>
              <tr>
                {discretePerformanceData[0].map((header, index) => (
                  <th
                    key={index}
                    style={{
                      textAlign:
                        index == discretePerformanceData[0].length - 1 ||
                        index == discretePerformanceData[0].length - 2
                          ? "right"
                          : "left",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {discretePerformanceData.slice(1).map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  style={{
                    backgroundColor: rowIndex % 2 == 0 ? "#fafafa" : "#fff",
                  }}
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      style={{
                        textAlign:
                          cellIndex == row.length - 1 ||
                          cellIndex == row.length - 2
                            ? "right"
                            : "left",
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="swift-back-office-preview-allocation">
        <div className="swift-back-office-preview-allocation-row-1">
          <p className="swift-back-office-preview-team-heading">
            Asset Allocation
            <span>as on 31-02-2024</span>
          </p>
          <p className="swift-back-office-preview-allocation-historical">
            Historical position
          </p>
        </div>
        <div className="swift-back-office-preview-allocation-chart-container">
          {graphDimensions.width > 0 && graphDimensions.height > 0 && (
            <AllocationBarChart
              data={barData}
              width={graphDimensions.width}
              height={480}
            />
          )}
          <AllocationPieChart
            values={pieData}
            width={500}
            height={400}
            unit="Volume"
          />
        </div>
      </div>

      <div className="swift-back-office-preview-top-10"></div>

      <div className="swift-back-office-preview-drawdowns">
        <div className="swift-back-office-preview-allocation-row-1">
          <p className="swift-back-office-preview-team-heading">
            Drawdowns
            <span>
              (calculated as the difference between a fund’s high-water mark and
              the low point following this high-water mark)
            </span>
          </p>
        </div>
        <div
          className="swift-back-office-preview-performance-chart-container"
          ref={graphContainerRef}
        >
          {graphDimensions.width > 0 && graphDimensions.height > 0 && (
            <DrawdownLineChart
              data={drawData}
              width={graphDimensions.width}
              height={graphDimensions.height}
            />
          )}
        </div>
      </div>

      <div className="swift-back-office-preview-distribution">
        <div className="swift-back-office-preview-allocation-row-1">
          <p className="swift-back-office-preview-team-heading">
            Distribution of returns
          </p>
        </div>
        <div
          className="swift-back-office-preview-performance-chart-container"
          ref={graphContainerRef}
        >
          {graphDimensions.width > 0 && graphDimensions.height > 0 && (
            <LineScatter
              data={drawData}
              width={graphDimensions.width / 1.5}
              height={graphDimensions.height}
            />
          )}
        </div>
      </div>

      <div className="swift-back-office-preview-ratio-return">
        <div className="swift-back-office-preview-ratio"></div>
        <div className="swift-back-office-preview-return">
          <PositiveNegativeBarChart
            data={PNbarData}
            width={graphDimensions.width / 2}
            height={480}
          />
        </div>
      </div>

      <div className="swift-back-office-preview-question"></div>

      <div className="swift-back-office-preview-shareclass">
        <p className="swift-back-office-preview-team-heading">Share Classes</p>
        <p className="swift-back-office-preview-shareclass-sub-heading">
          Administrator - Northern Trust
        </p>

        <div className="swift-back-office-preview-shareclass-table">
          <table>
            <thead>
              <tr>
                {shareClassData[0].map((header, index) => (
                  <th
                    key={index}
                    style={{
                      textAlign:
                        index == discretePerformanceData[0].length - 1
                          ? "right"
                          : "left",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {shareClassData.slice(1).map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  style={{
                    backgroundColor: rowIndex % 2 == 0 ? "#fafafa" : "#fff",
                  }}
                >
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      style={{
                        textAlign:
                          cellIndex == row.length - 1 ? "right" : "left",
                      }}
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="swift-back-office-preview-shareclass-download">
          Prospectus
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M19 11.8963C18.7348 11.8963 18.4804 12.0007 18.2929 12.1867C18.1054 12.3726 18 12.6247 18 12.8877V16.8531C18 17.116 17.8946 17.3682 17.7071 17.5541C17.5196 17.74 17.2652 17.8444 17 17.8444H3C2.73478 17.8444 2.48043 17.74 2.29289 17.5541C2.10536 17.3682 2 17.116 2 16.8531V12.8877C2 12.6247 1.89464 12.3726 1.70711 12.1867C1.51957 12.0007 1.26522 11.8963 1 11.8963C0.734784 11.8963 0.48043 12.0007 0.292893 12.1867C0.105357 12.3726 0 12.6247 0 12.8877V16.8531C0 17.6419 0.316071 18.3983 0.87868 18.9561C1.44129 19.5138 2.20435 19.8272 3 19.8272H17C17.7956 19.8272 18.5587 19.5138 19.1213 18.9561C19.6839 18.3983 20 17.6419 20 16.8531V12.8877C20 12.6247 19.8946 12.3726 19.7071 12.1867C19.5196 12.0007 19.2652 11.8963 19 11.8963ZM9.29 13.5915C9.3851 13.6818 9.49725 13.7525 9.62 13.7997C9.7397 13.8522 9.86913 13.8792 10 13.8792C10.1309 13.8792 10.2603 13.8522 10.38 13.7997C10.5028 13.7525 10.6149 13.6818 10.71 13.5915L14.71 9.62609C14.8983 9.43941 15.0041 9.18622 15.0041 8.92222C15.0041 8.65822 14.8983 8.40503 14.71 8.21836C14.5217 8.03168 14.2663 7.92681 14 7.92681C13.7337 7.92681 13.4783 8.03168 13.29 8.21836L11 10.4985V0.991358C11 0.728433 10.8946 0.476278 10.7071 0.290362C10.5196 0.104446 10.2652 0 10 0C9.73478 0 9.48043 0.104446 9.29289 0.290362C9.10536 0.476278 9 0.728433 9 0.991358V10.4985L6.71 8.21836C6.61676 8.12593 6.50607 8.0526 6.38425 8.00258C6.26243 7.95255 6.13186 7.92681 6 7.92681C5.86814 7.92681 5.73757 7.95255 5.61575 8.00258C5.49393 8.0526 5.38324 8.12593 5.29 8.21836C5.19676 8.31079 5.1228 8.42052 5.07234 8.54129C5.02188 8.66206 4.99591 8.7915 4.99591 8.92222C4.99591 9.05294 5.02188 9.18238 5.07234 9.30315C5.1228 9.42392 5.19676 9.53365 5.29 9.62609L9.29 13.5915Z"
              fill="black"
            />
          </svg>
        </p>
      </div>
    </div>
  );
};

export default BackOfficeDashboardPreview;
