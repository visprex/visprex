import { useState } from "react";
import { Schema, NumberSchema, CategoricalSchema, DataType, Value } from "../../../utils/schema";
import { logETransform, log10Transform, center, TransformType } from "../../../utils/transform";
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
    initialDomain = [0,Object.keys((firstSchemaItem as CategoricalSchema).frequencies).length];

  let initialNumberData: number[];
  let initialCategoricalData: {[key: string]:number};

  if (firstSchemaItem.type === DataType.Number) {
    initialNumberData = matrix[0].map((d) => d as number)
    initialCategoricalData = {}
  } else {
    initialNumberData = []
    initialCategoricalData = (firstSchemaItem as CategoricalSchema).frequencies
  }

  const [selectedNumberData, setSelectedNumberData] = useState<number[]>(initialNumberData);
  const [selectedCategoricalData, setSelectedCategoricalData] = useState<{[key: string]:number}>(initialCategoricalData);

  const [currentIdx, setCurrentIdx] = useState(0);

  const [currentDomain, setCurrentDomain] = useState<[number, number]>(initialDomain);
  const [currentDatatype, setCurrentDatatype] = useState(firstSchemaItem.type);
  
  const [currentTransform, setCurrentTransform] = useState(TransformType.None);
  const [errorMessage, setErrorMessage] = useState("");

  function handleColumnSelect(idx: number) {
    setCurrentIdx(idx);
    const schemaItem = schema[idx];
    if (schemaItem.type === DataType.Number) {
      setCurrentDatatype(DataType.Number);
      setSelectedNumberData(matrix[idx] as number[]);
      setCurrentDomain([schemaItem.range.min-1, schemaItem.range.max+1]);
    } else {
      setCurrentDatatype(DataType.Categorical);
      setSelectedCategoricalData((schemaItem as CategoricalSchema).frequencies);
      setCurrentDomain([0,Object.keys((schemaItem as CategoricalSchema).frequencies).length]);
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
      switch (key) {
        case TransformType.None:
          setSelectedNumberData(currentData as number[]);
          setCurrentDomain([schemaItem.range.min-1, schemaItem.range.max+1]);
          setErrorMessage("");
          break;
        case TransformType.Ln:
          if (schemaItem.range.min <= 0) {
            setErrorMessage("Error: All numbers must be positive for ln(x) transform.");
            setCurrentTransform(TransformType.None);
            return;
          }
          setSelectedNumberData(logETransform(currentData as number[]));
          setCurrentDomain([Math.log(schemaItem.range.min), Math.log(schemaItem.range.max)]);
          setErrorMessage("");
          break;
        case TransformType.Log10:
          if (schemaItem.range.min <= 0) {
            setErrorMessage("Error: All numbers must be positive for log10(x) transform.");
            setCurrentTransform(TransformType.None);
            return;
          }
          setSelectedNumberData(log10Transform(currentData as number[]));
          setCurrentDomain([Math.log10(schemaItem.range.min), Math.log10(schemaItem.range.max)]);
          setErrorMessage("");
          break;
        case TransformType.Centering:
          setSelectedNumberData(center(currentData as number[], schemaItem.mean));
          setCurrentDomain([schemaItem.range.min-schemaItem.mean, schemaItem.range.max-schemaItem.mean]);
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
        data={currentDatatype === DataType.Number ? selectedNumberData : selectedCategoricalData}
        datatype={currentDatatype}
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
                onClick={() => handleColumnSelect(idx)}
              >
                {key}
              </button>
            ))
          }
      </div>
      <div>
          <span>Transform:</span>
          {
              [TransformType.None, TransformType.Centering, TransformType.Log10, TransformType.Ln].map((key) => (
                <button
                  key={key}
                  className={`
                    border ${currentTransform === key ? 'bg-indigo-500 text-white' : 'border-indigo-500'}
                    m-1 rounded-md px-2 py-1 text-sm
                    ${currentTransform === key ? 'bg-indigo-500' : 'text-indigo-500'}
                    ${currentTransform === key ? 'opacity-100' : 'opacity-70'}
                    ${currentDatatype === DataType.Categorical && key !== TransformType.None ? 'cursor-not-allowed border-gray-400 bg-gray-200 opacity-50'  : 'cursor-pointer'}
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