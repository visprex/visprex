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
      className={`drop-zone ${isDragging ? 'drag-over' : ''} h-40 w-full bg-gray-200`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <p>Drag and drop a CSV file here</p>
    </div>
  );
};

export default Parser;
