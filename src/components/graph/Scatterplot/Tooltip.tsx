import { convertNumberNotation } from "./utils";
import { Value } from "../../../utils/schema";


export type InteractionData = {
  xPos: number;
  yPos: number;
  keys: string[];
  values: Value[];
};

type TooltipProps = {
  interactionData: InteractionData | null;
  boundsHeight: number;
};

export const Tooltip = ({ interactionData, boundsHeight }: TooltipProps) => {
  if (!interactionData) {
    return null;
  }

  return (
    <div
      className="absolute rounded-md bg-black px-4 py-2 text-xs text-white opacity-80"
      style={{
        left: interactionData.xPos,
        top: interactionData.yPos < boundsHeight / 2 ? interactionData.yPos: interactionData.yPos - boundsHeight / 2,
      }}
    >
      {interactionData.keys.map((key, index) => {
        const val = interactionData.values[index];
        return (
          <div key={key}>
            <b>{key}</b>
            <span>: </span>
            <span>{typeof val === "number" ? convertNumberNotation(val as number) : val as never}</span>
          </div>
        )
      })}
    </div>
  );
};

