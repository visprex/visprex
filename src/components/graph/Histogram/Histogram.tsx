import { useState } from "react";
import { Schema, NumberSchema, DataType, Value } from "../../../types/schema";
import { logETransform, logEPlus1Transform, log10Transform, log10Plus1Transform, TransformType, squaredTransform } from "../../../utils/transform";
import { Renderer } from "./Renderer";

const BUTTONS_HEIGHT = 50;

type HistogramProps = {
  width: number;
  height: number;
  matrix: Value[][];
  schema: Schema[],
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

  let initialDomain: [number, number];
  firstSchemaItem.type === DataType.Number ?
    initialDomain = [(firstSchemaItem as NumberSchema).range.min-1, (firstSchemaItem as NumberSchema).range.max+1] :
    initialDomain = [0,Object.keys(firstSchemaItem.frequencies).length];

  let initialNumberData: number[];
  let initialStringData: {[key: string]:number};

  if (firstSchemaItem.type === DataType.Number) {
    initialNumberData = matrix[0].map((d) => d as number)
    initialStringData = {}
  } else {
    initialNumberData = []
    initialStringData = firstSchemaItem.frequencies
  }

  const [selectedNumberData, setSelectedNumberData] = useState<number[]>(initialNumberData);
  const [selectedStringData, setSelectedStringData] = useState<{[key: string]:number}>(initialStringData);

  const [currentIdx, setCurrentIdx] = useState(0);

  const [currentDomain, setCurrentDomain] = useState<[number, number]>(initialDomain);
  const [currentDataType, setCurrentDataType] = useState(firstSchemaItem.type);
  
  const [currentTransform, setCurrentTransform] = useState(TransformType.None);
  const [errorMessage, setErrorMessage] = useState("");

  function handleColumnSelect(idx: number) {
    setCurrentIdx(idx);
    const schemaItem = schema[idx];
    if (schemaItem.type === DataType.Number) {
      setCurrentDataType(DataType.Number);
      setSelectedNumberData(matrix[idx] as number[]);
      setCurrentDomain([schemaItem.range.min-1, schemaItem.range.max+1]);
    } else {
      setCurrentDataType(schemaItem.type);
      setSelectedStringData(schemaItem.frequencies);
      setCurrentDomain([0,Object.keys(schemaItem.frequencies).length]);
    }
    setCurrentTransform(TransformType.None);
  }

  function handleTransform(key: TransformType) {
    {
      const currentData = matrix[currentIdx];
      const schemaItem = schema[currentIdx];
      setCurrentTransform(key);
      if (schemaItem.type === DataType.Categorical) {
        setErrorMessage("");
        return;
      }
      if (schemaItem.type === DataType.DateTime) {
        setErrorMessage("");
        return;
      }
      switch (key) {
        case TransformType.None:
          setSelectedNumberData(currentData as number[]);
          setCurrentDomain([schemaItem.range.min-1, schemaItem.range.max+1]);
          setErrorMessage("");
          break;
        case TransformType.Squared:
          setSelectedNumberData(squaredTransform(currentData as number[]));
          setCurrentDomain([schemaItem.range.min ** 2, schemaItem.range.max ** 2]);
          setErrorMessage("");
          break;
        case TransformType.Ln:
          if (schemaItem.range.min <= 0) {
            setErrorMessage("Error: All numbers must be positive for log transform.");
            setCurrentTransform(TransformType.None);
            return;
          }
          setSelectedNumberData(logETransform(currentData as number[]));
          setCurrentDomain([Math.log(schemaItem.range.min), Math.log(schemaItem.range.max)]);
          setErrorMessage("");
          break;
        case TransformType.LnPlus1:
          if (schemaItem.range.min <= -1) {
            setErrorMessage("Error: All numbers must be greater than -1 for ln(x+1) transform.");
            setCurrentTransform(TransformType.None);
            return;
          }
          setSelectedNumberData(logEPlus1Transform(currentData as number[]));
          setCurrentDomain([Math.log(schemaItem.range.min+1), Math.log(schemaItem.range.max+1)]);
          setErrorMessage("");
          break;
        case TransformType.Log10:
          if (schemaItem.range.min <= -1) {
            setErrorMessage("Error: All numbers must be greater than -1 for log10(x+1) transform.");
            setCurrentTransform(TransformType.None);
            return;
          }
          setSelectedNumberData(log10Plus1Transform(currentData as number[]));
          setCurrentDomain([Math.log10(schemaItem.range.min+1), Math.log10(schemaItem.range.max+1)]);
          setErrorMessage("");
          break;
        case TransformType.Log10Plus1:
          if (schemaItem.range.min+1 <= 0) {
            setErrorMessage("Error: All numbers must be greater than or equal to 0 for ln(x+1) transform.");
            setCurrentTransform(TransformType.None);
            return;
          }
          setSelectedNumberData(log10Transform(currentData as number[]));
          setCurrentDomain([Math.log10(schemaItem.range.min), Math.log10(schemaItem.range.max)]);
          setErrorMessage("");
          break;
        default:
          break;
      }
    }
  }

  return (
    <div id="histogram">
      <Renderer
        width={width}
        height={height - BUTTONS_HEIGHT}
        domain={currentDomain}
        data={currentDataType === DataType.Number ? selectedNumberData : selectedStringData}
        dataType={currentDataType}
      />
      <div className="flex overflow-x-auto">
          {
            keys.map((key, idx) => (
              <button
                key={key}
                className={`
                  border ${currentIdx === idx ? 'bg-indigo-500 text-white' : 'border-indigo-500'}
                  m-1 rounded-md px-2 py-1 text-sm
                  ${currentIdx === idx ? 'bg-indigo-500' : 'text-indigo-500'}
                  ${currentIdx === idx ? 'opacity-100' : 'opacity-70'}
                  h-8 whitespace-nowrap text-ellipsis`
                }
                onClick={() => handleColumnSelect(idx)}
              >
                {key}
              </button>
            ))
          }
      </div>
      <div>
          <span className='ml-5 font-serif font-thin italic'>f(x):</span>
          {
              [TransformType.None, TransformType.Squared, TransformType.Log10, TransformType.Log10Plus1, TransformType.Ln, TransformType.LnPlus1].map((key) => (
                <button
                  key={key}
                  className={`
                    border ${currentTransform === key ? 'bg-indigo-500 text-white' : 'border-indigo-500'}
                    m-1 rounded-md px-2 py-1 text-sm
                    ${currentTransform === key ? 'bg-indigo-500' : 'text-indigo-500'}
                    ${currentTransform === key ? 'opacity-100' : 'opacity-70'}
                    ${[DataType.Categorical, DataType.DateTime].includes(currentDataType) && key !== TransformType.None ?
                      'cursor-not-allowed border-gray-400 bg-gray-200 opacity-50'  : 'cursor-pointer'
                    }
                    `
                  }
                  onClick={() => handleTransform(key)}
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