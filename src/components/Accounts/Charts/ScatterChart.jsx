
import React, { useEffect, useState } from 'react';
import { Scatter } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, PointElement, LinearScale, CategoryScale } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';

ChartJS.register(Title, Tooltip, Legend, PointElement, LinearScale, CategoryScale, zoomPlugin);

const ScatterChart = ({ initialData, width, ratio, height, HandleOptData }) => {
  const [clickedIndices, setClickedIndices] = useState([]);

  const transformedData = initialData.map((item, index) => ({
    x: Math.sqrt(12) * item.risk,
    y: item.return,
    z: item.weights,
    backgroundColor: clickedIndices.includes(index) ? 'yellow' : '#000fff',
  }));

  const data = {
    datasets: [
      {
        data: transformedData,
        backgroundColor: (context) => context.raw.backgroundColor,
        pointRadius: 4,
      },
    ],
  };

  const xMin = Math.min(...transformedData.map(point => point.x));
  const xMax = Math.max(...transformedData.map(point => point.x));
  const yMin = Math.min(...transformedData.map(point => point.y));
  const yMax = Math.max(...transformedData.map(point => point.y));

  useEffect(() => {
    if (transformedData.length > 0) {
      const maxRiskPoint = transformedData.reduce((prev, curr) => (prev.x > curr.x ? prev : curr));
      const maxRiskIndex = transformedData.findIndex(point => point.x === maxRiskPoint.x);
      setClickedIndices([maxRiskIndex]);
      HandleOptData(maxRiskPoint);
    }
  }, [initialData]);

  const handleClick = (event, elements) => {
    if (elements.length > 0) {
      const elementIndex = elements[0].index;
      const pointData = transformedData[elementIndex];

      setClickedIndices([elementIndex]);
      HandleOptData(pointData);
    }
  };

  const options = {
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'linear',
        position: 'bottom',
        title: {
          display: true,
          text: 'Risk',
        },
      },
      y: {
        type: 'linear',
        position: 'left',
        title: {
          display: true,
          text: 'Return',
        },
      },
    },
    // animations: {
    //   radius: {
    //     duration: 400,
    //     easing: 'linear',
    //   },
    // },
    // hoverRadius: 5,
    // hoverBackgroundColor: 'yellow',
    // interaction: {
    //   mode: 'nearest',
    //   intersect: false,
    //   axis: 'x',
    // },
    plugins: {
      tooltip: {
        enabled: false,
      },
      legend: {
        display: false,
      },
      zoom: {
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: 'xy',
        },
        pan: {
          enabled: true,
          mode: 'xy',
          limits: {
            x: { min: xMin, max: xMax, minRange: 0.01 },
            y: { min: yMin, max: yMax, minRange: 0.01 },
          },
        },
      },
    },
    onClick: (event, elements) => handleClick(event, elements),
  };

  return (
    <div style={{ width: width, height: height }}>
      <Scatter data={data} options={options} />
    </div>
  );
};

export default ScatterChart;





// // import React, { useState, useEffect } from "react";
// // import { ChartCanvas, Chart } from "react-stockcharts";
// // import {
// //   CircleMarker,
// //   LineSeries,
// //   ScatterSeries,
// // } from "react-stockcharts/lib/series";
// // import { XAxis, YAxis } from "react-stockcharts/lib/axes";
// // import { scaleLinear } from "d3-scale";
// // import Pulse from "../Loader/Pulse";
// // import { format } from "d3-format";
// // import { ClickCallback } from "react-stockcharts/lib/interactive";
// // import { HoverTooltip } from "react-stockcharts/lib/tooltip";
// // import { Label } from "react-stockcharts/lib/annotation";

// // const ScatterChart = ({
// //   data: initialData,
// //   width,
// //   ratio,
// //   height,
// //   HandleOptData,
// //   // chartload
// // }) => {
// //   const [xevents, setXevents] = useState([0, 100]);
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     if (initialData) {
// //       setLoading(true);

// //       // Filter out invalid data entries
// //       const validData = initialData.filter(
// //         (data) => data && data.risk !== undefined && data.return !== undefined
// //       );

// //       if (validData.length > 0) {
// //         const risks = validData.map((data) => data.risk);
// //         const minRisk = parseFloat(Math.min(...risks).toFixed(2));
// //         const maxRisk = parseFloat(Math.max(...risks).toFixed(2));

// //         if (minRisk == maxRisk) {
// //           setXevents([0, maxRisk + 1]);
// //         } else {
// //           setXevents([minRisk*0.8, maxRisk*1.2]);
// //         }
// //       }

// //       setTimeout(() => {
// //         setLoading(false);
// //       }, 1000);
// //     }
// //   }, [initialData]);

// //   // console.log(xevents);
// //   function tooltipContent(dataPoints) {
// //     return ({ currentItem }) => {
// //       return {
// //         x: [],
// //         y: [
// //           {
// //             label: "Risk",
// //             value:
// //               currentItem.risk !== undefined
// //                 ? format(".4f")(currentItem.risk)
// //                 : "N/A",
// //           },
// //           {
// //             label: "Return",
// //             value:
// //               currentItem.return !== undefined
// //                 ? format(".4f")(currentItem.return)
// //                 : "N/A",
// //           },
// //         ],
// //       };
// //     };
// //   }

// //   let validData = initialData.filter(
// //     (data) => data && data.risk !== undefined && data.return !== undefined
// //   );
// //   // validData.unshift({risk:0,return:0,weights:[1,1]});
// //   // validData = validData.slice(-95);
// //   console.log(xevents,validData);
// //   return validData.length > 0 && !loading  ? (
// //     <>
// //       <ChartCanvas
// //         width={width}
// //         height={height}
// //         ratio={ratio}
// //         margin={{ left: 10, right: 50, top: 10, bottom: 50 }}
// //         padding={20}
// //         seriesName="MSFT"
// //         data={validData}
// //         clamp={"both"}
// //         xAccessor={(d) => {return d.risk}}
// //         xScale={scaleLinear()}
// //         xExtents={xevents}
// //         type={"svg"}
// //         // pointsPerPxThreshold={10}
// //       >
// //         <Chart
// //           id={2}
// //           yExtents={(d) => {
// //             const returns = validData.map((data) => data.return);
// //             const minReturn = Math.min(...returns);
// //             const maxReturn = Math.max(...returns);

// //             if (minReturn == maxReturn) {
// //               return [0, maxReturn + 1];
// //             } else {
// //               return [minReturn*0.8, maxReturn*1.2];
// //             }
// //           }}

// //           padding={10}
// //         >
// //           <XAxis axisAt="bottom" orient="bottom" ticks={6} />

// //           <Label
// //             x={(width - 0 - 50) / 2}
// //             y={height - 80}
// //             fontSize="12"
// //             text="Risk"
// //             fill="#000"
// //           />

// //           <YAxis axisAt="right" orient="right" ticks={6} stroke="#000000" />

// //           <Label
// //             x={width - 80}
// //             y={height / 2}
// //             rotate={-90}
// //             fontSize="12"
// //             text="Return"
// //             fill="#000"
// //           />

// //           <ScatterSeries
// //             yAccessor={(d) => d.return}
// //             marker={CircleMarker}
// //             markerProps={{ r: 2, fill: "#0000ff" }}
// //             highlightOnHover={true}
// //           />

// //           <ClickCallback
// //             onClick={(d) => {
// //               HandleOptData(d.currentItem);
// //               console.log("onClick", d.currentItem.weights);
// //             }}
// //           />

// //           <HoverTooltip
// //             tooltipContent={tooltipContent((d) => d.currentItem)}
// //             fontSize={11}
// //             bgOpacity={0}
// //             fill="#efefef"
// //             opacity={1}
// //             bgrx={15}
// //             stroke="none"
// //           />
// //         </Chart>
// //       </ChartCanvas>

// //     </>
// //   ) : (
// //     <div className="swift-aseet-loader">
// //       <Pulse />
// //     </div>
// //   );
// // };

// // export default ScatterChart;


// import React from 'react';
// import { Scatter } from 'react-chartjs-2';
// import { Chart as ChartJS, Title, Tooltip, Legend, PointElement, LinearScale, CategoryScale } from 'chart.js';
// import zoomPlugin from 'chartjs-plugin-zoom';

// ChartJS.register(Title, Tooltip, Legend, PointElement, LinearScale, CategoryScale, zoomPlugin);
// // ChartJS.register(...registerables,);
// const ScatterChart = ({ initialData, width, ratio, height, HandleOptData }) => {
//   // console.log(initialData);

//   // Transform the data to the format required by Chart.js
//   const transformedData = initialData.map(item => ({
//     x: item.risk,
//     y: item.return,
//     z:item.weights
//   }));

//   const data = {
//     datasets: [
//       {
//         // label: 'Risk v/s Return',
//         data: transformedData,
//         backgroundColor: '#000fff',
//       },
//     ],
//   };

//   const xMin = Math.min(...transformedData.map(point => point.x));
//   const xMax = Math.max(...transformedData.map(point => point.x));
//   const yMin = Math.min(...transformedData.map(point => point.y));
//   const yMax = Math.max(...transformedData.map(point => point.y));


//   const handleClick = (event, elements) => {
//     if (elements.length > 0) {
//       const elementIndex = elements[0].index;
//       const datasetIndex = elements[0].datasetIndex;
//       const dataset = data.datasets[datasetIndex];
//       const pointData = dataset.data[elementIndex];
//       // console.log(`Clicked point data:`, pointData)
//       HandleOptData(pointData);
//     }
//   };
//   const options = {
//     maintainAspectRatio: false,
//     scales: {
//       x: {
//         type: 'linear',
//         position: 'bottom',
//         title: {
//           display: true,
//           text: 'Risk',
//         },
//       },
//       y: {
//         type: 'linear',
//         position: 'left',
//         title: {
//           display: true,
//           text: 'Return',
//         },
//       },
//     },
//     animations: {
//       radius: {
//         duration: 400,
//         easing: 'linear',
//         // loop: (context) => context.active,
//       },
//     },
//     hoverRadius: 5,
//     hoverBackgroundColor: 'yellow',
//     interaction: {
//       mode: 'nearest',
//       intersect: false,
//       axis: 'x',
//     },
//     plugins: {
//       tooltip: {
//         enabled: false,
//       },
//       legend: {
//         display: false,
//       },
//       zoom: {
//         zoom: {
//           wheel: {
//             enabled: true, 
//           },
//           pinch: {
//             enabled: true, 
//           },
//           mode: 'xy', 
//         },
//         pan: {
//           enabled: true, 
//           mode: 'xy', 
//           limits: {
//             x: { min: xMin, max: xMax, minRange: 0.01 },
//             y: { min: yMin, max: yMax, minRange: 0.01 },
//           },
//         },
//       },
//     },
//     onClick: (event, elements) => handleClick(event, elements),
//   };

//   return (
//     <div style={{ width: width, height: height }}>
//       <Scatter data={data} options={options} />
//     </div>
//   );
// };

// export default ScatterChart;

