import { useEffect, useState } from 'react';
import { NumberSchema } from "../../../utils/schema";
import { calculateCorrelations, Correlation } from '../../../utils/stats';
import { Tooltip } from './Tooltip';
import { Renderer } from './Renderer';


interface CorrelationMatrixProps {
    width: number;
    height: number;
    matrix: any[][];
    schema: NumberSchema[],
    keys: string[]
}

export type InteractionData = {
  xLabel: string;
  yLabel: string;
  xPos: number;
  yPos: number;
  value: number;
};

export const CorrelationMatrix = ({ width, height, matrix, schema, keys } : CorrelationMatrixProps) => {
  const [corr, setCorr] = useState<Correlation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setCorr(calculateCorrelations(matrix, schema));
    setIsLoading(false);
  }, []);

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
      </div>
  );
};