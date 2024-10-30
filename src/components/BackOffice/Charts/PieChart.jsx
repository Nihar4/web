import React from "react";
import { PieChart, Pie, Sector, ResponsiveContainer, Legend } from "recharts";
import { numberFormat } from "../../../utils/utilsFunction";
import { CHART_COLORS } from "../../../exports/ColorVars";

const DEVICE_SIZE = "L";

const CustomActiveShape = (props) => {
  const {
    cx,
    cy,
    cornerRadius,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
  } = props;

  const width = innerRadius * 2;
  const height = innerRadius * 2;

  return (
    <g>
      <foreignObject
        x={cx - innerRadius}
        y={cy - innerRadius}
        dy={8}
        width={width}
        height={height}
      >
        <div
          style={{
            width: width,
            height: height,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 11,
            fontWeight: 600,
            textAlign: "center",
            padding: "0 10px",
          }}
        >
          <span style={{ fontSize: "16px" }}>
            {parseFloat(percent * 100).toFixed(2)}%
          </span>
          <span>{payload.name}</span>
        </div>
      </foreignObject>
      <Sector
        cx={cx}
        cy={cy}
        cornerRadius={cornerRadius}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
};

const TextEllipsis = (text, length) => {
  if (text.length > length - 3) {
    return text.substring(0, length - 3) + "...";
  }
  return text;
};

const RenderLegend = (props) => {
  const { payload } = props;

  const style =
    DEVICE_SIZE == "S"
      ? {
          width: "100%",
          display: "flex",
          flexWrap: "wrap",
          columnGap: "20px",
          rowGap: "10px",
        }
      : {
          width: "200px",
          height: "240px",
          display: "flex",
          padding: "0px 10px",
          flexDirection: "column",
          rowGap: "10px",
          overflowY: "scroll",
        };

  const item_style =
    DEVICE_SIZE == "S"
      ? {
          fontSize: "12px",
          fontWeight: "600",
          display: "flex",
          columnGap: "10px",
          width: "auto",
        }
      : {
          fontSize: "11px",
          fontWeight: "600",
          display: "flex",
          justifyContent: "space-between",
          width: "100%",
        };

  return (
    <ul style={style}>
      {payload.map((entry, index) => {
        const { payload: payload_value } = entry;
        const { percent } = payload_value;
        return (
          <li key={`item-${index}`} style={{ ...item_style }}>
            <p
              style={{
                letterSpacing: "0px",
                display: "flex",
                alignItems: "center",
                columnGap: "5px",
              }}
            >
              <span
                style={{
                  display: "block",
                  width: "8px",
                  height: "8px",
                  background: entry["color"],
                  borderRadius: "50%",
                }}
              ></span>
              <span title={entry.value}>{TextEllipsis(entry.value, 15)}</span>
            </p>{" "}
            <p>{numberFormat(percent * 100)}%</p>
          </li>
        );
      })}
    </ul>
  );
};

class AllocationPieChart extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      data: false,
      activeIndex: 0,
    };

    this.GetSectorMarketDataArray = this.GetSectorMarketDataArray.bind(this);
  }

  componentDidMount() {
    this.GetSectorMarketDataArray();
  }

  componentDidUpdate(prevProp) {
    if (prevProp.values !== this.props.values) {
      this.GetSectorMarketDataArray();
    }
  }

  GetSectorMarketDataArray() {
    const { values } = this.props;
    let data = [];

    values.map((v) => {
      data.push({ name: v.name.toUpperCase(), value: parseFloat(v.volume) });
    });

    data.sort((a, b) => {
      return b["value"] - a["value"];
    });

    data = data.map((d, index) => {
      return {
        ...d,
        fill: CHART_COLORS[index % CHART_COLORS.length],
      };
    });

    this.setState({ data, loading: false });
  }

  onPieEnter = (_, index) => {
    this.setState({
      activeIndex: index,
    });
  };

  render() {
    const { data } = this.state;
    const { width = 300, height = 150, unit = "Value" } = this.props;
    console.log(data, width, height, unit);

    return (
      <div className="strategy__sector__chart" style={{ height: "500px" }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart width={width} height={height}>
            {DEVICE_SIZE === "S" ? (
              <>
                <Pie
                  activeIndex={this.state.activeIndex}
                  activeShape={<CustomActiveShape unit={unit} />}
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  cornerRadius={0}
                  opacity={0.9}
                  paddingAngle={0}
                  dataKey="value"
                  onMouseEnter={this.onPieEnter}
                />
                <Legend
                  content={RenderLegend}
                  iconType="circle"
                  iconSize={6}
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="right"
                />
              </>
            ) : (
              <>
                <Pie
                  activeIndex={this.state.activeIndex}
                  activeShape={<CustomActiveShape unit={unit} />}
                  data={data}
                  cx="45%"
                  cy="40%"
                  innerRadius={60}
                  outerRadius={90}
                  cornerRadius={0}
                  opacity={0.9}
                  paddingAngle={0}
                  dataKey="value"
                  onMouseEnter={this.onPieEnter}
                />
                <Legend
                  content={RenderLegend}
                  iconType="circle"
                  iconSize={6}
                  layout="vertical"
                  verticalAlign="top"
                  align="right"
                />
              </>
            )}
          </PieChart>
        </ResponsiveContainer>
      </div>
    );
  }
}

export default AllocationPieChart;
