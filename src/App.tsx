import { useState, useEffect } from 'react'
import Parser from './components/parser'
import { inferSchema, transpose } from './utils'

export default function App() {
  const [papaResult, setPapaResult] = useState<Papa.ParseResult<any> | null>(null);

  const handleDataParsed = (parsed: Papa.ParseResult<any>) => {
    setPapaResult(parsed)
    const schema = inferSchema(parsed.data.slice(0,10))
    console.log(schema)
    const array = transpose(parsed.data.map(Object.values))
    console.log(array);
  };

  return (
    <div className='container mx-auto'>
      <h1 className='font-large'>CSV Parser</h1>
      <Parser onDataParsed={handleDataParsed} />
      {papaResult && (
        <div>
          {papaResult.data.length}
        </div>
      )}
    </div>
  );
}
