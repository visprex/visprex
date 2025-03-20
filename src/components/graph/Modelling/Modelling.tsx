import React, { useState, useEffect } from 'react';
import { linearRegression, LinearRegressionResult } from '@/core';
import { Value, Schema, NumberSchema, DataType } from '@/schema';

interface ModellingProps {
  matrix: Value[][];
  schema: Schema[];
  keys: string[]
}

export const Modelling: React.FC<ModellingProps> = ({ matrix, schema, keys }) => {
  const numberSchema = schema.filter((schemaItem) => schemaItem.type === DataType.Number) as NumberSchema[];
  
  const [xIdxs, setXIdxs] = useState<number[]>([]);
  const [yIdx, setYIdx] = useState<number>(numberSchema[0].index);

  const [featureMatrix, setFeatureMatrix] = useState<number[][]>([]);
  const [targetVector, setTargetVector] = useState<number[]>(matrix[yIdx] as number[]);

  const [result, setResult] = useState<LinearRegressionResult | null>(null)

  useEffect(() => {
    if (xIdxs.length === 0){
      return
    }
    setFeatureMatrix(matrix.filter((_, idx) => xIdxs.includes(idx)) as number[][]);
    setTargetVector(matrix[yIdx] as number[]);    
  }, [matrix, xIdxs, yIdx]);

  useEffect(() => {
    if (featureMatrix.length > 0 && targetVector.length > 0) {
      const result = linearRegression(featureMatrix, targetVector)
      console.log(result)
      setResult(result)
    }
  }, [featureMatrix, targetVector])

  return (
    <div>
      <h2>Dependent Variable:</h2>
      <div key='y' className='flex overflow-x-auto'>
        {
          keys.map((key: string, idx: number ) =>
            <button
              key={key}
              disabled={[DataType.Categorical, DataType.DateTime].includes(schema[idx].type)}
              className={`
                border ${idx === yIdx ? 'bg-indigo-500 text-white' : 'border-indigo-500'}
                m-1 rounded-md px-2 py-1 text-sm
                ${idx === yIdx ? 'bg-indigo-500' : 'text-indigo-500'}
                ${idx === yIdx ? 'opacity-100' : 'opacity-70'}
                ${
                  [DataType.Categorical, DataType.DateTime].includes(schema[idx].type) ?
                  'cursor-not-allowed border-gray-400 bg-gray-200 opacity-50' : ''
                }
                h-8 whitespace-nowrap text-ellipsis`
              }
              onClick={() => {
                setYIdx(idx)
              }}
            >
              {key}
            </button>
          )
        }
      </div>
      <div>
        <label>Independent Variables:</label>
        <div key='x' className="flex overflow-x-auto">
          {
            keys.map((key: string, idx: number ) =>
              <button
                aria-multiselectable
                key={key}
                disabled={[DataType.Categorical, DataType.DateTime].includes(schema[idx].type)}
                className={`
                  border ${xIdxs.includes(idx) ? 'bg-indigo-500 text-white' : 'border-indigo-500'}
                  m-1 rounded-md px-2 py-1 text-sm
                  ${xIdxs.includes(idx) ? 'bg-indigo-500' : 'text-indigo-500'}
                  ${xIdxs.includes(idx) ? 'opacity-100' : 'opacity-70'}
                  ${
                    [DataType.Categorical, DataType.DateTime].includes(schema[idx].type) ?
                    'cursor-not-allowed border-gray-400 bg-gray-200 opacity-50' : ''
                  }
                  h-8 whitespace-nowrap text-ellipsis`
                }
                onClick={() => {
                  setXIdxs((prev) => {
                    return xIdxs.includes(idx) ? prev.filter(v => v !== idx) : [...prev, idx]
                  })
                }}
              >
                {key}
              </button>
            )
          }
        </div>
      </div>
      <h2>Linear Regression</h2>
      {
        result &&
        <p>
          <b>{schema[yIdx].key}</b>
          {" = "}  
          {result.coefficients[0] > 0 ? result.coefficients[0].toFixed(2): `- ${Math.abs(result.coefficients[0]).toFixed(2)}` }
          {
            xIdxs.map((xIdx, idx) => (
              <React.Fragment key={xIdx}>
                {" "}
                {result.coefficients[idx + 1] > 0 ? "+" : "-"} {Math.abs(result.coefficients[idx + 1]).toFixed(2)} * <b>{schema[xIdx].key}</b>
              </React.Fragment>
            ))
          }
        </p>
      }
  </div>
  );
};

export default Modelling;