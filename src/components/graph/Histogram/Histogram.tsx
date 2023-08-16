import { useState } from "react";
import { Renderer } from "./Renderer";
import { NumberSchema } from "../../../utils/schema";
import { logETransform, log10Transform, center } from "../../../utils/transform";

const BUTTONS_HEIGHT = 50;

type HistogramProps = {
  width: number;
  height: number;
  matrix: any[][];
  schema: NumberSchema[],
  keys: string[]
};

export const Histogram = ({
  width,
  height,
  matrix,
  schema,
  keys
}: HistogramProps) => {
  const firstSchemaItem = schema[0];
  const [selectedData, setSelectedData] = useState(matrix[0]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [currentMin, setCurrentMin] = useState(firstSchemaItem.range.min);
  const [currentMax, setCurrentMax] = useState(firstSchemaItem.range.max);
  const [currentTransform, setCurrentTransform] = useState('none');
  const [errorMessage, setErrorMessage] = useState("");

  return (
    <div id="histogram">
      <Renderer
        width={width}
        height={height - BUTTONS_HEIGHT}
        domain={[currentMin, currentMax]}
        data={selectedData}
      />
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
              ['none', 'mean centering', 'log10(x)', 'ln(x)'].map((key) => (
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
                        setErrorMessage("");
                        break;
                      case "ln(x)":
                        if (schemaItem.range.min <= 0) {
                          setErrorMessage("Error: All numbers must be positive for ln(x) transform.");
                          setCurrentTransform('none');
                          return;
                        }
                        setSelectedData(logETransform(currentData));
                        setCurrentMin(Math.log(schemaItem.range.min));
                        setCurrentMax(Math.log(schemaItem.range.max));
                        setErrorMessage("");
                        break;
                      case "log10(x)":
                        if (schemaItem.range.min <= 0) {
                          setErrorMessage("Error: All numbers must be positive for log10(x) transform.");
                          setCurrentTransform('none');
                          return;
                        }
                        setSelectedData(log10Transform(currentData));
                        setCurrentMin(Math.log10(schemaItem.range.min));
                        setCurrentMax(Math.log10(schemaItem.range.max));
                        setErrorMessage("");
                        break;
                      case "mean centering":
                        setSelectedData(center(currentData, schemaItem.mean));
                        setCurrentMin(schemaItem.range.min-schemaItem.mean);
                        setCurrentMax(schemaItem.range.max-schemaItem.mean);
                        setErrorMessage("");
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
          <span className="ml-2 text-red-400">{errorMessage}</span>
      </div>
    </div>
  );
};

export default Histogram;