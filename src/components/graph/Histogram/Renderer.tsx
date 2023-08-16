import { useEffect, useMemo, useRef } from "react";
import * as d3 from "d3";
import { Rectangle } from "./Rectangle";

const MARGIN = { top: 30, right: 30, bottom: 40, left: 50 };

const BUCKET_NUMBER = 40;
const BUCKET_PADDING = 2;

type RendererProps = {
  width: number;
  height: number;
  domain: [number, number]
  data: number[];
};

export const Renderer = ({ width, height, domain, data }: RendererProps) => {
  const histRef = useRef(null);
  const boundsWidth = width - MARGIN.right - MARGIN.left;
  const boundsHeight = height - MARGIN.top - MARGIN.bottom;

  const xScale = useMemo(() => {
    return d3.scaleLinear().domain(domain).range([10, boundsWidth]);
  }, [width, domain]);

  const buckets = useMemo(() => {
    const bucketGenerator = d3
      .bin()
      .value((d) => d)
      .domain(domain)
      .thresholds(xScale.ticks(BUCKET_NUMBER));
    return bucketGenerator(data);
  }, [xScale, domain, data]);

  const yScale = useMemo(() => {
    const max = Math.max(...buckets.map((bucket) => bucket?.length));
    return d3.scaleLinear().range([boundsHeight, 0]).domain([0, max]).nice();
  }, [data, height, boundsHeight, boundsWidth]);

  useEffect(() => {
    const svgElement = d3.select(histRef.current);
    svgElement.selectAll("*").remove();

    const xAxisGenerator = d3.axisBottom(xScale);
    svgElement
      .append("g")
      .attr("transform", "translate(0," + boundsHeight + ")")
      .call(xAxisGenerator);

    const yAxisGenerator = d3.axisLeft(yScale);
    svgElement.append("g").call(yAxisGenerator);
  }, [xScale, yScale, boundsHeight]);

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
