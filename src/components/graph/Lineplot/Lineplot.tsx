import { useRef, useState, useEffect } from 'react';
import * as d3 from 'd3';
import { Schema, NumberSchema, DateTimeSchema, DataType, Value } from "../../../types/schema";
import { Tooltip, InteractionData } from './Tooltip';
import { DateTimeRangeSelector } from '../../query';

interface LineplotProps {
  width: number;
  height: number;
  matrix: Value[][];
  schema: Schema[];
  keys: string[];
}

export const Lineplot = ({ width, height, matrix, schema, keys }: LineplotProps) => {
  const lineRef = useRef<SVGSVGElement>(null);
  const dateTimeSchema = schema.filter((schemaItem) => schemaItem.type === DataType.DateTime) as DateTimeSchema[];
  const numberSchema = schema.filter((schemaItem) => schemaItem.type === DataType.Number) as NumberSchema[];

  const [hovered, setHovered] = useState<InteractionData | null>(null);
  const [xAxisIdx, setXAxisIdx] = useState(dateTimeSchema[0].index);
  const [yAxisIdx, setYAxisIdx] = useState(numberSchema[0].index);

  const margin = { top: 30, right: 35, bottom: 30, left: 40 };
  const boundsWidth = width - margin.left - margin.right;
  const boundsHeight = height - margin.top - margin.bottom;

  const initialDomain = {
    x: [
      new Date((schema[xAxisIdx] as DateTimeSchema).range.minUnix),
      new Date((schema[xAxisIdx] as DateTimeSchema).range.maxUnix),
    ],
    y: [
      (schema[yAxisIdx] as NumberSchema).range.min,
      (schema[yAxisIdx] as NumberSchema).range.max,
    ],
  }
  
  const yScale = d3.scaleLinear()
    .domain(initialDomain.y)
    .range([boundsHeight, 0]);

  const [xDomain, setXDomain] = useState<Date[]>(initialDomain.x);

  useEffect(() => {    
    if (lineRef.current) {
      const xScale = d3.scaleTime()
        .domain(xDomain)
        .range([0, boundsWidth]);

      const svg = d3.select(lineRef.current);
      svg.selectAll('*').remove();
  
      const plot = svg.append('g')
        .attr('transform', `translate(${margin.left},${margin.top})`);
  
      const xAxis = d3.axisBottom(xScale);
      const yAxis = d3.axisLeft(yScale);
  
      plot.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0, ${boundsHeight})`)
        .call(xAxis);
  
      plot.append('g')
        .attr('class', 'y-axis')
        .call(yAxis);
  
      const lineGenerator = d3.line<{ x: Date; y: number }>()
        .x(d => xScale(d.x))
        .y(d => yScale(d.y))
        .curve(d3.curveMonotoneX);
  
      const data = matrix[xAxisIdx].map((xValue, index) => (
        {
          x: new Date(xValue as string),
          y: matrix[yAxisIdx][index] as number,
        }
      )).filter((d) => 
        !isNaN(d.x.getTime()) &&
        d.x.getTime() >= xScale.domain()[0].getTime() &&
        d.x.getTime() <= xScale.domain()[1].getTime() &&
        typeof d.y === 'number'
      );

      plot.append('path')
        .datum(data)
        .attr('fill', 'none')
        .attr('stroke', '#3F51B5')
        .attr('stroke-width', 2)
        .attr('d', lineGenerator);
  
      const bisect = d3.bisector((d: { x: Date }) => d.x).left;
  
      const interactionLayer = plot.append('rect')
        .attr('width', boundsWidth)
        .attr('height', boundsHeight)
        .attr('fill', 'none')
        .attr('pointer-events', 'all');
  
      const verticalLine = plot.append('line')
        .attr('stroke', 'grey')
        .attr('stroke-dasharray', '4')
        .attr('stroke-width', 2)
        .attr('y1', 0)
        .attr('y2', boundsHeight)
        .style('display', 'none');
  
      interactionLayer
        .on('mousemove', (event: MouseEvent) => {
          const [mouseX] = d3.pointer(event, interactionLayer.node()!);
          const x0 = xScale.invert(mouseX);
          const index = bisect(data, x0, 1);
          const d0 = data[index - 1];
          const d1 = data[index];
          const closestPoint = (
            d0 && d1 ?
              (x0.getTime() - d0.x.getTime() <= d1.x.getTime() - x0.getTime()
                ? d0 : d1
              ) : d0 || d1
          );

          if (closestPoint) {
            setHovered({
              xValue: closestPoint.x,
              xPos: xScale(closestPoint.x) + margin.left,
              yValue: closestPoint.y,
              yPos: yScale(closestPoint.y) + margin.top,
            });
            verticalLine
              .style('display', null)
              .attr('x1', xScale(closestPoint.x))
              .attr('x2', xScale(closestPoint.x));
          }
        })
        .on('mouseout', () => {
          setHovered(null);
        });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [xAxisIdx, yAxisIdx, xDomain]);
    
  return (
    <div id='Lineplot' className='mx-auto'>
      <div className="relative my-5">
        <svg ref={lineRef} width={width} height={height} />
        {hovered && (
          <Tooltip
            interactionData={hovered}
          />
        )}
        <div className='mb-2'>
          <span className='text-gray-500 text-sm font-semibold'>Time Range Filter</span>
            <DateTimeRangeSelector
              domain={
                {
                  min: initialDomain.x[0].getTime(),
                  max: initialDomain.x[1].getTime(),
                }
              }
              onChange={setXDomain}
            />
          <hr className='border-t my-2' />
          <div className='text-gray-500 mb-2 text-sm'>
            <span className='font-semibold'>X-Axis</span><span> (DateTime)</span>
          </div>
          <div key='x' className='flex overflow-x-auto'>
            {keys.map((key: string, idx: number) =>
              <button
                key={key}
                className={`
                  border ${idx === xAxisIdx ? 'bg-indigo-500 text-white' : 'border-indigo-500'}
                  m-1 rounded-md px-2 py-1 text-sm h-8 whitespace-nowrap text-ellipsis
                  ${idx === xAxisIdx ? 'opacity-100' : 'opacity-70'}`
                }
                hidden={[DataType.Categorical, DataType.Number].includes(schema[idx].type)}
                onClick={() => setXAxisIdx(idx)}
              >
                {key}
              </button>
            )}
          </div>
        </div>
        <div className="border-t my-2"></div>
        <div className='mb-2'>
          <div className='text-gray-500 mb-2 text-sm'>
            <span className='font-semibold'>Y-Axis</span><span> (Numerical)</span>
          </div>
          <div key='y' className="flex overflow-x-auto">
            {keys.map((key: string, idx: number) =>
              <button
                key={key}
                className={`
                  border ${idx === yAxisIdx ? 'bg-indigo-500 text-white' : 'border-indigo-500'}
                  m-1 rounded-md px-2 py-1 text-sm
                  ${idx === yAxisIdx ? 'opacity-100' : 'opacity-70'}
                  ${[DataType.Categorical, DataType.DateTime].includes(schema[idx].type) ? 'cursor-not-allowed border-gray-400 bg-gray-200 opacity-50' : ''}
                  h-8 whitespace-nowrap text-ellipsis`}
                disabled={[DataType.Categorical, DataType.DateTime].includes(schema[idx].type)}
                onClick={() => setYAxisIdx(idx)}
              >
                {key}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
