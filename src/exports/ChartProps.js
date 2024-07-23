import { timeFormat } from "d3-time-format";
import { format } from "d3-format";
import { numberFormat } from "../utils/utilsFunction";

const fillColor = "#000000";
const fontFamily = "Open Sans, sans-serif";
const fontWeight = 600;
const cursorFontSize = 10;
const rectWidth = 100;

const getXCoordinateProps = (range) => {
  let df = timeFormat("%d %b '%y  %H:%M");
  if (range === "1Y" || range === "5Y" || range === "MAX") {
    df = timeFormat("%d %b %Y");
  }
  return {
    at: "bottom",
    orient: "bottom",
    displayFormat: df,
    fontFamily: fontFamily,
    fontSize: cursorFontSize,
    rectWidth: rectWidth,
    rectHeight: 20,
    fill: fillColor,
  };
};

const getYCoordinateProps = () => {
  return {
    at: "right",
    orient: "right",
    displayFormat: format(".2f"),
    arrowWidth: 0,
    fontFamily: fontFamily,
    fontSize: cursorFontSize,
    rectHeight: 25,
    fill: fillColor,
  };
};

const getXAxisProps = () => {
  return {
    axisAt: "bottom",
    orient: "bottom",
    ticks: 10,
    tickStroke: "#888888",
    stroke: "#c8c8c8",
    fontWeight: fontWeight,
    fontFamily: fontFamily,
    fontSize: 10,
  };
};

const getYAxisProps = (totalCharts) => {
  return {
    axisAt: "right",
    orient: "right",
    ticks: Math.ceil(10 / totalCharts),
    tickStroke: "#888888",
    stroke: "#c8c8c8",
    fontWeight: fontWeight,
    fontFamily: fontFamily,
    fontSize: 10,
    tickFormat: format(".2f"),
  };
};

const getCompareXAxisProps = () => {
  return {
    axisAt: "bottom",
    orient: "bottom",
    ticks: 10,
    tickStroke: "#888888",
    stroke: "#c8c8c8",
    fontWeight: fontWeight,
    fontFamily: fontFamily,
    fontSize: 10,
  };
};

const getCompareYAxisProps = () => {
  return {
    axisAt: "right",
    orient: "right",
    ticks: 10,
    tickStroke: "#888888",
    stroke: "#c8c8c8",
    fontWeight: fontWeight,
    fontFamily: fontFamily,
    fontSize: 10,
    tickFormat: format(".2%"),
  };
};

const tooltipContent = (range) => {
  let nf = format(".2f");
  let df = timeFormat("%d %b '%y  %H:%M");
  if (range === "1Y" || range === "5Y" || range === "MAX") {
    df = timeFormat("%d %b %Y");
  }
  return ({ currentItem, xAccessor }) => {
    return {
      x: df(xAccessor(currentItem)),
      y: [
        {
          label: "close",
          value: currentItem.close
            ? nf(currentItem.close)
            : nf(currentItem.close6),
        },
      ],
    };
  };
};

const PerformancetooltipContent = () => {
  let nf = numberFormat;
  let df = timeFormat("%d %b %Y");

  return ({ currentItem, xAccessor }) => {
    return {
      x: df(xAccessor(currentItem)),
      y: [
        {
          label: "Portfolio",
          value:
            nf(currentItem.portfolioValue, 0)
        },
        {
          label: "Nifty50",
          value:
            nf(currentItem.indexValue, 0)
        },
      ],
    };
  };
};

export {
  getXCoordinateProps,
  getYCoordinateProps,
  getXAxisProps,
  getYAxisProps,
  getCompareXAxisProps,
  getCompareYAxisProps,
  tooltipContent,
  PerformancetooltipContent
};
