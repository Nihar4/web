import React, { Component } from "react";
import PropTypes from "prop-types";
import GenericComponent from "react-stockcharts/lib/GenericComponent";
import { sum } from "d3-array";

import {
  first,
  last,
  isNotDefined,
  isDefined,
  hexToRGBA,
} from "react-stockcharts/lib/utils";

export class PerformanceHoverTooltip extends Component {
  constructor(props) {
    super(props);
    this.renderSVG = this.renderSVG.bind(this);
    this.drawOnCanvas = this.drawOnCanvas.bind(this);
  }
  drawOnCanvas(ctx, moreProps) {
    const pointer = helper(this.props, moreProps, ctx);
    const { height } = moreProps;

    if (isNotDefined(pointer)) return null;
    drawOnCanvas(ctx, this.props, this.context, pointer, height, moreProps);
  }
  render() {
    return (
      <GenericComponent
        svgDraw={this.renderSVG}
        canvasDraw={this.drawOnCanvas}
        drawOn={["mousemove", "pan" /* , "mouseleave" */]}
      />
    );
  }
  renderSVG(moreProps) {
    // console.log(moreProps.fullData.slice(-5));
    // console.log(this.props)
    // moreProps.fullData.splice(-5)
    const pointer = helper(this.props, moreProps);

    if (isNotDefined(pointer)) return null;

    const { bgFill, bgOpacity, backgroundShapeSVG, tooltipSVG, lastDate } =
      this.props;
    const { bgheight, bgwidth, bgrx } = this.props;
    const { height } = moreProps;

    const { x, y, content, centerX, pointWidth, bgSize, key } = pointer;

    const date = key;

    const bgShape =
      isDefined(bgwidth) && isDefined(bgheight)
        ? { width: bgwidth, height: bgheight, rx: bgrx }
        : { ...bgSize, rx: bgrx };

    // console.log("con", content, pointer);
    if (date <= lastDate) {
      return (
        <g>
          <rect
            x={centerX - pointWidth / 2}
            y={0}
            width={pointWidth}
            height={height}
            fill={bgFill}
            opacity={bgOpacity}
          />
          <g
            // className="react-stockcharts-tooltip-content"
            transform={`translate(${x}, ${y})`}
          >
            {backgroundShapeSVG(this.props, bgShape)}
            {tooltipSVG(this.props, content)}
          </g>
        </g>
      );
    }
  }
}

PerformanceHoverTooltip.propTypes = {
  chartId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  yAccessor: PropTypes.func,
  tooltipSVG: PropTypes.func,
  backgroundShapeSVG: PropTypes.func,
  bgwidth: PropTypes.number,
  bgheight: PropTypes.number,
  bhrx: PropTypes.number,
  bgFill: PropTypes.string.isRequired,
  bgOpacity: PropTypes.number.isRequired,
  tooltipContent: PropTypes.func.isRequired,
  origin: PropTypes.oneOfType([PropTypes.array, PropTypes.func]).isRequired,
  fontFamily: PropTypes.string,
  fontSize: PropTypes.number,
  isLabled: PropTypes.bool,
  isInline: PropTypes.bool,
  lastDate: PropTypes.string,
};

PerformanceHoverTooltip.contextTypes = {
  margin: PropTypes.object.isRequired,
  ratio: PropTypes.number.isRequired,
};

PerformanceHoverTooltip.defaultProps = {
  bgwidth: 150,
  bgheight: 80,
  tooltipSVG: tooltipSVG,
  tooltipCanvas: tooltipCanvas,
  origin: origin,
  fill: "#D4E2FD",
  bgFill: "#D4E2FD",
  bgOpacity: 0.5,
  stroke: "#9B9BFF",
  fontFill: "#000000",
  opacity: 0.8,
  backgroundShapeSVG: backgroundShapeSVG,
  backgroundShapeCanvas: backgroundShapeCanvas,
  fontFamily: "Helvetica Neue, Helvetica, Arial, sans-serif",
  fontSize: 12,
  bgrx: 3,
  isLabled: true,
  isInline: false,
};

const PADDING = 5;
const X = 10;
const Y = 10;
const INNER = true;

/* eslint-disable react/prop-types */
function backgroundShapeSVG(
  { fill, stroke, opacity, ...props },
  { height, width, rx }
) {
  return (
    <rect
      height={height}
      width={width}
      fill={fill}
      rx={rx}
      opacity={opacity}
      stroke={stroke}
    />
  );
}

function tooltipSVG({ fontFamily, fontSize, fontFill, isLabled }, content) {
  const tspans = [];
  let yvalues = "";
  const startY = Y + fontSize * 0.9;

  for (let i = 0; i < content.y.length; i++) {
    const y = content.y[i];
    const textY = startY + (fontSize * (i + 1) + 3);

    if (isLabled) {
      tspans.push(
        <tspan key={`L-${i}`} x={X} y={textY} fill={y.stroke}>
          {y.label}
        </tspan>
      );
      tspans.push(<tspan key={i}>: </tspan>);
      tspans.push(<tspan key={`V-${i}`}>{y.value}</tspan>);
    } else {
      tspans.push(
        <tspan key={`V-${i}`} x={X} y={textY} fill={y.stroke}>
          {y.value}
        </tspan>
      );
    }

    yvalues =
      y.value && y.value !== undefined ? yvalues + " " + y.value : yvalues;
  }
  return (
    <text
      fontFamily={fontFamily}
      fontSize={fontSize}
      fill={fontFill}
      fontWeight={600}
    >
      <tspan x={X} y={startY}>
        {content.x}
      </tspan>
      <tspan x={X} y={startY + fontSize * 1.2}>
        {content.y[2].label + ": " + content.y[2].value}
      </tspan>
      <tspan x={X} y={startY + fontSize * 2.4}>
        {content.y[0].label + ": " + content.y[0].value}
      </tspan>
      <tspan x={X} y={startY + fontSize * 3.6}>
        {content.y[3].label + ": " + content.y[3].value}
      </tspan>
      <tspan x={X} y={startY + fontSize * 4.8}>
        {content.y[1].label + ": " + content.y[1].value}
      </tspan>
    </text>
  );
}
/* eslint-enable react/prop-types */

function backgroundShapeCanvas(props, { width, height }, ctx) {
  const { fill, stroke, opacity } = props;

  ctx.fillStyle = hexToRGBA(fill, opacity);
  ctx.strokeStyle = stroke;
  ctx.beginPath();
  ctx.rect(0, 0, width, height);
  ctx.fill();
  ctx.stroke();
}

function tooltipCanvas({ fontFamily, fontSize, fontFill }, content, ctx) {
  const startY = Y + fontSize * 0.9;
  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = fontFill;
  ctx.textAlign = "left";
  ctx.fillText(content.x, X, startY);

  for (let i = 0; i < content.y.length; i++) {
    const y = content.y[i];
    const textY = startY + fontSize * (i + 1);
    ctx.fillStyle = y.stroke || fontFill;
    ctx.fillText(y.label, X, textY);

    ctx.fillStyle = fontFill;
    ctx.fillText(": " + y.value, X + ctx.measureText(y.label).width, textY);
  }
}

function drawOnCanvas(ctx, props, context, pointer, height) {
  const { margin, ratio } = context;
  const { bgFill, bgOpacity } = props;
  const { backgroundShapeCanvas, tooltipCanvas } = props;

  const originX = 0.5 * ratio + margin.left;
  const originY = 0.5 * ratio + margin.top;

  ctx.save();

  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(ratio, ratio);

  ctx.translate(originX, originY);

  const { x, y, content, centerX, pointWidth, bgSize } = pointer;

  ctx.fillStyle = hexToRGBA(bgFill, bgOpacity);
  ctx.beginPath();
  ctx.rect(centerX - pointWidth / 2, 0, pointWidth, height);
  ctx.fill();

  ctx.translate(x, y);
  backgroundShapeCanvas(props, bgSize, ctx);
  tooltipCanvas(props, content, ctx);

  ctx.restore();
}

function calculateTooltipSize(
  { fontFamily, fontSize, fontFill, isInline },
  content,
  ctx
) {
  if (isNotDefined(ctx)) {
    const canvas = document.createElement("canvas");
    ctx = canvas.getContext("2d");
  }

  ctx.font = `${fontSize}px ${fontFamily}`;
  ctx.fillStyle = fontFill;
  ctx.textAlign = "left";

  const measureText = (str) => ({
    width: ctx.measureText(str).width,
    height: fontSize,
  });

  // console.log(content.y);

  if (isInline) {
    const { width, height } = content.y
      .map(({ label, value }) => {
        return value && value !== undefined
          ? measureText(`${value}`)
          : { width: 0, height: 0 };
      })
      // Sum all y and x sizes (begin with x label size)
      .reduce(
        (res, size) => sumWidths(res, size),
        measureText(String(content.x))
      );

    let addX = width >= 100 ? 3 : 2;

    return {
      width: width + addX * X,
      height: height + 2 * Y,
    };
  } else {
    const { width, height } = content.y
      .map(({ label, value }) => measureText(`${label}: ${value}`))
      // Sum all y and x sizes (begin with x label size)
      .reduce(
        (res, size) => sumSizes(res, size),
        measureText(String(content.x))
      );

    return {
      width: width + 2 * X,
      height: height + 2 * Y,
    };
  }
}

function sumSizes(...sizes) {
  return {
    width: Math.max(...sizes.map((size) => size.width)),
    height: sum(sizes, (d) => d.height),
  };
}

function sumWidths(...sizes) {
  // console.log(sizes);

  return {
    width: sum(sizes, (d) => d.width),
    height: Math.max(...sizes.map((size) => size.height)),
  };
}

function normalizeX(x, bgSize, pointWidth, width) {
  // return x - bgSize.width - pointWidth / 2 - PADDING * 2 < 0
  return x < width / 2
    ? x + pointWidth / 2 + PADDING
    : x - bgSize.width - pointWidth / 2 - PADDING;
}

function normalizeY(y, bgSize) {
  return y - bgSize.height <= 0 ? y + PADDING : y - bgSize.height - PADDING;
}

function origin(props, moreProps, bgSize, pointWidth) {
  const { chartId, yAccessor } = props;
  const { mouseXY, xAccessor, currentItem, xScale, chartConfig, width } =
    moreProps;
  let y = last(mouseXY);

  const xValue = xAccessor(currentItem);
  let x = Math.round(xScale(xValue));

  if (
    isDefined(chartId) &&
    isDefined(yAccessor) &&
    isDefined(chartConfig) &&
    isDefined(chartConfig.findIndex)
  ) {
    const yValue = yAccessor(currentItem);
    const chartIndex = chartConfig.findIndex((x) => x.id === chartId);

    y = Math.round(chartConfig[chartIndex].yScale(yValue));
  }

  x = normalizeX(x, bgSize, pointWidth, width);
  y = normalizeY(y, bgSize);

  return [x, y];
}

function helper(props, moreProps, ctx) {
  const { show, xScale, currentItem, plotData } = moreProps;
  const { origin, tooltipContent } = props;
  const { xAccessor, displayXAccessor } = moreProps;

  if (!show || isNotDefined(currentItem)) return;

  const xValue = xAccessor(currentItem);

  if (!show || isNotDefined(xValue)) return;

  const content = tooltipContent({ currentItem, xAccessor: displayXAccessor });
  const centerX = xScale(xValue);
  const pointWidth =
    Math.abs(
      xScale(xAccessor(last(plotData))) - xScale(xAccessor(first(plotData)))
    ) /
    (plotData.length - 1);

  const bgSize = calculateTooltipSize(props, content, ctx);

  const [x, y] = origin(props, moreProps, bgSize, pointWidth);

  return {
    x,
    y,
    content,
    centerX,
    pointWidth,
    bgSize,
    key: currentItem["date"],
  };
}

export default PerformanceHoverTooltip;
