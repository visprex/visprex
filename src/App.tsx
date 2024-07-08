import { useState, useEffect, useRef } from 'react'
import { Histogram }  from './components/graph/Histogram/Histogram';
import { Scatterplot }  from './components/graph/Scatterplot/Scatterplot';
import { CorrelationMatrix }  from './components/graph/CorrelationMatrix/CorrelationMatrix';
import { DataType, inferSchema, Schema } from './utils/schema';
import { classNames } from './utils/classnames';
import { transpose } from './utils/transform';
import Navbar from './components/navigation/Navbar';
import NoDatasetSelected from './components/navigation/NoDatasetSelected';
import Dataloader from './components/data/Dataloader';
import DataCard from './components/data/DataCard';
import { ChartBarIcon, CircleStackIcon, CubeTransparentIcon, CalculatorIcon } from '@heroicons/react/24/outline'
import NotEnoughNumericalColumns from './components/navigation/NotEnoughNumericalColumns';

export default function App() {
  const elementRef = useRef<HTMLDivElement | null>(null)
  const [width, setWidth] = useState(0);

  const tabs = [
    {
      name: "Datasets",
      href: "#datasets",
      icon: CircleStackIcon,
    },
    {
      name: "Histogram",
      href: "#histogram",
      icon: ChartBarIcon,
    },
    {
      name: "Scatter Plot",
      href: "#scatterplot",
      icon: CubeTransparentIcon,
    },
    {
      name: "Correlation Matrix",
      href: "#correlationmatrix",
      icon: CalculatorIcon,
    },
  ];

  const [currentTab, setCurrentTab] = useState("Datasets");
  const [matrix, setMatrix] = useState<unknown[][]>([])
  const [keys, setKeys] = useState<string[]>([])
  const [schema, setSchema] = useState<Schema[]>([])

  const handleDataParsed = (parsed: Papa.ParseResult<unknown[]>) => {
    setKeys(Object.keys(parsed.data[0]))
    setMatrix(transpose(parsed.data.map(Object.values)))
  };

  useEffect(() => {
    if (keys.length > 0 && matrix.length > 0) {
      setSchema(inferSchema(keys, matrix))
    }
  }, [keys, matrix])

  useEffect(() => {
    if (elementRef.current) {
      setWidth(elementRef.current.offsetWidth);
    }
  }, []);

  const handleTabClick = (tabName: string) => {
    setCurrentTab(tabName);
  };

  return (
    <div className='w-full'>        
      <Navbar/>
      <div ref={elementRef} className="container mx-auto p-4">
        <div className="border-b border-gray-200">
          <nav className="flex flex-col space-y-4 sm:flex-row sm:space-x-8 sm:space-y-0" aria-label="Tabs">
            {tabs.map((tab) => (
              <a
                key={tab.name}
                href={tab.href}
                className={classNames(
                  tab.name === currentTab
                    ? "border-indigo-500 text-indigo-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  "group inline-flex items-center border-b-2 px-1 py-2 text-sm font-medium"
                )}
                aria-current={tab.name === currentTab ? "page" : undefined}
                onClick={() => handleTabClick(tab.name)}
              >
                <tab.icon
                  className={classNames(
                    tab.name === currentTab
                      ? "text-indigo-500"
                      : "text-gray-400 group-hover:text-gray-500",
                    "-ml-0.5 mr-2 h-5 w-5"
                  )}
                  aria-hidden="true"
                />
                <span>{tab.name}</span>
              </a>
            ))}
          </nav>
        </div>
        <div>
          {currentTab === 'Datasets' && 
            <>
              <Dataloader onDataParsed={handleDataParsed}/>
              {(schema.length > 0 && <DataCard schema={schema} />)}
            </>
          }
          {currentTab === 'Histogram' && (schema.length > 0 ? <Histogram height={450} width={width} matrix={matrix} keys={keys} schema={schema}/> : <NoDatasetSelected/>)}
          {currentTab === 'Scatter Plot' && 
            (schema.length > 0 ?
              schema.filter(s => s.type == DataType.Number).length > 1 ?
                <Scatterplot height={450} width={width} matrix={matrix} keys={keys} schema={schema}/>
                : <NotEnoughNumericalColumns/>
            :
              <NoDatasetSelected/>
            )
          }
          {currentTab === 'Correlation Matrix' && (schema.length > 0 ? <CorrelationMatrix height={450} width={width} matrix={matrix} keys={keys} schema={schema}/> : <NoDatasetSelected/>)}
        </div>
    </div>
  </div>
  );
}

