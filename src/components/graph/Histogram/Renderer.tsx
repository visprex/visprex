import { useEffect, useMemo, useRef } from "react";
import { scaleBand, scaleLinear } from "d3-scale";
import { bin } from "d3-array";
import { select } from "d3-selection";
import { axisBottom, axisLeft } from "d3-axis";

import { Rectangle } from "./Rectangle";
import { DataType } from "@/schema";

const MARGIN = { top: 30, right: 35, bottom: 40, left: 35 };
const BUCKET_PADDING = 2;
const BUCKET_NUMBER = 40;

type RendererProps = {
  width: number;
  height: number;
  domain: [number, number];
  data: number[] | {[key: string]:number};
  dataType: DataType;
};

export const Renderer = ({ width, height, domain, data, dataType }: RendererProps) => {
  const histRef = useRef(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;
  
  const xLabelScale = useMemo(() => {
    if (dataType === DataType.Number) {
      return scaleBand()
    }
    return scaleBand()
      .range([0, boundsWidth])
      .domain(Object.keys(data))
      .padding(0.2);
  }, [data, boundsWidth, dataType]);

  const xScale = useMemo(() => {
    return scaleLinear().domain(domain).range([10, boundsWidth]);
  }, [domain, boundsWidth]);

  const buckets = useMemo(() => (
    [DataType.Categorical, DataType.DateTime].includes(dataType) ?
      Object.values(data).map((value: number, index: number) =>
        ({
            x0: index,
            x1: index+1,
            length: value
        } as d3.Bin<number, number>))
    :
        bin()
        .value((d) => d)
        .domain(domain)
        .thresholds(xScale.ticks(BUCKET_NUMBER))(data as number[])
  ),[xScale, domain, data, dataType]);

  const yScale = useMemo(() => {
    let max;
    [DataType.Categorical, DataType.DateTime].includes(dataType) ?
      max = Math.max(...Object.values(data)) :
      max = Math.max(...buckets.map((bucket) => bucket?.length))
    return scaleLinear().range([boundsHeight, 0]).domain([0, max]).nice();
  }, [dataType, data, buckets, boundsHeight]);

  useEffect(() => {
    const svg = select(histRef.current);
    svg.selectAll("*").remove();

    const xAxisGenerator = [DataType.Categorical, DataType.DateTime].includes(dataType) ?
      axisBottom(xLabelScale) : axisBottom(xScale);
    svg
      .append("g")
      .attr("transform", "translate(0," + boundsHeight + ")")
      .call(xAxisGenerator);
    if ([DataType.Categorical, DataType.DateTime].includes(dataType) && Object.keys(data).length > 10) {
      svg
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-20)")
        .attr("font-size", "9px")
    }
    const yAxisGenerator = axisLeft(yScale);
    svg
      .append("g")
      .call(yAxisGenerator);
  }, [xScale, yScale, xLabelScale, boundsHeight, dataType, data]);

  const rectangles = buckets.map((bucket, i) => {
    const { x0, x1 } = bucket;
    if (x0 === undefined || x1 === undefined) {
      return null;
    }
    return (
      <Rectangle
        key={i}
        x={xScale(x0) + BUCKET_PADDING / 2}
        width={Math.max(xScale(x1) - xScale(x0) - BUCKET_PADDING, 0)}
        y={yScale(bucket.length)}
        height={Math.max(boundsHeight - yScale(bucket.length))}
      />
    );
  });

  return (
    [DataType.Categorical, DataType.DateTime].includes(dataType) && Object.keys(data).length > 100 ?
      <svg width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        >
          <text
            x={boundsWidth / 2}
            y={boundsHeight / 2}
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize="16px"
            fill="gray"
          >
            Unable to display all the histogram bins. There are {Object.keys(data).length} unique values.
          </text>
        </g>
      </svg>
    :
      <svg width={width} height={height}>
        <g
          width={boundsWidth}
          height={boundsHeight}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        >
          {rectangles}
        </g>
        <g
          width={boundsWidth}
          height={boundsHeight}
          ref={histRef}
          transform={`translate(${[MARGIN.left, MARGIN.top].join(",")})`}
        />
      </svg>
  );
};
