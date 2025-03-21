import React, { useState, useEffect } from 'react';
import { linearRegression, LinearRegressionResult } from '@/core';
import { Value, Schema, NumberSchema, DataType } from '@/schema';
import { set } from 'lodash-es';

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
      setResult(result)
    }
  }, [featureMatrix, targetVector])

  return (
    <div>
      <div className="mx-2 my-2">
        <h4 className='text-gray-500 ml-1'>Dependent Variable</h4>
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
                if (xIdxs.includes(idx)) {
                  setXIdxs(prev => [...prev.filter(v => v !== idx)])
                }
              }}
            >
              {key}
            </button>
          )
        }
        </div>
      </div>
      <div className='mx-2 my-2'>
        <h4 className='text-gray-500 ml-1'>Independent Variables</h4>
        <div key='x' className="flex overflow-x-auto">
          {
            keys.map((key: string, idx: number ) =>
              <button
                aria-multiselectable
                key={key}
                disabled={[DataType.Categorical, DataType.DateTime].includes(schema[idx].type) || idx === yIdx}
                className={`
                  border ${xIdxs.includes(idx) ? 'bg-indigo-500 text-white' : 'border-indigo-500'}
                  m-1 rounded-md px-2 py-1 text-sm
                  ${xIdxs.includes(idx) ? 'bg-indigo-500' : 'text-indigo-500'}
                  ${xIdxs.includes(idx) ? 'opacity-100' : 'opacity-70'}
                  ${
                    [DataType.Categorical, DataType.DateTime].includes(schema[idx].type) || idx === yIdx ?
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
      {
        (result && result.coefficients.length === xIdxs.length + 1) &&
        <div className="mx-2 my-6">
          <h4 className='text-gray-500'>Regression Equation</h4>
          <p>
            <i className='font-semibold text-indigo-900'>{schema[yIdx].key}</i>
            {" = "}  
            {result.coefficients[0] > 0 ? result.coefficients[0].toFixed(2) : `- ${Math.abs(result.coefficients[0]).toFixed(2)}`}
            {
              xIdxs.map((xIdx, idx) => (
                <React.Fragment key={xIdx}>
                  {" "}
                  {result.coefficients[idx + 1] > 0 ? "+" : "-"} {Math.abs(result.coefficients[idx + 1]).toFixed(2)} × <i className='font-semibold text-indigo-900'>{schema[xIdx].key}</i>
                </React.Fragment>
              ))
            }
          </p>
          <table className="table-auto border-collapse border border-gray-400 mt-4">
            <thead>
              <tr>
                <th className="border border-gray-400 px-4 py-2">Variable</th>
                <th className="border border-gray-400 px-4 py-2">Coefficient</th>
                <th className="border border-gray-400 px-4 py-2">Standard Error</th>
                <th className="border border-gray-400 px-4 py-2">95% Confidence Interval</th>
                <th className="border border-gray-400 px-4 py-2">Z-Score</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-400 px-4 py-2"><i className='font-semibold text-indigo-900'>Intercept</i></td>
                <td className="border border-gray-400 px-4 py-2">
                  {result.coefficients[0].toFixed(2)}
                  {" "}
                  {
                    Math.abs(result.zScores[0]) > 2.58 ? 
                    "***" : Math.abs(result.zScores[0]) > 1.96 ?
                    "**" : Math.abs(result.zScores[0]) > 1.645 ?
                    "*" :
                    ""
                  }
                </td>
                <td className="border border-gray-400 px-4 py-2">{result.standardErrors[0].toFixed(2)}</td>
                <td className="border border-gray-400 px-4 py-2">
                  ({result.confidenceIntervals[0][0].toFixed(2)}, {result.confidenceIntervals[0][1].toFixed(2)})
                </td>
                <td className="border border-gray-400 px-4 py-2">{result.zScores[0].toFixed(2)}</td>
              </tr>
              {
                xIdxs.map((xIdx, idx) => (
                  <tr key={xIdx}>
                    <td className="border border-gray-400 px-4 py-2">
                      <i className='font-semibold text-indigo-900'>{schema[xIdx].key}</i>
                    </td>
                    <td className="border border-gray-400 px-4 py-2">
                      {result.coefficients[idx+1].toFixed(2)}
                      {" "}
                      {
                        Math.abs(result.zScores[idx+1]) > 2.58 ?
                        "***" : Math.abs(result.zScores[idx+1]) > 1.96 ?
                        "**" : Math.abs(result.zScores[idx+1]) > 1.645 ?
                        "*" :
                        ""
                      }
                    </td>
                    <td className="border border-gray-400 px-4 py-2">{result.standardErrors[idx+1].toFixed(2)}</td>
                    <td className="border border-gray-400 px-4 py-2">
                      ({result.confidenceIntervals[idx+1][0].toFixed(2)}, {result.confidenceIntervals[idx+1][1].toFixed(2)})
                    </td>
                    <td className="border border-gray-400 px-4 py-2">{result.zScores[idx+1].toFixed(2)}</td>
                  </tr>
                ))
              }
            </tbody>
          </table>
        </div>
      }
  </div>
  );
};

export default Modelling;