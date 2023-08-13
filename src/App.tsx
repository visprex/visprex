import { useState, useEffect, useRef } from 'react'
import { HistogramTransition } from './components/graph/HistogramTransition';
import { Scatterplot }  from './components/graph/Scatterplot';
import { inferNumberSchema, NumberSchema } from './utils/schema';
import { transpose } from './utils/transform';
import Navbar from './components/navigation/Navbar';
import Dataloader from './components/data/Dataloader';

export default function App() {
  const elementRef = useRef<HTMLDivElement | null>(null)
  const [width, setWidth] = useState(0);

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

  useEffect(() => {
    if (elementRef.current) {
      setWidth(elementRef.current.offsetWidth);
    }
  }, []);

  return (
    <div ref={elementRef} className='container mx-auto w-full'>        
      <Navbar/>
        <div>
          <h6 className='mt-4 text-xl text-indigo-500'>Dataset</h6>
          <Dataloader onDataParsed={handleDataParsed}/>
        </div>
        {schema.length > 0 &&
          <div id='visualise'>
            <h6 className='mt-4 text-xl text-indigo-500'>Histogram</h6>
            <HistogramTransition
              height={400}
              width={width}
              matrix={matrix}
              keys={keys}
              schema={schema}
            />
            <h6 className='text-xl text-indigo-500'>Scatterplot</h6>
            <Scatterplot
              height={400}
              width={width}
              keys={keys}
              schema={schema}
              matrix={matrix}
            />
          </div>
        }
    </div>
  );
}
