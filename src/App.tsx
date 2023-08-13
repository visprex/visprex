import { useState, useEffect } from 'react'
import { HistogramTransition } from './components/graph/HistogramTransition';
import { Scatterplot }  from './components/graph/Scatterplot';
import { inferNumberSchema, NumberSchema } from './utils/schema';
import { transpose } from './utils/transform';
import Navbar from './components/navigation/Navbar'
import Parser from './components/data/parser';
import Downloader from './components/data/downloader';

export default function App() {
  const [matrix, setMatrix] = useState<any[][]>([])
  // const [papaResult, setPapaResult] = useState<Papa.ParseResult<any> | null>(null);
  const [keys, setKeys] = useState<string[]>([])
  const [schema, setSchema] = useState<NumberSchema[]>([])

  const handleDataParsed = (parsed: Papa.ParseResult<any>) => {
    // setPapaResult(parsed)
    setKeys(Object.keys(parsed.data[0]))
    setMatrix(transpose(parsed.data.map(Object.values)))
  };

  useEffect(() => {
    if (keys.length > 0 && matrix.length > 0) {
      setSchema(inferNumberSchema(keys, matrix))
    }
  }, [keys, matrix])

  return (
    <div className='container mx-auto'>        
      <Navbar/>
        <div>
          <h6 className='mt-4 text-xl text-indigo-500'>Dataset</h6>
          <Downloader onDataParsed={handleDataParsed}/>
          <Parser onDataParsed={handleDataParsed}/>
        </div>
        {schema.length > 0 &&
          <div id='visualise'>
            <h6 className='mt-4 text-xl text-indigo-500'>Histogram</h6>
            <HistogramTransition
              height={400}
              width={1200}
              matrix={matrix}
              keys={keys}
              schema={schema}
            />
            <h6 className='text-xl text-indigo-500'>Scatterplot</h6>
            <Scatterplot
              height={400}
              width={1200}
              keys={keys}
              schema={schema}
              matrix={matrix}
            />
          </div>
        }
    </div>
  );
}
