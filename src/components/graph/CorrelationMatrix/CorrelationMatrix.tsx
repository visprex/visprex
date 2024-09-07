import { useEffect, useState } from 'react';
import { Schema, Value } from "../../../utils/schema";
import { calculateCorrelations, Correlation } from '../../../utils/stats';
import { Tooltip } from './Tooltip';
import { Renderer } from './Renderer';


interface CorrelationMatrixProps {
    width: number;
    height: number;
    matrix: Value[][];
    schema: Schema[],
    keys: string[]
}

export type InteractionData = {
  xLabel: string;
  yLabel: string;
  xPos: number;
  yPos: number;
  value: number;
};

export const CorrelationMatrix = ({ width, height, matrix, schema } : CorrelationMatrixProps) => {
  const [corr, setCorr] = useState<Correlation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setCorr(calculateCorrelations(matrix, schema)),
    setIsLoading(false);
  }, [matrix, schema]);

  const [hoveredCell, setHoveredCell] = useState<InteractionData | null>(null);

  return (
    isLoading ? <div>Calculating...</div> :
     <div style={{ position: "relative" }}>
      <Renderer
        width={width}
        height={height}
        data={corr}
        setHoveredCell={setHoveredCell}
      />
      <Tooltip interactionData={hoveredCell} width={width} height={height} />
      <div className="mt-5 overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-500">
              <thead className="bg-gray-50 text-xs uppercase text-gray-700">
                  <tr>
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
                      {schema.map((schemaItem) => {
                        return (
                          <td scope="col" className="px-6 py-3" key={schemaItem.index}>
                            {schemaItem.key}
                          </td>
                        );
                      })}
                  </tr>
              </tbody>
          </table>
        </div>
      </div>
  );
};