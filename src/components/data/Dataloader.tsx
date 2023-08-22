import React, { useState, useCallback } from 'react';
import Papa from 'papaparse';
import { bucketURL, datasets } from './constants';

interface DataloaderProps {
  onDataParsed: (data: Papa.ParseResult<any>) => void;
}

const Dataloader: React.FC<DataloaderProps> = ({ onDataParsed }) => {
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

  const [filename, setFilename] = useState<string>('')
  const handleDataLoad = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      setFilename(file?.name || '')
      if (file) {
        Papa.parse(file, {
          complete: onDataParsed,
          header: true,
          dynamicTyping: true,
          transform: (value) => {
            if (value === '' || value === 'NA' || value === 'NaN') {
              return 0;
            }
            return value
          }
        });
      }
    },
    [onDataParsed]
  );

  return (
    <div id='datasets'>
      <div className="mt-5 flex w-full items-center justify-center">
        <label htmlFor="dropzone-file" className="flex h-32 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
            <div className="flex flex-col items-center justify-center pb-6 pt-5">
                <svg className="mb-4 h-8 w-8 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                </svg>
                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to load your CSV file</span> or drag and drop.</p>
                <p className='mb-1 text-sm text-gray-500'>{filename}</p>
            </div>
            <input id="dropzone-file" type="file" className="hidden" accept=".csv" onChange={handleDataLoad} />
        </label>
      </div>
      <div className="my-3 h-auto">
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
    </div>
    
  );
};

export default Dataloader;
