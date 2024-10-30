import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
  Dot,
  Scatter,
  ComposedChart,
} from "recharts";

const CHART_COLORS = ["#4CAF50", "#F44336"];
const PositiveNegativeBarChart = ({ data, width = 600, height = 300 }) => {
  return (
    <ComposedChart
      width={width}
      height={height}
      data={data}
      margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
      stackOffset="sign"
    >
      <XAxis
        dataKey="x"
        tick={{ fontSize: 11, fill: "#333" }}
        axisLine={{ stroke: "#000" }}
        tickLine={false}
      />
      <YAxis
        tick={{ fontSize: 11, fill: "#333" }}
        axisLine={{ stroke: "#000" }}
        tickLine={false}
      />
      {/* <Tooltip formatter={(value) => `${value}%`} /> */}
      <Legend
        layout="horizontal"
        align="center"
        verticalAlign="bottom"
        // iconType="square"
        wrapperStyle={{
          fontSize: 12,
          color: "#333",
        }}
      />
      <Bar dataKey="positive" fill={CHART_COLORS[0]} stackId="a">
        <LabelList
          dataKey="positive"
          position="insideTop"
          style={{ fontSize: 11, fill: "#000" }}
          formatter={(value) => `${value}%`}
        />
      </Bar>
      <Bar dataKey="negative" fill={CHART_COLORS[1]} stackId="a">
        <LabelList
          dataKey="negative"
          position="insideTop"
          style={{ fontSize: 11, fill: "#000" }}
          formatter={(value) => `${value}%`}
        />
      </Bar>
      <Scatter dataKey="avg" fill="#000" />
    </ComposedChart>
  );
};

export default PositiveNegativeBarChart;
