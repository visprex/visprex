import { useState, useEffect, useRef } from 'react'
import { Histogram }  from './components/graph/Histogram/Histogram';
import { Scatterplot }  from './components/graph/Scatterplot';
import { CorrelationMatrix }  from './components/graph/CorrelationMatrix/CorrelationMatrix';
import { inferNumberSchema, NumberSchema } from './utils/schema';
import { classNames } from './utils/classnames';
import { transpose } from './utils/transform';
import Navbar from './components/navigation/Navbar';
import NoDatasetSelected from './components/navigation/NoDatasetSelected';
import Dataloader from './components/data/Dataloader';
import { ChartBarIcon, CircleStackIcon, CubeTransparentIcon, CalculatorIcon } from '@heroicons/react/24/outline'

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
      name: "Scatterplot",
      href: "#scatterplot",
      icon: CubeTransparentIcon,
    },
    {
      name: "CorrelationMatrix",
      href: "#correlationmatrix",
      icon: CalculatorIcon,
    },
  ];

  const [currentTab, setCurrentTab] = useState("Datasets");
  const [matrix, setMatrix] = useState<any[][]>([])
  const [keys, setKeys] = useState<string[]>([])
  const [schema, setSchema] = useState<NumberSchema[]>([])

  const handleDataParsed = (parsed: Papa.ParseResult<any>) => {
    setKeys(Object.keys(parsed.data[0]))
    setMatrix(transpose(parsed.data.map(Object.values)))
    setCurrentTab('Histogram')
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

  const handleTabClick = (tabName: string) => {
    setCurrentTab(tabName);
  };

  return (
    <div ref={elementRef} className='container mx-auto w-full'>        
      <Navbar/>
      <div className="mx-auto w-full p-4">
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
                  "group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium"
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
          {currentTab === 'Datasets' && <Dataloader onDataParsed={handleDataParsed}/>}
          {currentTab === 'Histogram' && (schema.length > 0 ? <Histogram height={450} width={width} matrix={matrix} keys={keys} schema={schema}/> : <NoDatasetSelected/>)}
          {currentTab === 'Scatterplot' && (schema.length > 0 ? <Scatterplot height={450} width={width} matrix={matrix} keys={keys} schema={schema}/> : <NoDatasetSelected/>)}
          {currentTab === 'CorrelationMatrix' && (schema.length > 0 ? <CorrelationMatrix height={450} width={width} matrix={matrix} keys={keys} schema={schema}/> : <NoDatasetSelected/>)}
        </div>
    </div>
  </div>
  );
}
