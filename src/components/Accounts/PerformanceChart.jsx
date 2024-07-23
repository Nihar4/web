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
import {
  PerformancetooltipContent,
  tooltipContent,
} from "../../exports/ChartProps";
import PriceMarkerCoordinate from "../CustomComponents/CustomChartComponents/PriceMaker/PriceMarkerCoordinate";
import PriceEdgeIndicator from "../CustomComponents/CustomChartComponents/EdgeIndicator/PriceEdgeIndicator";
import Pulse from "../Loader/Pulse";
import {
  LabelAnnotation,
  Label,
  Annotate,
} from "react-stockcharts/lib/annotation";
import { discontinuousTimeScaleProvider } from "react-stockcharts/lib/scale";
import { last } from "react-stockcharts/lib/utils";
import PerformanceHoverTooltip from "../CustomComponents/CustomChartComponents/PerformanceHoverTooltip";

const PerformanceChart = ({ data: initialData, ratio, loading2 }) => {
  const vwToPixels = (vw) => {
    return (
      Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
      ) *
      (vw / 100)
    );
  };

  const vhToPixels = (vh) => {
    return (
      Math.max(
        document.documentElement.clientHeight || 0,
        window.innerHeight || 0
      ) *
      (vh / 100)
    );
  };

  const widthVW = 65;
  const heightVH = 70;

  const width = vwToPixels(widthVW);
  const height = vhToPixels(heightVH);

  //   const xExtents = [
  //     new Date(initialData[0].date),
  //     new Date(initialData[initialData.length - 1].date),
  //   ];
  const lastDate = new Date(initialData[initialData.length - 1].date);

  const xScaleProvider = discontinuousTimeScaleProvider.inputDateAccessor(
    (d) => new Date(d.date)
  );

  const newData = [];

  for (let i = 1; i <= 2; i++) {
    const nextDate = new Date(lastDate);
    nextDate.setDate(lastDate.getDate() + i);
    const newDataItem = {
      date: nextDate.toISOString(),
      portfolioValue: 0,
      indexValue: 0,
      basePortfolioValue: 0,
      portfolioValueChange: 0,
      baseIndexValue: 0,
      indexValueChange: 0,
    };
    newData.push(newDataItem);
  }

  initialData = [...initialData, ...newData];

  const { data, xScale, xAccessor, displayXAccessor } =
    xScaleProvider(initialData);
  const xExtents = [xAccessor(data[0]), xAccessor(last(data))];

  return initialData.length > 0 && !loading2 ? (
    <>
      <ChartCanvas
        width={width}
        height={height - 20}
        ratio={0.8}
        margin={{ left: 20, right: 70, top: 10, bottom: 50 }}
        seriesName="MSFT"
        data={data}
        clamp={"both"}
        xAccessor={xAccessor}
        xScale={xScale}
        xExtents={xExtents}
        displayXAccessor={displayXAccessor}
        type={"svg"}
      >
        <Chart
          id={10}
          yExtents={(d) => {
            const filteredData = data.filter(
              (data) => new Date(data.date) <= lastDate
            );

            const percentageChanges = filteredData
              .map((data) => [data.basePortfolioValue, data.baseIndexValue])
              .flat()
              .filter((value) => value !== undefined);

            if (percentageChanges.length === 0) {
              return [0, 0];
            }

            const minChange = Math.min(...percentageChanges);
            const maxChange = Math.max(...percentageChanges);

            const minY = minChange < 0 ? minChange * 1.2 : minChange * 0.8;
            const maxY = maxChange > 0 ? maxChange * 1.2 : maxChange * 0.8;
            return [minY, maxY];
          }}
        >
          <XAxis
            axisAt="bottom"
            orient="bottom"
            tickLabelAngle={-45}
            ticks={12}
            stroke="#f1f1f1"
          />
          <Label
            x={(width - 15 - 70) / 2}
            y={height - 45}
            fontSize="12"
            text={`TEXTCHECK`}
          />
          <YAxis axisAt="right" orient="right" ticks={5} stroke="#f1f1f1" />

          <LineSeries
            yAccessor={(d) =>
              new Date(d.date) <= lastDate ? d.basePortfolioValue : undefined
            }
            stroke="rgb(0 15 255)"
            highlightOnHover
          />
          <LineSeries
            yAccessor={(d) =>
              new Date(d.date) <= lastDate ? d.baseIndexValue : undefined
            }
            stroke="grey"
            highlightOnHover
          />

          <PerformanceHoverTooltip
            tooltipContent={PerformancetooltipContent()}
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
        </Chart>
      </ChartCanvas>
      <div
        className="x-axis-label"
        style={{ display: "flex", columnGap: "10px" }}
      >
        <div style={{ display: "flex", columnGap: "5px" }}>
          <div
            style={{
              width: "20px",
              height: "15px",
              backgroundColor: "rgb(0 15 255)",
            }}
          ></div>
          Portfolio
        </div>
        <div style={{ display: "flex", columnGap: "5px" }}>
          <div
            style={{
              width: "20px",
              height: "15px",
              backgroundColor: "grey",
            }}
          ></div>
          Nifty50
        </div>
      </div>
      <div className="x-axis-label">Portfolio vs Nifty50</div>
    </>
  ) : (
    <div className="swift-aseet-loader">
      <Pulse />
    </div>
  );
};

export default PerformanceChart;
