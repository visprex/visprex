import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import { Rectangle } from "./Rectangle";
import { DataType } from "../../../types/schema";

const MARGIN = { top: 30, right: 30, bottom: 40, left: 50 };
const BUCKET_PADDING = 2;
const BUCKET_NUMBER = 40;

type RendererProps = {
  width: number;
  height: number;
  domain: [number, number];
  data: number[] | {[key: string]:number};
  datatype: DataType;
};

export const Renderer = ({ width, height, domain, data, datatype }: RendererProps) => {
  const histRef = useRef(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;
  
  const xLabelScale = useMemo(() => {
    if (datatype === DataType.Number) {
      return d3.scaleBand()
    }
    return d3
      .scaleBand()
      .range([0, boundsWidth])
      .domain(Object.keys(data))
      .padding(0.2);
  }, [data, boundsWidth, datatype]);

  const xScale = useMemo(() => {
    return d3.scaleLinear().domain(domain).range([10, boundsWidth]);
  }, [domain, boundsWidth]);

  const buckets = useMemo(() => {
    if (datatype === DataType.Categorical) {
        return Object.values(data).map((value: number, index: number) =>
        ({
            x0: index,
            x1: index+1,
            length: value
        } as d3.Bin<number, number>))
    } else {
        const bucketGenerator = d3
            .bin()
            .value((d) => d)
            .domain(domain)
            .thresholds(xScale.ticks(BUCKET_NUMBER));
        return bucketGenerator(data as number[]);
    }
  }, [xScale, domain, data, datatype]);

  const yScale = useMemo(() => {
    let max;
    datatype === DataType.Categorical ?
        max = Math.max(...Object.values(data)) :
        max = Math.max(...buckets.map((bucket) => bucket?.length))
    return d3.scaleLinear().range([boundsHeight, 0]).domain([0, max]).nice();
  }, [datatype, data, buckets, boundsHeight]);

  useEffect(() => {
    const svgElement = d3.select(histRef.current);
    svgElement.selectAll("*").remove();

    const xAxisGenerator = datatype === DataType.Categorical ? d3.axisBottom(xLabelScale) : d3.axisBottom(xScale);
    svgElement
      .append("g")
      .attr("transform", "translate(0," + boundsHeight + ")")
      .call(xAxisGenerator);
    if (datatype === DataType.Categorical && Object.keys(data).length > 10) {
        svgElement
            .selectAll("text")  
            .style("text-anchor", "end")
            .attr("dx", "-.8em")
            .attr("dy", ".15em")
            .attr("transform", "rotate(-20)")
            .attr("font-size", "9px")
    }
    const yAxisGenerator = d3.axisLeft(yScale);
    svgElement
        .append("g")
        .call(yAxisGenerator);
  }, [xScale, yScale, xLabelScale, boundsHeight, datatype, data]);

  const allRects = buckets.map((bucket, i) => {
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
    datatype === DataType.Categorical && Object.keys(data).length > 100 ?
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
          {allRects}
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
