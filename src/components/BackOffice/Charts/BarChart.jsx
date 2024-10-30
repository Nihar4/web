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
} from "recharts";
import { CHART_COLORS } from "../../../exports/ColorVars";

const AllocationBarChart = ({ data, width = 600, height = 300 }) => {
  const transformedData = data.map((d) => {
    const transformed = { x: d.x };
    d.y.forEach((value, index) => {
      transformed[`y${index}`] = value;
    });
    return transformed;
  });

  const yKeys = data[0].y.map((_, index) => `y${index}`);

  const tooltipFormatter = (value) => `${value}%`;

  return (
    <BarChart
      width={width}
      height={height}
      data={transformedData}
      barCategoryGap="10%"
      margin={{ top: 20, right: 200, left: -25, bottom: 0 }}
    >
      <XAxis
        dataKey="x"
        tick={{ fontSize: 11, fill: "#333" }}
        axisLine={{ stroke: "#e0e0e0", strokeWidth: 0 }}
      />
      <YAxis
        tick={{ fontSize: 11, fill: "#333" }}
        axisLine={{ stroke: "#e0e0e0", strokeWidth: 0 }}
      />
      {/* <Tooltip formatter={tooltipFormatter} /> */}
      <Legend
        layout="vertical"
        align="right"
        verticalAlign="top"
        iconType="square"
        wrapperStyle={{
          paddingLeft: 50,
          paddingTop: 100,
          fontSize: 12,
          color: "#333",
        }}
      />
      {yKeys.map((key, index) => (
        <Bar
          key={key}
          dataKey={key}
          fill={CHART_COLORS[index % CHART_COLORS.length]}
          stackId="a"
        >
          <LabelList
            dataKey={key}
            position="center"
            style={{ fontSize: 11, fill: "#000" }}
            formatter={(value) => `${value}%`}
          />
        </Bar>
      ))}
    </BarChart>
  );
};

export default AllocationBarChart;
