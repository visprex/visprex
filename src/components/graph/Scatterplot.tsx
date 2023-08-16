import { useRef, useEffect, useState } from 'react';
import * as d3 from 'd3';
import { NumberSchema } from "../../utils/schema";
import { transformOps } from "../../utils/transform";

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

  const [xTransform, setXTransform] = useState("none");
  const [yTransform, setYTransform] = useState("none");
  
  const [errorMessageX, setErrorMessageX] = useState("");
  const [errorMessageY, setErrorMessageY] = useState("");

  useEffect(() => {  
    const svg = d3.select(scatterRef.current!);
    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const boundsWidth = width - margin.left - margin.right;
    const boundsHeight = height - margin.top - margin.bottom;
    
    const domain = {
      x: [
        transformOps[xTransform](schema[xAxisIdx].range.min),
        transformOps[xTransform](schema[xAxisIdx].range.max)
      ],
      y: [
        transformOps[yTransform](schema[yAxisIdx].range.min),
        transformOps[yTransform](schema[yAxisIdx].range.max)
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
        x: transformOps[xTransform](xValue),
        y: transformOps[yTransform](matrix[yAxisIdx][index])
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
  }, [xAxisIdx, yAxisIdx, xTransform, yTransform]);

  return (
    <div id='scatterplot' className='mx-auto'>
        <svg ref={scatterRef} width={width} height={height}></svg>
        <div key='x'>
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
                            setXTransform("none")
                          }
                      }
                    >
                        {key}
                    </button>
                )
            }
        </div>
        <div>
          <span>Transform:</span>
          {
              ['none', 'log10(x)', 'ln(x)'].map((key) => (
                <button
                  key={key}
                  className={`
                    border ${xTransform === key ? 'bg-indigo-500 text-white' : 'border-indigo-500'}
                    m-1 rounded-md px-2 py-1 text-sm
                    ${xTransform === key ? 'bg-indigo-500' : 'text-indigo-500'}
                    ${xTransform === key ? 'opacity-100' : 'opacity-70'}`
                  }
                  onClick={() => {
                    const schemaItem = schema[xAxisIdx];
                    switch (key) {
                      case "none":
                        setXTransform("none");
                        setErrorMessageX("");
                        break;
                      case "ln(x)":
                        if (schemaItem.range.min <= 0) {
                          setErrorMessageX("Error: All numbers must be positive for ln(x) transform.");
                          setXTransform('none');
                          return;
                        }
                        setXTransform("ln(x)");
                        setErrorMessageX("");
                        break;
                      case "log10(x)":
                        if (schemaItem.range.min <= 0) {
                          setErrorMessageX("Error: All numbers must be positive for log10(x) transform.");
                          setXTransform('none');
                          return;
                        }
                        setXTransform("log10(x)");
                        setErrorMessageX("");
                        break;
                      default:
                        break;
                    }
                  }}
                >
                  {key}
                </button>
              )
            )
          }
          <span className="ml-2 text-red-400">{errorMessageX}</span>
        </div>
        <div key='y'>
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
                          setYTransform('none')
                        }
                      }
                    >
                        {key}
                    </button>
                )
            }
        </div>
        <div>
          <span>Transform:</span>
          {
              ['none', 'log10(x)', 'ln(x)'].map((key) => (
                <button
                  key={key}
                  className={`
                    border ${yTransform === key ? 'bg-indigo-500 text-white' : 'border-indigo-500'}
                    m-1 rounded-md px-2 py-1 text-sm
                    ${yTransform === key ? 'bg-indigo-500' : 'text-indigo-500'}
                    ${yTransform === key ? 'opacity-100' : 'opacity-70'}`
                  }
                  onClick={() => {
                    const schemaItem = schema[yAxisIdx];
                    switch (key) {
                      case "none":
                        setYTransform("none");
                        setErrorMessageY("");
                        break;
                      case "ln(x)":
                        if (schemaItem.range.min <= 0) {
                          setErrorMessageY("Error: All numbers must be positive for ln(x) transform.");
                          setYTransform('none');
                          return;
                        }
                        setYTransform("ln(x)");
                        setErrorMessageY("");
                        break;
                      case "log10(x)":
                        if (schemaItem.range.min <= 0) {
                          setErrorMessageY("Error: All numbers must be positive for log10(x) transform.");
                          setYTransform('none');
                          return;
                        }
                        setYTransform("log10(x)");
                        setErrorMessageY("");
                        break;
                      default:
                        break;
                    }
                  }}
                >
                  {key}
                </button>
              )
            )
          }
          <span className="ml-2 text-red-400">{errorMessageY}</span>
        </div>
    </div>
  );
};

