import React, { useCallback, useState } from 'react';
import Papa from 'papaparse';

interface ParserProps {
  onDataParsed: (data: Papa.ParseResult<any>) => void;
}

const Parser: React.FC<ParserProps> = ({ onDataParsed }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer?.files[0];
      if (file) {
        Papa.parse(file, {
          complete: onDataParsed,
          header: true,
          dynamicTyping: true,
        });
      }
    },
    [onDataParsed]
  );

  return (
    <div
      className={`drop-zone ${isDragging ? 'drag-over' : ''} className="relative focus:ring-offset-2" block h-40 w-full rounded-lg border-2 border-dashed border-gray-300 bg-gray-200 p-12 text-center hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 14v20c0 4.418 7.163 8 16 8 1.381 0 2.721-.087 4-.252M8 14c0 4.418 7.163 8 16 8s16-3.582 16-8M8 14c0-4.418 7.163-8 16-8s16 3.582 16 8m0 0v14m0-4c0 4.418-7.163 8-16 8S8 28.418 8 24m32 10v6m0 0v6m0-6h6m-6 0h-6" />
        </svg>
        <span className="mt-2 block text-sm font-semibold text-gray-900">Drag and drop a CSV file</span>
    </div>
  );
};

export default Parser;
