export type InteractionData = {
  xPos: number;
  xValue: Date;
  yPos: number;
  yValue: number;
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
      className="absolute border border-black p-2 pointer-events-none rounded-md bg-black px-4 py-2 text-xs text-white opacity-80"
      style={{
        left: `${interactionData.xPos}px`,
        top: `${interactionData.yPos}px`,
      }}
    >
      <p>
        <b>x</b><span>:</span> {interactionData.xValue.toLocaleString()}
      </p>
      <p>
        <b>y</b><span>:</span> {interactionData.yValue.toFixed(2)}
      </p>
    </div>
  );
};

