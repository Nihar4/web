import React, { useState, useEffect } from "react";
import { ChartCanvas, Chart } from "react-stockcharts";
import { LineSeries } from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { CrossHairCursor } from "react-stockcharts/lib/coordinates";
import { scaleTime } from "d3-scale";
import { fitWidth } from "react-stockcharts/lib/helper";

const PerformanceChart = ({ data, width, ratio, height }) => {
  const [xevents, setXevents] = useState([new Date(), new Date()]);
  const [yExtents, setYExtents] = useState([0, 0]);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    if (data && data.length > 0) {
      const xMin = new Date(data[0].date);
      const xMax = new Date(data[data.length - 1].date);
      setXevents([xMin, xMax]);

      let yMin = Infinity;
      let yMax = -Infinity;
      data.forEach((d) => {
        yMin = Math.min(yMin, d.value1, d.value2, d.value3);
        yMax = Math.max(yMax, d.value1, d.value2, d.value3);
      });
      setYExtents([0.8 * yMin, 1.2 * yMax]);
      setTimeout(() => {
        setloading(false);
      }, 2000);
    }
  }, [data]);

  return (
    !loading && (
      <ChartCanvas
        width={width}
        height={height - 70}
        ratio={ratio}
        margin={{ left: 0, right: 0, top: 10, bottom: 30 }}
        seriesName="MSFT"
        data={data}
        clamp={"both"}
        xAccessor={(d) => new Date(d.date)}
        xScale={scaleTime()}
        xExtents={xevents}
        type={"svg"}
      >
        <Chart id={"backoffice-chart"} yExtents={yExtents}>
          <LineSeries
            yAccessor={(d) => d?.value1}
            stroke="#f84aa7"
            strokeWidth={3}
            strokeDasharray={"Solid"}
            highlightOnHover
          />
          <LineSeries
            yAccessor={(d) => d?.value2}
            strokeWidth={3}
            stroke="#000fff"
          />
          <LineSeries
            yAccessor={(d) => d?.value3}
            strokeWidth={3}
            stroke="#cccccc"
          />

          {/* <XAxis /> */}
          {/* <YAxis /> */}
          <CrossHairCursor />
        </Chart>
      </ChartCanvas>
    )
  );
};

export default PerformanceChart;
