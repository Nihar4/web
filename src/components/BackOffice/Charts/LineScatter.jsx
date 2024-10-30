import React, { useState, useEffect } from "react";
import { ChartCanvas, Chart } from "react-stockcharts";
import {
  CircleMarker,
  LineSeries,
  ScatterSeries,
} from "react-stockcharts/lib/series";
import { XAxis, YAxis } from "react-stockcharts/lib/axes";
import { CrossHairCursor } from "react-stockcharts/lib/coordinates";
import { scaleTime } from "d3-scale";
import { fitWidth } from "react-stockcharts/lib/helper";

const LineScatter = ({ data, width, ratio, height }) => {
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
      setYExtents([1.2 * yMin, 0]);
      setTimeout(() => {
        setloading(false);
      }, 2000);
    }
  }, [data]);
  const yTickValues = Array.from({ length: 21 }, (_, i) => i * -5);
  yTickValues[0] = 0;
  console.log(yTickValues);
  return (
    !loading && (
      <ChartCanvas
        width={width}
        height={height - 30}
        ratio={ratio}
        margin={{ left: 40, right: 20, top: 30, bottom: 40 }}
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
          <ScatterSeries
            yAccessor={(d) => d.value1}
            marker={CircleMarker}
            markerProps={{ r: 3 }}
          />

          <XAxis
            axisAt="bottom"
            orient="bottom"
            tickLabelAngle={-45}
            ticks={6}
            stroke="#f1f1f1"
          />
          <YAxis
            axisAt="left"
            orient="left"
            // tickLabelAngle={-45}
            ticks={10}
            tickValues={yTickValues}
            stroke="#f1f1f1"
            zoomEnabled={false}
            tickPadding={1}
            innerTickSize={0}
          />
          <CrossHairCursor />
        </Chart>
      </ChartCanvas>
    )
  );
};

export default LineScatter;
