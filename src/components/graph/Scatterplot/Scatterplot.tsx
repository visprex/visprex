import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Schema, NumberSchema, DataType, Value } from "../../../utils/schema";
import { Filter, filterMatrix } from "../../../utils/filters";
import { transformOps } from "../../../utils/transform";
import { Tooltip, InteractionData } from './Tooltip';
import { AxisBottom } from './AxisBottom';
import { AxisLeft } from './AxisLeft';
import TooManyRows, { MAX_ROWS_TO_DISPLY } from '../../navigation/TooManyRows';
import FilterRemover from '../Filters/FilterRemover';
import FilterSelector from '../Filters/FilterSelector';

enum ScatterTransformType {
  None = "none",
  Log10 = "log10(x)",
  Ln = "ln(x)"
}

interface ScatterplotProps {
    width: number;
    height: number;
    matrix: Value[][];
    schema: Schema[],
    keys: string[]
}

export const Scatterplot = ({ width, height, matrix, schema, keys } : ScatterplotProps) => {
  const scatterRef = useRef<SVGSVGElement>(null);
  const numberSchema = schema.filter((schemaItem) => schemaItem.type === DataType.Number) as NumberSchema[];

  const [filters, setFilters] = useState<Filter[]>([]);

  const [xAxisIdx, setXAxisIdx] = useState(numberSchema[0].index);
  const [yAxisIdx, setYAxisIdx] = useState(numberSchema[1].index);

  const [xTransform, setXTransform] = useState(ScatterTransformType.None);
  const [yTransform, setYTransform] = useState(ScatterTransformType.None);
  
  const [errorMessageX, setErrorMessageX] = useState("");
  const [errorMessageY, setErrorMessageY] = useState("");

  const [hovered, setHovered] = useState<InteractionData | null>(null);

  const margin = { top: 30, right: 80, bottom: 30, left: 30 };
  const boundsWidth = width - margin.left - margin.right;
  const boundsHeight = height - margin.top - margin.bottom;

  const [filteredMatrix, setFilteredMatrix] = useState<Value[][]>(matrix);

  useEffect(() => {
    setFilteredMatrix(filterMatrix(matrix, filters, schema));
  }, [matrix, filters, schema]);
  
  function handleTransformX(key: string) {
    const schemaItem = schema[xAxisIdx];
    if (schemaItem.type === DataType.Categorical) {
      return;
    }
    switch (key) {
      case ScatterTransformType.None:
        setXTransform(ScatterTransformType.None);
        setErrorMessageX("");
        break;
      case ScatterTransformType.Ln:
        if (schemaItem.range.min <= 0) {
          setErrorMessageX("Error: All numbers must be positive for ln(x) transform.");
          setXTransform(ScatterTransformType.None);
          return;
        }
        setXTransform(ScatterTransformType.Ln);
        setErrorMessageX("");
        break;
      case ScatterTransformType.Log10:
        if (schemaItem.range.min <= 0) {
          setErrorMessageX("Error: All numbers must be positive for log10(x) transform.");
          setXTransform(ScatterTransformType.None);
          return;
        }
        setXTransform(ScatterTransformType.Log10);
        setErrorMessageX("");
        break;
      default:
        break;
    }
  }

  function handleTransformY (key: string) {
    const schemaItem = schema[yAxisIdx];
    if (schemaItem.type === DataType.Categorical) {
      return;
    }
    switch (key) {
      case ScatterTransformType.None:
        setYTransform(ScatterTransformType.None);
        setErrorMessageY("");
        break;
      case ScatterTransformType.Ln:
        if (schemaItem.range.min <= 0) {
          setErrorMessageY("Error: All numbers must be positive for ln(x) transform.");
          setYTransform(ScatterTransformType.None);
          return;
        }
        setYTransform(ScatterTransformType.Ln);
        setErrorMessageY("");
        break;
      case ScatterTransformType.Log10:
        if (schemaItem.range.min <= 0) {
          setErrorMessageY("Error: All numbers must be positive for log10(x) transform.");
          setYTransform(ScatterTransformType.None);
          return;
        }
        setYTransform(ScatterTransformType.Log10);
        setErrorMessageY("");
        break;
      default:
        break;
    }
  }

  const handleAddFilter = (newFilter: Filter) => {
    setFilters((prevFilters) => [...prevFilters, newFilter]);
  };

  const handleRemoveFilter = (index: number) => {
    setFilters((prevFilters) => prevFilters.filter((_, i) => i !== index));
  };

  const svg = d3.select(scatterRef.current!);
  const domain = {
    x: [
      transformOps[xTransform]((schema[xAxisIdx] as NumberSchema).range.min),
      transformOps[xTransform]((schema[xAxisIdx] as NumberSchema).range.max)
    ],
    y: [
      transformOps[yTransform]((schema[yAxisIdx] as NumberSchema).range.min),
      transformOps[yTransform]((schema[yAxisIdx] as NumberSchema).range.max)
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
  
  if (filterMatrix(matrix, filters, schema).length === 0) {
    return (
      <>
        <div>No data to display. Consider removing filters.</div>
        {<FilterRemover filters={filters} onRemoveFilter={handleRemoveFilter} />}
      </>
    );
  }

  const data = filteredMatrix[xAxisIdx].map((xValue, index) => ({
      name: index,
      x: transformOps[xTransform](xValue as number),
      y: transformOps[yTransform](filteredMatrix[yAxisIdx][index] as number)
    })
  );
  const allShapes = data.map((d, i) => {
    const values = keys.map((key) =>filteredMatrix[keys.indexOf(key)][i]);
    return (
      <circle
        key={i}
        r={8}
        cx={xScale(d.x)}
        cy={yScale(d.y)}
        stroke="#3F51B5"
        fill="#3F51B5"
        fillOpacity={0.7}
        onMouseEnter={() =>
          setHovered({
            xPos: xScale(d.x),
            yPos: yScale(d.y),
            keys,
            values,
          })
        }
        onMouseLeave={() => setHovered(null)}
      />
    );
  });

  return (
    <div id='scatterplot' className='mx-auto'>
      {
        allShapes.length > MAX_ROWS_TO_DISPLY ? <TooManyRows rows={allShapes.length} /> :
        <>
          <div className="relative my-5">
              <svg width={width} height={height}>
                <g
                  width={boundsWidth}
                  height={boundsHeight}
                  transform={`translate(${[margin.left, margin.top].join(",")})`}
                >
                  <AxisLeft yScale={yScale} pixelsPerTick={40} width={boundsWidth} />
                  <g transform={`translate(0, ${boundsHeight})`}>
                    <AxisBottom
                      xScale={xScale}
                      pixelsPerTick={40}
                      height={boundsHeight}
                    />
                  </g>
                  {allShapes}
                </g>
              </svg>
              <div
                style={{
                  width: boundsWidth,
                  height: boundsHeight,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  pointerEvents: "none",
                  marginLeft: margin.left,
                  marginTop: margin.top,
                }}
              >
                <Tooltip interactionData={hovered} />
              </div>
          </div>
          <div key='x'>
              <span>X Axis:</span>
              {
                  keys.map((key: string, idx: number ) =>
                      <button
                          key={key}
                          disabled={schema[idx].type === DataType.Categorical}
                          className={`
                            border ${idx === xAxisIdx ? 'bg-indigo-500 text-white' : 'border-indigo-500'}
                            m-1 rounded-md px-2 py-1 text-sm
                            ${idx === xAxisIdx ? 'bg-indigo-500' : 'text-indigo-500'}
                            ${idx === xAxisIdx ? 'opacity-100' : 'opacity-70'}
                            ${schema[idx].type === DataType.Categorical ? 'cursor-not-allowed border-gray-400 bg-gray-200 opacity-50' : ''}`
                          }
                          onClick={() => {
                              setXAxisIdx(idx)
                              setXTransform(ScatterTransformType.None)
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
                [ScatterTransformType.None, ScatterTransformType.Log10, ScatterTransformType.Ln].map((key) => (
                  <button
                    key={key}
                    className={`
                      border ${xTransform === key ? 'bg-indigo-500 text-white' : 'border-indigo-500'}
                      m-1 rounded-md px-2 py-1 text-sm
                      ${xTransform === key ? 'bg-indigo-500' : 'text-indigo-500'}
                      ${xTransform === key ? 'opacity-100' : 'opacity-70'}`
                    }
                    disabled={schema[xAxisIdx].type === 'categorical'}
                    onClick={() => handleTransformX(key)}
                  >
                    {key}
                  </button>
                )
              )
            }
            <span className="ml-2 text-red-400">{errorMessageX}</span>
          </div>
          <div className="mt-4" key='y'>
              <span>Y Axis: </span>
              {
                  keys.map((key: string, idx: number ) =>
                      <button
                          key={key}
                          className={`
                            border ${idx === yAxisIdx ? 'bg-indigo-500 text-white' : 'border-indigo-500'}
                            m-1 rounded-md px-2 py-1 text-sm
                            ${idx === yAxisIdx ? 'bg-indigo-500' : 'text-indigo-500'}
                            ${idx === yAxisIdx ? 'opacity-100' : 'opacity-70'}
                            ${schema[idx].type === DataType.Categorical ? 'cursor-not-allowed border-gray-400 bg-gray-200 opacity-50' : ''}`
                          }
                          disabled={schema[xAxisIdx].type === 'categorical'}
                          onClick={() => {
                            setYAxisIdx(idx)
                            setYTransform(ScatterTransformType.None)
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
                [ScatterTransformType.None, ScatterTransformType.Log10, ScatterTransformType.Ln].map((key) => (
                  <button
                    key={key}
                    className={`
                      border ${yTransform === key ? 'bg-indigo-500 text-white' : 'border-indigo-500'}
                      m-1 rounded-md px-2 py-1 text-sm
                      ${yTransform === key ? 'bg-indigo-500' : 'text-indigo-500'}
                      ${yTransform === key ? 'opacity-100' : 'opacity-70'}`
                    }
                    onClick={() => handleTransformY(key)}
                  >
                    {key}
                  </button>
                )
              )
            }
            <span className="ml-2 text-red-400">{errorMessageY}</span>
          </div>
          <div>
            Add a filter:
            <FilterSelector schema={schema} onFilterChange={handleAddFilter} />
            Current filters:
            <FilterRemover filters={filters} onRemoveFilter={handleRemoveFilter} />
          </div>
        </>
      }
    </div>
  );
};
