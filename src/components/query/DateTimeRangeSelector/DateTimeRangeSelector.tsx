import { useCallback, useEffect, useState, useRef } from "react";
import "./DateTimeRangeSelector.css";

interface DateTimeRangeSelectorProps {
  domain: {
    min: number;
    max: number;
  };
  onChange: React.Dispatch<React.SetStateAction<Date[]>>;
}

export const DateTimeRangeSelector: React.FC<DateTimeRangeSelectorProps> = ({ domain, onChange }) => {
  const [minVal, setMinVal] = useState<number>(domain.min);
  const [maxVal, setMaxVal] = useState<number>(domain.max);
  const range = useRef<HTMLDivElement>(null);

  const getPercent = useCallback(
    (value: number) => Math.round(((value - domain.min) / (domain.max - domain.min)) * 100),
    [domain]
  );

  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, maxVal, getPercent]);

  return (
    <div className="h-[10vh] flex items-center justify-center">
      <input
        type="range"
        min={domain.min}
        max={domain.max}
        value={minVal}
        onChange={event => {
          const value = Math.min(Number(event.target.value), maxVal - 1) as number;
          setMinVal(value);
          onChange([new Date(value), new Date(maxVal)]);
        }}
        className="thumb z-[1]"
      />
      <input
        type="range"
        min={domain.min}
        max={domain.max}
        value={maxVal}
        onChange={event => {
          const value = Math.max(Number(event.target.value), minVal + 1) as number;
          setMaxVal(value);
          onChange([new Date(minVal), new Date(value)]);
        }}
        className="thumb z-[2]"
      />
      <div className="relative w-[350px]">
        <div className="absolute bg-gray-300 w-full h-1 border-r-3" />
        <div ref={range} className="absolute bg-indigo-400 h-1 border-r-3" />
        <div className="absolute left-1 text-gray-500 text-xs mt-5">
          {new Date(minVal).toISOString()}
        </div>
        <div className="absolute right-1 text-gray-500 text-xs mt-5">
          {new Date(maxVal).toISOString()}
        </div>
      </div>
    </div>
  );
};
