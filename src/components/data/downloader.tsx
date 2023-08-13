import React, { useState } from 'react';
import Papa from 'papaparse';
import { bucketURL, datasets } from './constants';

interface DownloaderProps {
  onDataParsed: (data: Papa.ParseResult<any>) => void;
}

const Downloader: React.FC<DownloaderProps> = ({ onDataParsed }) => {
  const [datasetIdx, setDatasetIdx] = useState<number|null>(null)

  const handleDownload = (idx: number) => {
    Papa.parse(bucketURL + datasets[idx].name, {
        download: true,
        complete: onDataParsed,
        header: true,
        dynamicTyping: true,
      }
    ), [onDataParsed]
  };

  return (
    <>
        <div className="h-12">
        {
          datasets.map((dataset, idx) => (
            <button
              key={idx}
              className={`
                border ${datasetIdx === idx ? 'bg-indigo-500 text-white' : 'border-indigo-500'}
                m-1 rounded-md px-2 py-1 text-sm
                ${datasetIdx === idx ? 'bg-indigo-500' : 'text-indigo-500'}
                ${datasetIdx === idx ? 'opacity-100' : 'opacity-70'}`
              }
              onClick={() => {
                setDatasetIdx(idx);
                handleDownload(idx);
              }}
            >
              {dataset.name}
            </button>
          ))
        }
      </div>
    </>
  );
};

export default Downloader;
