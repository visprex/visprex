import { useState } from "react";
import { Histogram } from "./Histogram";
import { NumberSchema } from "../../utils/schema";
import { logPlusOneTransform, center } from "../../utils/transform";

const BUTTONS_HEIGHT = 50;

type HistogramTransitionProps = {
  width: number;
  height: number;
  matrix: any[][];
  schema: NumberSchema[],
  keys: string[]
};

export const HistogramTransition = ({
  width,
  height,
  matrix,
  schema,
  keys
}: HistogramTransitionProps) => {
  const firstSchemaItem = schema[0];
  const [selectedData, setSelectedData] = useState(matrix[0]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentMin, setCurrentMin] = useState(firstSchemaItem.range.min);
  const [currentMax, setCurrentMax] = useState(firstSchemaItem.range.max);
  const [currentTransform, setCurrentTransform] = useState('none');

  return (
    <div>
      <div>
          <span>Select column: </span>
          {
            keys.map((key, idx) => (
              <button
                key={key}
                className={`
                  border ${currentIdx === idx ? 'bg-indigo-500 text-white' : 'border-indigo-500'}
                  m-1 rounded-md px-2 py-1 text-sm
                  ${currentIdx === idx ? 'bg-indigo-500' : 'text-indigo-500'}
                  ${currentIdx === idx ? 'opacity-100' : 'opacity-70'}`
                }
                onClick={() => {
                  setCurrentIdx(idx);
                  setSelectedData(matrix[idx]);
                  const schemaItem = schema[idx];
                  setCurrentMin(schemaItem.range.min-1);
                  setCurrentMax(schemaItem.range.max+1);
                  setCurrentTransform('none');
                }}
              >
                {key}
              </button>
            ))
          }
      </div>
      <div>
          <span>Transform:</span>
          {
              ['none', 'mean centering', 'log(x+1)'].map((key) => (
                <button
                  key={key}
                  className={`
                    border ${currentTransform === key ? 'bg-indigo-500 text-white' : 'border-indigo-500'}
                    m-1 rounded-md px-2 py-1 text-sm
                    ${currentTransform === key ? 'bg-indigo-500' : 'text-indigo-500'}
                    ${currentTransform === key ? 'opacity-100' : 'opacity-70'}`
                  }
                  onClick={() => {
                    const currentData = matrix[currentIdx];
                    const schemaItem = schema[currentIdx];
                    setCurrentTransform(key);
                    switch (key) {
                      case "none":
                        setSelectedData(currentData);
                        setCurrentMin(schemaItem.range.min-1);
                        setCurrentMax(schemaItem.range.max+1);
                        break;
                      case "log(x+1)":
                        setSelectedData(logPlusOneTransform(currentData));
                        setCurrentMin(Math.log(schemaItem.range.min+1));
                        setCurrentMax(Math.log(schemaItem.range.max+1));
                        break;
                      case "mean centering":
                        setSelectedData(center(currentData, schemaItem.mean));
                        setCurrentMin(schemaItem.range.min-schemaItem.mean);
                        setCurrentMax(schemaItem.range.max-schemaItem.mean);
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
      </div>
      <Histogram
        width={width}
        height={height - BUTTONS_HEIGHT}
        domain={[currentMin, currentMax]}
        data={selectedData}
      />
    </div>
  );
};

export default HistogramTransition;