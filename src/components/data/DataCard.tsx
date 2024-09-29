import React from 'react';
import { Schema } from '../../utils/schema';

interface DataCardProps {
  schema: Schema[]
}

const DataCard: React.FC<DataCardProps> = ({ schema }) => {
  return (
    <div className="mt-5 overflow-x-auto">
      <div className='text-gray-700 text-sm mb-5'><span className='font-bold'>Size:</span> ({schema[0].rows} rows, {schema.length} columns)</div>
      <table className="w-full text-left text-sm text-gray-500">
          <thead className="bg-gray-50 text-gray-700">
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
              <tr className="border-b bg-white">
                  <th className="text-gray-700">Feature</th>
                  {schema.map((schemaItem) => {
                    return (
                      <td scope="col" className="px-6 py-3" key={schemaItem.index}>
                        {schemaItem.key}
                      </td>
                    );
                  })}
              </tr>
              <tr className="border-b bg-white">
                  <th className="text-gray-700">DataType</th>
                  {schema.map((schemaItem) => {
                    return (
                      <td scope="col" className="px-6 py-3" key={schemaItem.index}>
                        {schemaItem.type === 'number' ? 'Numerical' : 'Categorical'}
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
