import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { NumberSchema } from "../../utils/schema";
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

export const Scatterplot = ({ width, height, matrix, schema, keys } : ScatterplotProps) => {
  const scatterRef = useRef<SVGSVGElement>(null);
  const [xAxisIdx, setXAxisIdx] = useState(0);
  const [yAxisIdx, setYAxisIdx] = useState(1);
  const [xLogTransform, setXLogTransform] = useState(false);
  const [yLogTransform, setYLogTransform] = useState(false);

  useEffect(() => {  
    const svg = d3.select(scatterRef.current!);
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const boundsWidth = width - margin.left - margin.right;
    const boundsHeight = height - margin.top - margin.bottom;

    const domain = {
      x: [
        xLogTransform ? Math.log(schema[xAxisIdx].range.min+1) : schema[xAxisIdx].range.min,
        xLogTransform ? Math.log(schema[xAxisIdx].range.max+1) : schema[xAxisIdx].range.max
      ],
      y: [
        yLogTransform ? Math.log(schema[yAxisIdx].range.min+1) : schema[yAxisIdx].range.min,
        yLogTransform ? Math.log(schema[yAxisIdx].range.max+1) : schema[yAxisIdx].range.max
      ]
    };
    const xScale = d3.scaleLinear()
      .domain(domain.x)
      .range([0, boundsWidth]);

    const yScale = d3.scaleLinear()
      .domain(domain.y)
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
        x: xLogTransform ? Math.log(xValue+1) : xValue,
        y: yLogTransform ? Math.log(matrix[yAxisIdx][index]+1) : matrix[yAxisIdx][index]
      })
    );

    plot.selectAll('.dot')
      .data(data)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('fill', "#3F51B5")
      .attr('stroke', "#3F51B5")
      .attr('fill-opacity', 0.4)
      .attr('r', 5)
      .attr('cx', d => xScale(d.x))
      .attr('cy', d => yScale(d.y));
  }, [xAxisIdx, yAxisIdx, xLogTransform, yLogTransform]);

  return (
    <div>
        <div key='x' style={{ height: 50 }}>
            <span>X:</span>
            {
                keys.map((key: string, idx: number ) =>
                    <button
                        key={key}
                        className={`
                          border ${idx === xAxisIdx ? 'bg-indigo-500 text-white' : 'border-indigo-500'}
                          m-1 rounded-md px-2 py-1 text-sm
                          ${idx === xAxisIdx ? 'bg-indigo-500' : 'text-indigo-500'}
                          ${idx === xAxisIdx ? 'opacity-100' : 'opacity-70'}`
                        }
                        onClick={() => {
                            setXAxisIdx(idx)
                            setXLogTransform(false)
                          }
                      }
                    >
                        {key}
                    </button>
                )
            }
        </div>
        <div className="mb-4 flex items-center">
          <input
            id='x-log-checkbox'
            type="checkbox"
            value=""
            className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 ring-offset-gray-800 focus:ring-2 focus:ring-blue-500"
            onChange={() => setXLogTransform(!xLogTransform)}
          />
          <label htmlFor="x-log-checkbox" className="ml-2 text-sm text-gray-500">Transform: log(x+1)</label>
        </div>
        <div>
            <span>Y: </span>
            {
                keys.map((key: string, idx: number ) =>
                    <button
                        key={key}
                        className={`
                          border ${idx === yAxisIdx ? 'bg-indigo-500 text-white' : 'border-indigo-500'}
                          m-1 rounded-md px-2 py-1 text-sm
                          ${idx === yAxisIdx ? 'bg-indigo-500' : 'text-indigo-500'}
                          ${idx === yAxisIdx ? 'opacity-100' : 'opacity-70'}`
                        }
                        onClick={() => {
                          setYAxisIdx(idx)
                          setYLogTransform(false)
                        }
                      }
                    >
                        {key}
                    </button>
                )
            }
        </div>
        <div className="mb-4 flex items-center">
          <input
            id="y-log-checkbox"
            type="checkbox"
            value=""
            className="h-4 w-4 rounded border-gray-600 bg-gray-700 text-blue-600 ring-offset-gray-800 focus:ring-2 focus:ring-blue-500"
            onChange={() => setYLogTransform(!yLogTransform)}
          />
          <label htmlFor="y-log-checkbox" className="ml-2 text-sm text-gray-500">Transform: log(x+1)</label>
        </div>
        <svg ref={scatterRef} width={width} height={height}></svg>       
    </div>
  );
};

