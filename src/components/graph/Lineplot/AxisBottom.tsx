import { useMemo } from "react";
import { ScaleTime } from "d3";
import dayjs from "dayjs";

type AxisBottomProps = {
  xScale: ScaleTime<number, number>;
  pixelsPerTick: number;
  height: number;
};

const TICK_LENGTH = 10;

export const AxisBottom = ({
  xScale,
  pixelsPerTick,
  height,
}: AxisBottomProps) => {
  const range = xScale.range();

  const ticks = useMemo(() => {
    const width = range[1] - range[0];
    const numberOfTicksTarget = Math.floor(width / pixelsPerTick);

    return xScale.ticks(numberOfTicksTarget).map((value) => ({
      value,
      xOffset: xScale(value),
    }));
  }, [pixelsPerTick, range, xScale]);

  return (
    <>
      {ticks.map(({ value, xOffset }) => {
        const dateString = dayjs(value).format("YYYY-MM-DD");
        return (
          <g key={dateString} transform={`translate(${xOffset}, 0)`}>
            <line
              y1={TICK_LENGTH}
              y2={-height - TICK_LENGTH}
              stroke="#D2D7D3"
              strokeWidth={0.5}
              shapeRendering={"crispEdges"}
            />
            <text
              key={dateString}
              style={{
                fontSize: "9px",
                textAnchor: "middle",
                transform: "rotate(-10deg) translateY(25px)",
                fill: "black",
              }}
            >
              {dateString}
            </text>
          </g>
        );
      })}
    </>
  );
};
