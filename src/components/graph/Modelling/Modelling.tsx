import React, { useState, useEffect } from 'react';
import { linearRegression, LinearRegressionResult } from '@/core';
import { Value, Schema, NumberSchema, DataType } from '@/schema';

interface ModellingProps {
  matrix: Value[][];
  schema: Schema[];
  keys: string[];
}

enum ResultColumn {
  Coefficient = 'Coefficient',
  StdError = 'Standard Error',
  ConfidenceInterval = '95% Conf. Interval',
  ZScore = 'Z-Score',
  PValue = 'P-Value'
}

const columnOptions = Object.values(ResultColumn);

const getColumnValue = (result: LinearRegressionResult, column: ResultColumn, idx: number) => {
  switch (column) {
    case ResultColumn.Coefficient: {
      const coef = result.coefficients[idx];
      const stars =
        Math.abs(result.zScores[idx]) > 2.58
          ? '***'
          : Math.abs(result.zScores[idx]) > 1.96
          ? '**'
          : Math.abs(result.zScores[idx]) > 1.645
          ? '*'
          : '';
      return `${coef.toFixed(2)} ${stars}`;
    }
    case ResultColumn.StdError:
      return result.standardErrors[idx].toFixed(2);
    case ResultColumn.ConfidenceInterval:
      return `[${result.confidenceIntervals[idx][0].toFixed(2)}, ${result.confidenceIntervals[idx][1].toFixed(2)}]`;
    case ResultColumn.ZScore:
      return result.zScores[idx].toFixed(2);
    case ResultColumn.PValue:
      return result.pValues[idx].toFixed(2);
    default:
      return '';
  }
};

export const Modelling: React.FC<ModellingProps> = ({ matrix, schema, keys }) => {
  const numberSchema = schema.filter((item) => item.type === DataType.Number) as NumberSchema[];

  const [xIdxs, setXIdxs] = useState<number[]>([]);
  const [yIdx, setYIdx] = useState<number>(numberSchema[0].index);

  const [featureMatrix, setFeatureMatrix] = useState<number[][]>([]);
  const [targetVector, setTargetVector] = useState<number[]>(matrix[yIdx] as number[]);
  
  const [result, setResult] = useState<LinearRegressionResult | null>(null);
  
  const [isMobile, setIsMobile] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<ResultColumn>(ResultColumn.Coefficient);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  useEffect(() => {
    if (xIdxs.length === 0) return;
    setFeatureMatrix(matrix.filter((_, idx) => xIdxs.includes(idx)) as number[][]);
    setTargetVector(matrix[yIdx] as number[]);
  }, [matrix, xIdxs, yIdx]);

  useEffect(() => {
    if (featureMatrix.length && targetVector.length) {
      const result = linearRegression(featureMatrix, targetVector);
      setResult(result);
    }
  }, [featureMatrix, targetVector]);

  return (
    <div>
      <div className="flex flex-col items-center justify-center mt-4">
        <h1 className="text-gray-600 font-semibold">Model Specification</h1>
      </div>
      <h4 className="text-gray-500 my-2">Y: Dependent Variable</h4>
      <div key="y" className="flex overflow-x-auto">
        {keys.map((key, idx) => (
          <button
            key={key}
            disabled={[DataType.Categorical, DataType.DateTime].includes(schema[idx].type)}
            className={`
              border ${idx === yIdx ? 'bg-indigo-500 text-white' : 'border-indigo-500'}
              m-1 rounded-md px-2 py-1 text-sm
              ${idx === yIdx ? 'bg-indigo-500' : 'text-indigo-500'}
              ${idx === yIdx ? 'opacity-100' : 'opacity-70'}
              ${[DataType.Categorical, DataType.DateTime].includes(schema[idx].type) ? 'cursor-not-allowed border-gray-400 bg-gray-200 opacity-50' : ''}
              h-8 whitespace-nowrap text-ellipsis
            `}
            onClick={() => {
              setYIdx(idx);
              if (xIdxs.includes(idx)) {
                setXIdxs((prev) => prev.filter((v) => v !== idx));
              }
            }}
          >
            {key}
          </button>
        ))}
      </div>
      <h4 className="text-gray-500 my-2">X: Independent Variables</h4>
      <div key="x" className="flex overflow-x-auto">
        {keys.map((key, idx) => (
          <button
            key={key}
            disabled={[DataType.Categorical, DataType.DateTime].includes(schema[idx].type) || idx === yIdx}
            className={`
              border ${xIdxs.includes(idx) ? 'bg-indigo-500 text-white' : 'border-indigo-500'}
              m-1 rounded-md px-2 py-1 text-sm
              ${xIdxs.includes(idx) ? 'bg-indigo-500' : 'text-indigo-500'}
              ${xIdxs.includes(idx) ? 'opacity-100' : 'opacity-70'}
              ${[DataType.Categorical, DataType.DateTime].includes(schema[idx].type) || idx === yIdx ? 'cursor-not-allowed border-gray-400 bg-gray-200 opacity-50' : ''}
              h-8 whitespace-nowrap text-ellipsis
            `}
            onClick={() =>
              setXIdxs((prev) => (xIdxs.includes(idx) ? prev.filter((v) => v !== idx) : [...prev, idx]))
            }
          >
            {key}
          </button>
        ))}
      </div>
      <hr className="border-gray-400 my-4" />
      <div className="flex flex-col items-center justify-center w-full">
        <h1 className="text-gray-600 font-semibold">Model Summary</h1>
        {result && result.coefficients.length === xIdxs.length + 1 ? (
          <>
            <div className="text-center mx-2 my-2 break-words">
              <span className="block sm:inline">
                <i className="font-semibold text-indigo-900">{schema[yIdx].key}</i>
                {' = '}
                {result.coefficients[0] > 0
                  ? result.coefficients[0].toFixed(2)
                  : `- ${Math.abs(result.coefficients[0]).toFixed(2)}`}
              </span>
              {xIdxs.map((xIdx, idx) => {
                const term = (
                  <>
                    {" "}
                    {result.coefficients[idx + 1] > 0 ? '+' : '-'}
                    {Math.abs(result.coefficients[idx + 1]).toFixed(2)} ×{' '}
                    <i className="font-semibold text-indigo-900">{schema[xIdx].key}</i>
                  </>
                )
                return isMobile ? (
                  <div key={xIdx}>{term}</div>
                ) : (
                  <React.Fragment key={xIdx}>
                    {term}
                  </React.Fragment>
                )
              })}
              {' + '}
              <i className="text-gray-700">error</i>
            </div>
            {isMobile ? (
              <div className="flex flex-col items-center text-sm w-full">
                <p>
                  <span className="font-semibold text-indigo-900">R²:</span> {result.rSquared.toFixed(4)}
                </p>
                <p className="mt-1 mb-2">
                  <span className="font-semibold text-indigo-900">Sample Size:</span>{' '}
                  {featureMatrix[0]?.length ?? 0}
                </p>

                <select
                  className="border border-indigo-400 rounded-md px-3 py-1 text-sm mb-4 w-3/4"
                  value={selectedColumn}
                  onChange={(e) => setSelectedColumn(e.target.value as ResultColumn)}
                >
                  {columnOptions.map((col) => (
                    <option key={col} value={col}>
                      {col}
                    </option>
                  ))}
                </select>
                <div className="w-full overflow-x-auto">
                  <table className="w-full table-auto border-collapse border border-gray-300">
                    <thead>
                      <tr>
                        <th className="border px-4 py-2">Variable</th>
                        <th className="border px-4 py-2">{selectedColumn}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[{ key: 'Intercept', idx: 0 }, ...xIdxs.map((xIdx, i) => ({ key: schema[xIdx].key, idx: i + 1 }))].map(
                        ({ key, idx }) => (
                          <tr key={key}>
                            <td className="border px-4 py-2">
                              <i className="font-semibold text-indigo-900">{key}</i>
                            </td>
                            <td className="border px-4 py-2">{getColumnValue(result, selectedColumn, idx)}</td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-500 text-right mt-2">
                  <span className="mr-4">* p &lt; 0.10</span>
                  <span className="mr-4">** p &lt; 0.05</span>
                  <span>*** p &lt; 0.01</span>
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center mt-4 text-sm text-gray-700 w-full overflow-x-auto">
                <p>
                  <span className="font-semibold text-indigo-900">R²:</span> {result.rSquared.toFixed(4)}
                </p>
                <p className="mt-1">
                  <span className="font-semibold text-indigo-900">Sample Size:</span>{' '}
                  {featureMatrix[0]?.length ?? 0}
                </p>
                <table className="table-auto border-collapse border border-gray-400 mt-4 min-w-full">
                  <thead>
                    <tr>
                      <th className="border px-4 py-2">Variable</th>
                      <th className="border px-4 py-2">Coefficient</th>
                      <th className="border px-4 py-2">Standard Error</th>
                      <th className="border px-4 py-2">95% Conf. Interval</th>
                      <th className="border px-4 py-2">Z-Score</th>
                      <th className="border px-4 py-2">P-Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[{ key: 'Intercept', idx: 0 }, ...xIdxs.map((xIdx, i) => ({ key: schema[xIdx].key, idx: i + 1 }))].map(
                      ({ key, idx }) => (
                        <tr key={key}>
                          <td className="border px-4 py-2">
                            <i className="font-semibold text-indigo-900">{key}</i>
                          </td>
                          <td className="border px-4 py-2">{getColumnValue(result, ResultColumn.Coefficient, idx)}</td>
                          <td className="border px-4 py-2">{getColumnValue(result, ResultColumn.StdError, idx)}</td>
                          <td className="border px-4 py-2">{getColumnValue(result, ResultColumn.ConfidenceInterval, idx)}</td>
                          <td className="border px-4 py-2">{getColumnValue(result, ResultColumn.ZScore, idx)}</td>
                          <td className="border px-4 py-2">{getColumnValue(result, ResultColumn.PValue, idx)}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
                <p className="text-xs text-gray-500 text-right mt-2">
                  <span className="mr-4">* p &lt; 0.10</span>
                  <span className="mr-4">** p &lt; 0.05</span>
                  <span>*** p &lt; 0.01</span>
                </p>
              </div>
            )}
          </>
        ) : (
          <div className="my-4 text-gray-900 text-center">
            Select a dependent variable and at least one independent variable to see the model summary.
          </div>
        )}
      </div>
    </div>
  );
};

export default Modelling;