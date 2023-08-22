import { convertNumberNotation } from "./utils";

export type InteractionData = {
  xPos: number;
  yPos: number;
  keys: string[];
  values: any[];
};

type TooltipProps = {
  interactionData: InteractionData | null;
};

export const Tooltip = ({ interactionData }: TooltipProps) => {
  if (!interactionData) {
    return null;
  }

  return (
    <div
      className="absolute bg-black bg-opacity-80 rounded-md text-white text-xs px-4 py-2 ml-15 transform -translate-y-1/2"
      style={{
        left: interactionData.xPos,
        top: interactionData.yPos,
      }}
    >
      {interactionData.keys.map((key, index) => {
        const val = interactionData.values[index];
        return (
          <div key={key}>
            <b>{key}</b>
            <span>: </span>
            <span>{typeof val === "number" ? convertNumberNotation(val) : val}</span>
          </div>
        )
      })}
    </div>
  );
};

