import { useState, useEffect } from 'react'
import Parser from './components/parser'
import { transpose } from './utils'
import { HistogramTransition } from './components/graph/HistogramTransition';
import { inferNumberSchema, NumberSchema } from './utils';
import Navbar from './components/Navbar'
import Scatterplot  from './components/graph/Scatterplot';

export default function App() {
  const [matrix, setMatrix] = useState<any[][]>([])
  const [papaResult, setPapaResult] = useState<Papa.ParseResult<any> | null>(null);
  const [keys, setKeys] = useState<string[]>([])
  const [schema, setSchema] = useState<NumberSchema[]>([])

  const handleDataParsed = (parsed: Papa.ParseResult<any>) => {
    setPapaResult(parsed)
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
      <Parser onDataParsed={handleDataParsed} />
      {schema.length > 0 && (
        <>
          <HistogramTransition
            height={400}
            width={1200}
            matrix={matrix}
            keys={keys}
            schema={schema}
          />
          <Scatterplot
            height={400}
            width={1200}
            keys={keys}
            schema={schema}
            matrix={matrix}
          />
        </>
      )}
    </div>
  );
}
