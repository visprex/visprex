import { useCallback, useEffect, useState, useRef } from "react";


interface DateRangeSelectorProps {
  min: number;
  max: number;
}

export const DateRangeSelector = ({ min, max }: DateRangeSelectorProps) => {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef(min);
  const maxValRef = useRef(max);
  const range = useRef<HTMLDivElement>(null);

  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);    

  return (
    <div className="w-[500px]">
      <div ref={range} />
      <div className="flex justify-between align-middle">
        <span className="text-sm text-gray-500">from</span>
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={event => {
            const value = Math.min(Number(event.target.value), maxVal - 1);
            setMinVal(value);
            minValRef.current = value;
          }}
          className={"border-0 bg-indigo-100 appearance-none rounded-full cursor-pointer h-6 w-48 mt-[4px] relative"}
        />
        <span className="text-sm text-gray-500">to</span>
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={event => {
            const value = Math.max(Number(event.target.value), minVal + 1);
            setMaxVal(value);
            maxValRef.current = value;
          }}
          className={"border-0 bg-indigo-100 appearance-none rounded-full cursor-pointer h-6 w-48 mt-[4px] relative"}
        />
      </div>
      <div className="flex justify-between">
        <span className="text-sm text-gray-500">{(new Date(minVal)).toISOString()}</span>
        <span className="text-sm text-gray-500">{(new Date(maxVal)).toISOString()}</span>
      </div>
    </div>
  );
};
