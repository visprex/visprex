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
      setResult(result)
    }
  }, [featureMatrix, targetVector])

  return (
    <div>
      <div className='flex flex-col items-center justify-center mt-4'>
        <h1 className='text-gray-600 font-semibold'>Model Specification</h1>
      </div>
      <h4 className='text-gray-500 mb-2'>Y: Dependent Variable</h4>
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
      <h4 className='text-gray-500 my-2'>X: Independent Variables</h4>
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
      <hr className="border-gray-400 my-4"/>
      <div className='flex flex-col items-center justify-center'>
        <h1 className='text-gray-600 font-semibold'>Model Summary</h1>
        {
          (result && result.coefficients.length === xIdxs.length + 1) ?
            <div className="mx-2 my-6">
              <div className='flex flex-col items-center justify-center'>
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
                  {" + "}
                  <i className='text-gray-700'>error</i>
                </p>
              </div>
              <div className="flex flex-col items-center justify-center mt-4 mb-2 text-sm text-gray-700">
                <p><span className="font-semibold text-indigo-900">R²:</span> {result.rSquared.toFixed(4)}</p>
                <p className='mt-1'><span className="font-semibold text-indigo-900">Sample Size:</span> {featureMatrix[0]?.length ?? 0}</p>
                <table className="table-auto border-collapse border border-gray-400 mt-4">
                  <thead>
                    <tr>
                      <th className="border border-gray-400 px-4 py-2">Variable</th>
                      <th className="border border-gray-400 px-4 py-2">Coefficient</th>
                      <th className="border border-gray-400 px-4 py-2">Standard Error</th>
                      <th className="border border-gray-400 px-4 py-2">95% Conf Interval</th>
                      <th className="border border-gray-400 px-4 py-2">Z-Score</th>
                      <th className='border border-gray-400 px-4 py-2'>P-Value</th>
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
                        [{result.confidenceIntervals[0][0].toFixed(2)}, {result.confidenceIntervals[0][1].toFixed(2)}]
                      </td>
                      <td className="border border-gray-400 px-4 py-2">{result.zScores[0].toFixed(2)}</td>
                      <td className="border border-gray-400 px-4 py-2">{result.pValues[0].toFixed(2)}</td>
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
                            [{result.confidenceIntervals[idx+1][0].toFixed(2)}, {result.confidenceIntervals[idx+1][1].toFixed(2)}]
                          </td>
                          <td className="border border-gray-400 px-4 py-2">{result.zScores[idx+1].toFixed(2)}</td>
                          <td className="border border-gray-400 px-4 py-2">{result.pValues[idx+1].toFixed(2)}</td>  
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
                <p className="text-sm text-gray-500 text-right mt-2">
                  <span className="mr-4">* p &lt; 0.10</span>
                  <span className="mr-4">** p &lt; 0.05</span>
                  <span>*** p &lt; 0.01</span>
                </p>
              </div>
            </div>
          :
          <div className='my-4 text-gray-900 text-center'>
            Select a dependent variable and at least one independent variable to see the model summary.
          </div>
        }
      </div>
    </div>
  );
};

export default Modelling;