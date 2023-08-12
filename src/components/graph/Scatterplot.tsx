import React, { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { NumberSchema } from "../../utils";
// import { InteractionData, Tooltip } from './Tooltip';


interface DataPoint {
  x: number;
  y: number;
}

interface ScatterplotProps {
    width: number;
    height: number;
    matrix: any[][];
    schema: NumberSchema[],
    keys: string[]
}

const buttonStyle = {
  border: "1px solid #9a6fb0",
  borderRadius: "3px",
  padding: "0px 8px",
  margin: "10px 2px",
  fontSize: 14,
  color: "#9a6fb0",
  opacity: 0.7,
};

const Scatterplot: React.FC<ScatterplotProps> = ({ width, height, matrix, schema, keys }) => {
  const scatterRef = useRef<SVGSVGElement>(null);
  const [xAxisIdx, setXAxisIdx] = useState(0);
  const [yAxisIdx, setYAxisIdx] = useState(1);
  // const [hovered, setHovered] = useState<InteractionData | null>(null);

  useEffect(() => {  
    const svg = d3.select(scatterRef.current!);
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const boundsWidth = width - margin.left - margin.right;
    const boundsHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleLinear()
      .domain([schema[xAxisIdx].range.min, schema[xAxisIdx].range.max])
      .range([0, boundsWidth]);

    const yScale = d3.scaleLinear()
      .domain([schema[yAxisIdx].range.min, schema[yAxisIdx].range.max])
      .range([boundsHeight, 0]);

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    svg.selectAll('*').remove();

    const plot = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    plot.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0, ${boundsHeight})`)
      .call(xAxis);

    plot.append('g')
      .attr('class', 'y-axis')
      .call(yAxis);

    const data = matrix[xAxisIdx].map((xValue, index) => ({
        name: index,
        x: xValue,
        y: matrix[yAxisIdx][index]
      })
    );

    // const allShapes = data.map((d, i) => {
    //   return (
    //     <circle
    //       key={i}
    //       r={8}
    //       cx={xScale(d.x)}
    //       cy={yScale(d.y)}
    //       stroke="#e85252"
    //       fill="#e85252"
    //       fillOpacity={0.7}
    //       onMouseEnter={() =>
    //         setHovered({
    //           xPos: xScale(d.x),
    //           yPos: yScale(d.y),
    //           name: String(d.name),
    //         })
    //       }
    //       onMouseLeave={() => setHovered(null)}
    //     />
    //   );
    // })
    plot.selectAll('.dot')
      .data(data)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('fill', "#85252")
      .attr('stroke', "#85252")
      .attr('fillOpacity', 0.7)
      .attr('r', 5)
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y));
  }, [xAxisIdx, yAxisIdx]);

  return (
    <>
        <div key='x' style={{ height: 50 }}>
            <span>X:</span>
            {
                keys.map((key: string, idx: number ) =>
                    <button
                        key={key}
                        style={buttonStyle}
                        onClick={() => {
                            setXAxisIdx(idx)
                          }
                      }
                    >
                        {key}
                    </button>
                )
            }
        </div>
        <div>
            <span>Y: </span>
            {
                keys.map((key: string, idx: number ) =>
                    <button
                        key={key}
                        style={buttonStyle}
                        onClick={() => {
                          setYAxisIdx(idx)
                        }
                      }
                    >
                        {key}
                    </button>
                )
            }
        </div>
        <svg ref={scatterRef} width={width} height={height}></svg>       
    </>
  );
}

export default Scatterplot;
