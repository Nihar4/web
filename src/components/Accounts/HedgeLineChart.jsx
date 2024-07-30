import React, { useState, useEffect } from "react";
import { ChartCanvas, Chart, ZoomButtons } from "react-stockcharts";
import { LineSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import {
  MouseCoordinateX,
  MouseCoordinateY,
  CrossHairCursor,
} from "react-stockcharts/lib/coordinates";
import { scaleTime } from "d3-scale";
import { format } from "d3-format";
import { timeFormat } from "d3-time-format";
import { fitWidth } from "react-stockcharts/lib/helper";
import HoverTooltip from "../CustomComponents/CustomChartComponents/HoverTooltip";
import { tooltipContent } from "../../exports/ChartProps";
import PriceMarkerCoordinate from "../CustomComponents/CustomChartComponents/PriceMaker/PriceMarkerCoordinate";
import PriceEdgeIndicator from "../CustomComponents/CustomChartComponents/EdgeIndicator/PriceEdgeIndicator";
import Pulse from "../Loader/Pulse";
import {
  LabelAnnotation,
  Label,
  Annotate,
} from "react-stockcharts/lib/annotation";

const HedgeLineChart = ({
  data: initialData,
  width,
  ratio,
  height,
  duration,
  loading2,
  loading1,
  name,
}) => {
  const [xevents, setXevents] = useState([
    new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    new Date(),
  ]);
  const [uniqueDates, setUniqueDates] = useState([]);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    setloading(true);

    const lastDate = new Date(initialData[initialData.length - 1]?.date);
    const lastDatePlusFiveDays = new Date(lastDate);
    lastDatePlusFiveDays.setDate(lastDatePlusFiveDays.getDate() + 15);
    if (duration === "1M") {
      setXevents([
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        lastDatePlusFiveDays,
      ]);
    } else if (duration === "3M") {
      setXevents([
        new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000),
        lastDatePlusFiveDays,
      ]);
    } else if (duration === "6M") {
      setXevents([
        new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000),
        lastDatePlusFiveDays,
      ]);
    } else if (duration === "1Y") {
      setXevents([
        new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
        lastDatePlusFiveDays,
      ]);
    } else if (duration === "3Y") {
      setXevents([
        new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000),
        lastDatePlusFiveDays,
      ]);
    } else if (duration === "YTD") {
      const startOfYear = new Date(new Date().getFullYear(), 0, 1);
      setXevents([startOfYear, lastDatePlusFiveDays, ``]);
    } else if (duration === "5Y") {
      setXevents([
        new Date(Date.now() - 5 * 365 * 24 * 60 * 60 * 1000),
        lastDatePlusFiveDays,
      ]);
    } else if (duration === "MAX") {
      setXevents([new Date(initialData[0]?.date), lastDatePlusFiveDays]);
    }

    setTimeout(() => {
      setloading(false);
    }, 2000);
  }, [duration, initialData]);

  const today = new Date();
  const oneDayAgo = new Date(today);
  oneDayAgo.setDate(today.getDate() - 1);
  let newestDate;

  if (name.startsWith("Eurekahedge") || name == "AGG" || name == "^GSPC") {
    newestDate = new Date(initialData[initialData.length - 13].date).setDate(0);
    // console.log('nD',new Date(newestDate).toLocaleString());
  } else {
    newestDate = initialData.reduce((acc, cur) => {
      const currentDate = new Date(cur.date);
      if (currentDate <= oneDayAgo && currentDate > acc) {
        return currentDate;
      }
      return acc;
    }, new Date(0));
  }

  const lastDate = new Date(initialData[initialData.length - 1]?.date);

  const newData = [];
  if (
    duration == "1M" ||
    duration == "3M" ||
    duration == "6M" ||
    duration == "YTD"
  ) {
    for (let i = 1; i <= 15; i++) {
      const nextDate = new Date(lastDate);
      nextDate.setDate(lastDate.getDate() + i);
      const newDataItem = {
        date: nextDate.toISOString(),
        close1: 0,
        close2: 0,
        close3: 0,
        close4: 0,
        close5: 0,
        close6: 0,
      };
      newData.push(newDataItem);
    }
  } else {
    for (let i = 5; i <= 75; i += 5) {
      const nextDate = new Date(lastDate);
      nextDate.setDate(lastDate.getDate() + i);
      const newDataItem = {
        date: nextDate.toISOString(),
        close1: 0,
        close2: 0,
        close3: 0,
        close4: 0,
        close5: 0,
        close6: 0,
      };
      newData.push(newDataItem);
    }
  }
  initialData = [...initialData, ...newData];

  // console.log(initialData);
  return initialData.length > 0 && !loading2 && !loading ? (
    <>
      <ChartCanvas
        width={width}
        height={height - 20}
        ratio={ratio}
        margin={{ left: 20, right: 70, top: 10, bottom: 30 }}
        seriesName="MSFT"
        data={initialData}
        clamp={"both"}
        xAccessor={(d) => new Date(d.date)}
        xScale={scaleTime()}
        xExtents={xevents}
        type={"svg"}
      >
        <Chart
          id={1}
          yExtents={(d) => {
            const filteredData = initialData.filter(
              (data) => new Date(data.date) <= lastDate
            );

            const closeValues = filteredData
              .map((data) => [
                data.close,
                data.close1,
                data.close2,
                data.close3,
                data.close4,
                data.close5,
                data.close6,
              ])
              .flat()
              .filter((close) => close !== undefined);

            if (closeValues.length === 0) {
              return [0, 0];
            }

            const minClose = Math.min(...closeValues);
            const maxClose = Math.max(...closeValues);

            const minY = 0.8 * minClose;
            const maxY = 1.2 * maxClose;

            return [minY, maxY];
          }}
        >
          <XAxis
            axisAt="bottom"
            orient="bottom"
            tickLabelAngle={-45}
            ticks={6}
            stroke="#f1f1f1"
          />
          <Label
            x={(width - 15 - 70) / 2}
            y={height - 45}
            fontSize="12"
            text={`${name}`}
          />
          <YAxis axisAt="right" orient="right" ticks={5} stroke="#f1f1f1" />

          {/* <PriceMarkerCoordinate
            at="left"
            orient="right"
            price={30000} 
            displayFormat={format(".2f")}
            strokeDasharray="Dash"
            dx={20}
            fill="#d8d8d8"
            textFill={"rgba(1, 22, 39, 0.70)"}
            lineStroke="#404040"
            lineOpacity={0.15}
            rectWidth={65}
            rectHeight={22}
            fontSize={11}
            fontWeight="700"
            opacity={0.6}
          /> */}

          <LineSeries
            yAccessor={(d) =>
              new Date(d.date) >= newestDate ? d.close1 || d.close : undefined
            }
            stroke="rgb(248 74 167 / 30%)"
            highlightOnHover
          />
          <LineSeries
            yAccessor={(d) =>
              new Date(d.date) >= newestDate ? d.close2 || d.close : undefined
            }
            stroke="rgb(248 74 167 / 30%)"
            highlightOnHover
          />
          <LineSeries
            yAccessor={(d) =>
              new Date(d.date) >= newestDate ? d.close3 || d.close : undefined
            }
            stroke="rgb(248 74 167 / 30%)"
            highlightOnHover
          />
          <LineSeries
            yAccessor={(d) =>
              new Date(d.date) >= newestDate ? d.close4 || d.close : undefined
            }
            stroke="rgb(248 74 167 / 30%)"
            highlightOnHover
          />
          <LineSeries
            yAccessor={(d) =>
              new Date(d.date) >= newestDate ? d.close5 || d.close : undefined
            }
            stroke="rgb(248 74 167 / 30%)"
            highlightOnHover
          />
          <LineSeries
            yAccessor={(d) =>
              new Date(d.date) >= newestDate ? d.close6 || d.close : undefined
            }
            stroke="#f84aa7"
            strokeWidth={3}
            strokeDasharray={"Solid"}
            highlightOnHover
          />

          <LineSeries
            yAccessor={(d) =>
              new Date(d.date) <= new Date() ? d.close : undefined
            }
            strokeWidth={3}
            stroke="#000fff"
          />

          <HoverTooltip
            tooltipContent={tooltipContent(duration)}
            fontSize={11}
            bgOpacity={0}
            fill="#efefef"
            opacity={1}
            bgrx={15}
            stroke="none"
            isLabled={false}
            isInline={true}
            lastDate={lastDate.toISOString()}
          />

          {/* <PriceEdgeIndicator
          orient="left"
          edgeAt="right"
          itemType="last"
          // yAccessor={(d) => (d.close ? d.close : d.close6)}
          yAccessor={(d) => (new Date(d.date) <= lastDate ? (d.close ? d.close : d.close6) : undefined)}
          displayFormat={format(".2f")}
          arrowWidth={0}
          fill="#efefef"
          fontSize={11}
          rectWidth={70}
          rectHeight={22}
          textFill={"rgba(1, 22, 39, 0.70)"}
          strokeWidth={3}
          lineOpacity={0}
          opacity={1}
          rectRadius={14}
          fontWeight="700"
          dx={1}
        /> */}
        </Chart>

        {/* <CrossHairCursor /> */}
      </ChartCanvas>
      <div className="x-axis-label">{name}</div>
    </>
  ) : (
    <div className="swift-aseet-loader">
      <Pulse />
    </div>
  );
};

export default HedgeLineChart;
