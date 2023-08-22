import React, { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { bucketURL, datasets } from './constants';
import { Schema } from '../../utils/schema';

interface DataCardProps {
  schema: Schema[]
}

const DataCard: React.FC<DataCardProps> = ({ schema }) => {
  return (
    <div className="mt-5 overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-500">
          <thead className="text-s text-gray-700 bg-gray-50">
              <tr>
                <th>Index</th>
                {schema.map((schemaItem) => {
                  return (
                    <td scope="col" className="px-6 py-3 font-bold" key={schemaItem.index}>
                      {schemaItem.index}
                    </td>
                  );
                })}
              </tr>
          </thead>
          <tbody>
              <tr className="bg-white border-b">
                  <th className="text-gray-700">Feature</th>
                  {schema.map((schemaItem) => {
                    return (
                      <td scope="col" className="px-6 py-3" key={schemaItem.index}>
                        {schemaItem.key}
                      </td>
                    );
                  })}
              </tr>
              <tr className="bg-white border-b">
                  <th className="text-gray-700">DataType</th>
                  {schema.map((schemaItem) => {
                    return (
                      <td scope="col" className="px-6 py-3" key={schemaItem.index}>
                        {schemaItem.type}
                      </td>
                    );
                  })}
              </tr>
          </tbody>
      </table>
   </div>    
  );
};

export default DataCard;
