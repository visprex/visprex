import { useEffect, useRef, useState } from 'react';
import { scaleLinear, select, axisBottom, axisLeft } from "d3";
import { Schema, NumberSchema, DataType, Value } from "@/schema";
import { Filter, filterMatrix } from "@/utils/filters";
import { transformOps, TransformType } from "@/utils/transform";
import { Tooltip, InteractionData } from './Tooltip';
import { AxisBottom } from './AxisBottom';
import { AxisLeft } from './AxisLeft';
import { TooManyRows, MAX_ROWS_TO_DISPLAY_FOR_SCATTERPLOT }  from '@/components/errors';
import { FilterSelector, FilterRemover } from '@/components/query/';

interface ScatterplotProps {
  width: number;
  height: number;
  matrix: Value[][];
  schema: Schema[],
  keys: string[]
}

const displayTransform = (transform: TransformType, axis: string) => {
  switch (transform) {
    case TransformType.None:
      return axis;
    case TransformType.Squared:
      return `${axis}²`;
    case TransformType.Ln:
      return `ln(${axis})`;
    case TransformType.LnPlus1:
      return `ln(${axis}+1)`;
    case TransformType.Log10:
      return `log10(${axis})`;
    case TransformType.Log10Plus1:
      return `log10(${axis}+1)`;
    default:
      return axis;
  }
}

export const Scatterplot = ({
  width,
  height,
  matrix,
  schema,
  keys,
} : ScatterplotProps) => {
  const scatterRef = useRef<SVGSVGElement>(null);
  const numberSchema = schema.filter((schemaItem) => schemaItem.type === DataType.Number) as NumberSchema[];
  
  const [filters, setFilters] = useState<Filter[]>([]);

  const [xAxisIdx, setXAxisIdx] = useState(numberSchema[0].index);
  const [yAxisIdx, setYAxisIdx] = useState(numberSchema[1].index);

  const [xTransform, setXTransform] = useState(TransformType.None);
  const [yTransform, setYTransform] = useState(TransformType.None);
  
  const [errorMessageX, setErrorMessageX] = useState("");
  const [errorMessageY, setErrorMessageY] = useState("");
  const [errorMessageFilter, setErrorMessageFilter] = useState("");


  const [hovered, setHovered] = useState<InteractionData | null>(null);

  const margin = { top: 30, right: 35, bottom: 30, left: 40 };
  const boundsWidth = width - margin.left - margin.right;
  const boundsHeight = height - margin.top - margin.bottom;

  const [filteredMatrix, setFilteredMatrix] = useState<Value[][]>(matrix);

  useEffect(() => {
    setFilteredMatrix(filterMatrix(matrix, filters, schema));
  }, [matrix, filters, schema]);

  function handleXTransform(key: string) {
    const schemaItem = schema[xAxisIdx];
    if (schemaItem.type === DataType.Categorical || schemaItem.type === DataType.DateTime) {
      return;
    }
    switch (key) {
      case TransformType.None:
        setXTransform(TransformType.None);
        setErrorMessageX("");
        break;
      case TransformType.Squared:
        setXTransform(TransformType.Squared);
        setErrorMessageX("");
        break;
      case TransformType.Ln:
        if (schemaItem.range.min <= 0) {
          setErrorMessageX("Error: All numbers must be positive for log transform.");
          setXTransform(TransformType.None);
          return;
        }
        setXTransform(TransformType.Ln);
        setErrorMessageX("");
        break;
      case TransformType.LnPlus1:
        if (schemaItem.range.min <= -1) {
          setErrorMessageX("Error: All numbers must be greater than -1 for ln(x+1) transform.");
          setXTransform(TransformType.None);
          return;
        }
        setXTransform(TransformType.LnPlus1);
        setErrorMessageX("");
        break;
      case TransformType.Log10:
        if (schemaItem.range.min <= 0) {
          setErrorMessageX("Error: All numbers must be positive for log transform.");
          setXTransform(TransformType.None);
          return;
        }
        setXTransform(TransformType.Log10);
        setErrorMessageX("");
        break;
      case TransformType.Log10Plus1:
        if (schemaItem.range.min <= -1) {
          setErrorMessageX("Error: All numbers must be greater than -1 for log10(x+1) transform.");
          setXTransform(TransformType.None);
          return;
        }
        setXTransform(TransformType.Log10Plus1);
        setErrorMessageX("");
        break
      default:
        break;
    }
  }

  function handleYTransform (key: string) {
    const schemaItem = schema[yAxisIdx];
    if (schemaItem.type === DataType.Categorical || schemaItem.type === DataType.DateTime) {
      return;
    }
    switch (key) {
      case TransformType.None:
        setYTransform(TransformType.None);
        setErrorMessageY("");
        break;
      case TransformType.Squared:
        setYTransform(TransformType.Squared);
        setErrorMessageY("");
        break;
      case TransformType.Ln:
        if (schemaItem.range.min <= 0) {
          setErrorMessageY("Error: All numbers must be positive for log transform.");
          setYTransform(TransformType.None);
          return;
        }
        setYTransform(TransformType.Ln);
        setErrorMessageY("");
        break;
      case TransformType.LnPlus1:
        if (schemaItem.range.min <= -1) {
          setErrorMessageY("Error: All numbers must be greater than -1 for ln(x+1) transform.");
          setYTransform(TransformType.None);
          return;
        }
        setYTransform(TransformType.LnPlus1);
        setErrorMessageY("");
        break
      case TransformType.Log10:
        if (schemaItem.range.min <= 0) {
          setErrorMessageY("Error: All numbers must be positive for log transform.");
          setYTransform(TransformType.None);
          return;
        }
        setYTransform(TransformType.Log10);
        setErrorMessageY("");
        break;
      case TransformType.Log10Plus1:
        if (schemaItem.range.min <= -1) {
          setErrorMessageY("Error: All numbers must be greater than -1 for log10(x+1) transform.");
          setYTransform(TransformType.None);
          return;
        }
        setYTransform(TransformType.Log10Plus1);
        setErrorMessageY("");
        break
      default:
        break;
    }
  }

  const handleAddFilter = (newFilter: Filter) => {
    setFilters((prevFilters) => {
      if (filterMatrix(matrix, [...prevFilters, newFilter], schema)[0].length === matrix[0].length) {
        setErrorMessageFilter(`error: filter (${newFilter.schemaKey} ${newFilter.operator} ${newFilter.value}) results in empty rows.`);
        return prevFilters;
      }
      setErrorMessageFilter("");
      return [...prevFilters, newFilter]
    });
  };

  const handleRemoveFilter = (index: number) => {
    setFilters((prevFilters) => prevFilters.filter((_, i) => i !== index));
  };

  const svg = select(scatterRef.current!);
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
  const xScale = scaleLinear()
    .domain(domain.x)
    .range([0, boundsWidth]);

  const yScale = scaleLinear()
    .domain(domain.y)
    .range([boundsHeight, 0]);

  const xAxis = axisBottom(xScale);
  const yAxis = axisLeft(yScale);

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

  const circles = data.map((d, i) => {
    const values = keys.map((key) =>filteredMatrix[keys.indexOf(key)][i]);
    return (
      <circle
        key={i}
        r={8}
        cx={xScale(d.x)}
        cy={yScale(d.y)}
        fill="#3F51B5"
        fillOpacity={0.6}
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
        circles.length > MAX_ROWS_TO_DISPLAY_FOR_SCATTERPLOT ? <TooManyRows rows={circles.length} /> :
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
                {circles}
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
              <Tooltip interactionData={hovered} boundsHeight={boundsHeight} />
            </div>
          </div>
          <div className='mb-2'>
            <span className='font-semibold text-gray-500 mb-2'>X-Axis</span>
            <span className='ml-5 font-serif font-thin italic'>f(x):</span>
            {
                [
                  TransformType.None,
                  TransformType.Squared,
                  TransformType.Log10,
                  TransformType.Log10Plus1,
                  TransformType.Ln,
                  TransformType.LnPlus1
                ].map((key) => (
                  <button
                    key={key}
                    disabled={[DataType.Categorical, DataType.DateTime].includes(schema[xAxisIdx].type)}
                    className={`
                      border ${xTransform === key ? 'bg-indigo-500 text-white' : 'border-indigo-500'}
                      m-1 rounded-md px-2 py-1 text-sm
                      ${xTransform === key ? 'bg-indigo-500' : 'text-indigo-500'}
                      ${xTransform === key ? 'opacity-100' : 'opacity-70'}`
                    }
                    onClick={() => handleXTransform(key)}
                  >
                    {displayTransform(key, "x")}
                  </button>
                )
              )
            }
            <span className="ml-2 text-red-400">{errorMessageX}</span>
          </div>
          <div key='x' className='flex overflow-x-auto'>
              {
                keys.map((key: string, idx: number ) =>
                  <button
                      key={key}
                      disabled={[DataType.Categorical, DataType.DateTime].includes(schema[idx].type)}
                      className={`
                        border ${idx === xAxisIdx ? 'bg-indigo-500 text-white' : 'border-indigo-500'}
                        m-1 rounded-md px-2 py-1 text-sm
                        ${idx === xAxisIdx ? 'bg-indigo-500' : 'text-indigo-500'}
                        ${idx === xAxisIdx ? 'opacity-100' : 'opacity-70'}
                        ${
                          [DataType.Categorical, DataType.DateTime].includes(schema[idx].type) ?
                          'cursor-not-allowed border-gray-400 bg-gray-200 opacity-50' : ''
                        }
                        h-8 whitespace-nowrap text-ellipsis`
                      }
                      onClick={() => {
                          setXAxisIdx(idx)
                          setXTransform(TransformType.None)
                        }
                    }
                  >
                    {key}
                  </button>
                )
              }
          </div>
          <div className="border-t my-2"></div>
          <div className='mb-2'>
            <span className='font-semibold text-gray-500 mb-2'>Y-Axis</span>
            <span className='ml-5 font-serif font-thin italic'>f(y):</span>
            {
                [
                  TransformType.None,
                  TransformType.Squared,
                  TransformType.Log10,
                  TransformType.Log10Plus1,
                  TransformType.Ln,
                  TransformType.LnPlus1
                ].map((key) => (
                  <button
                    key={key}
                    disabled={[DataType.Categorical, DataType.DateTime].includes(schema[yAxisIdx].type)}
                    className={`
                      border ${yTransform === key ? 'bg-indigo-500 text-white' : 'border-indigo-500'}
                      m-1 rounded-md px-2 py-1 text-sm
                      ${yTransform === key ? 'bg-indigo-500' : 'text-indigo-500'}
                      ${yTransform === key ? 'opacity-100' : 'opacity-70'}`
                    }
                    onClick={() => handleYTransform(key)}
                  >
                    {displayTransform(key, "y")}
                  </button>
                )
              )
            }
            <span className="ml-2 text-red-400">{errorMessageY}</span>
          </div>
          <div className="flex overflow-x-auto" key='y'>
            {
              keys.map((key: string, idx: number ) =>
                <button
                  key={key}
                  disabled={[DataType.Categorical, DataType.DateTime].includes(schema[idx].type)}
                  className={`
                    border ${idx === yAxisIdx ? 'bg-indigo-500 text-white' : 'border-indigo-500'}
                    m-1 rounded-md px-2 py-1 text-sm
                    ${idx === yAxisIdx ? 'bg-indigo-500' : 'text-indigo-500'}
                    ${idx === yAxisIdx ? 'opacity-100' : 'opacity-70'}
                    ${
                      [DataType.Categorical, DataType.DateTime].includes(schema[idx].type) ?
                      'cursor-not-allowed border-gray-400 bg-gray-200 opacity-50' : ''
                    }
                    h-8 whitespace-nowrap text-ellipsis`
                  }
                  onClick={() => {
                    setYAxisIdx(idx)
                    setYTransform(TransformType.None)
                  }}
                >
                  {key}
                </button>
              )
            }
          </div>
          <div className="border-t my-2"></div>
          <div>
            <div className='mb-2'><span className='font-semibold text-gray-500 mb-2'>Filters</span></div>
              <FilterSelector schema={schema} onFilterChange={handleAddFilter} />
              {errorMessageFilter.length > 0 && <div className="text-red-400"><span>{errorMessageFilter}</span></div>}
            <div className='mt-2 mb-2 flex overflow-x-auto'>
              <FilterRemover filters={filters} onRemoveFilter={handleRemoveFilter} />
            </div>
          </div>
        </>
      }
    </div>
  );
};
