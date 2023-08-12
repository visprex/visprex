import { useState } from "react";
import { Histogram } from "./Histogram";
import { NumberSchema } from "../../utils";

const BUTTONS_HEIGHT = 50;

type HistogramTransitionProps = {
  width: number;
  height: number;
  matrix: any[][];
  schema: NumberSchema[],
  keys: string[]
};

const buttonStyle = {
  border: "1px solid #9a6fb0",
  borderRadius: "3px",
  padding: "0px 8px",
  margin: "10px 2px",
  fontSize: 14,
  color: "#9a6fb0",
  opacity: 0.7,
};

export const HistogramTransition = ({
  width,
  height,
  matrix,
  schema,
  keys
}: HistogramTransitionProps) => {
  const firstSchemaItem = schema[0]
  const [selectedData, setSelectedData] = useState(matrix[0]);
  const [currentMin, setCurrentMin] = useState(firstSchemaItem.range.min);
  const [currentMax, setCurrentMax] = useState(firstSchemaItem.range.max);

  return (
    <div>
      <div style={{ height: BUTTONS_HEIGHT }}>
        {
            keys.map((key: string, idx: number ) =>
                <button
                    key={key}
                    style={buttonStyle}
                    onClick={() => {
                            setSelectedData(matrix[idx])
                            const schemaItem = schema[idx]
                            setCurrentMin(schemaItem.range.min)
                            setCurrentMax(schemaItem.range.max)
                        }
                    }>
                    {key}
                </button>
            )
        }
      </div>
      <Histogram
        width={width}
        height={height - BUTTONS_HEIGHT}
        domain={[currentMin,currentMax]}
        data={selectedData}
      />
    </div>
  );
};
