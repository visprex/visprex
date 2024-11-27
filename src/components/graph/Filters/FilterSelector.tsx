import React, { useState, useEffect } from 'react';
import { Schema, NumberSchema, CategoricalSchema, DateTimeSchema, DataType, Value } from "../../../types/schema";
import { Filter, Operator, CategoricalFilter, NumberFilter, DateTimeFilter } from "../../../utils/filters";
import { PlusCircleIcon } from '@heroicons/react/24/outline';

interface FilterSelectorProps {
  schema: Schema[];
  onFilterChange: (filter: Filter) => void;
}

const FilterSelector: React.FC<FilterSelectorProps> = ({ schema, onFilterChange }) => {
  const [selectedSchemaKey, setSelectedSchemaKey] = useState<string>(schema[0]?.key || '');
  const [selectedOperator, setSelectedOperator] = useState<Operator>(Operator.Equal);
  const [inputValue, setInputValue] = useState<Value>('');

  const selectedSchema = schema.find((s) => s.key === selectedSchemaKey);

  useEffect(() => {
    if (selectedSchema?.type === DataType.Number || selectedSchema?.type === DataType.DateTime) {
      const numberSchema = selectedSchema as NumberSchema;
      let defaultValue: number;

      switch (selectedOperator) {
        case Operator.Equal:
        case Operator.GreaterThan:
        case Operator.GreaterThanOrEqual:
          defaultValue = numberSchema.range.min;
          break;
        case Operator.LessThan:
        case Operator.LessThanOrEqual:
          defaultValue = numberSchema.range.max;
          break;
        default:
          defaultValue = numberSchema.range.min;
      }
      setInputValue(defaultValue);
    }
    if (selectedSchema?.type === DataType.DateTime) {
      const dateTimeSchema = selectedSchema as DateTimeSchema;
      let defaultValue: string;

      switch (selectedOperator) {
        case Operator.GreaterThanOrEqual:
          defaultValue = dateTimeSchema.range.minDateTime;
          break;
        case Operator.LessThanOrEqual:
          defaultValue = dateTimeSchema.range.maxDateTime;
          break;
        default:
          defaultValue = dateTimeSchema.range.minDateTime;
      }
      setInputValue(defaultValue);
    }
    if (selectedSchema?.type === DataType.Categorical) {
      const categoricalSchema = selectedSchema as CategoricalSchema;
      if (!inputValue || !Object.keys(categoricalSchema.frequencies).includes(inputValue as string)) {
        setInputValue(Object.keys(categoricalSchema.frequencies)[0]);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOperator, selectedSchema, selectedSchemaKey]);

  const handleSchemaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value;
    setSelectedSchemaKey(key);
    setSelectedOperator(Operator.Equal);

    const newSchema = schema.find((s) => s.key === key);
    if (newSchema?.type === DataType.Categorical) {
      const categoricalSchema = newSchema as CategoricalSchema;
      setInputValue(Object.keys(categoricalSchema.frequencies)[0]);
    } else {
      setInputValue('');
    }
  };

  const handleOperatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOperator(e.target.value as Operator);
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = selectedSchema?.type === DataType.Number ? parseFloat(e.target.value) : e.target.value;
    setInputValue(value);
  };

  const handleApplyFilter = () => {
    if (!selectedSchema) return;
    let filter: Filter;

    switch (selectedSchema.type) {
      case DataType.Categorical:
        filter = {
            type: DataType.Categorical,
            schemaKey: selectedSchemaKey,
            operator: selectedOperator,
            value: inputValue as string,
        } as CategoricalFilter
        break;
      case DataType.Number:
        filter = {
          type: DataType.Number,
          schemaKey: selectedSchemaKey,
          operator: selectedOperator,
          value: inputValue as number,
        } as NumberFilter;
        break;
      case DataType.DateTime:
        filter = {
          type: DataType.DateTime,
          schemaKey: selectedSchemaKey,
          operator: selectedOperator,
          value: inputValue as string,
        } as DateTimeFilter;
        break;
      default:
        return;
    }
    onFilterChange(filter);
  };

  return (
    <div className='flex flex-wrap align-middle'>
      <select className='border border-gray-300 rounded-md p-1 w-1/3 lg:w-auto' value={selectedSchemaKey} onChange={handleSchemaChange}>
        {schema.map((s) => (
          <option key={s.key} value={s.key}>
            {s.key}
          </option>
        ))}
      </select>
      <select value={selectedOperator} onChange={handleOperatorChange}>
        {
          selectedSchema?.type === DataType.Categorical ?
          (
            <>
              <option value={Operator.Equal}>{Operator.Equal}</option>
              <option value={Operator.NotEqual}>{Operator.NotEqual}</option>
            </>
          ) : selectedSchema?.type === DataType.DateTime ?
          (
            <>
              <option value={Operator.GreaterThanOrEqual}>{Operator.GreaterThanOrEqual}</option>
              <option value={Operator.LessThanOrEqual}>{Operator.LessThanOrEqual}</option>
            </>
          ) : 
          (
            <>
              <option value={Operator.Equal}>{Operator.Equal}</option>
              <option value={Operator.NotEqual}>{Operator.NotEqual}</option>
              <option value={Operator.GreaterThan}>{Operator.GreaterThan}</option>
              <option value={Operator.GreaterThanOrEqual}>{Operator.GreaterThanOrEqual}</option>
              <option value={Operator.LessThan}>{Operator.LessThan}</option>
              <option value={Operator.LessThanOrEqual}>{Operator.LessThanOrEqual}</option>
            </>
          )
        }
      </select>
      {
        selectedSchema?.type === DataType.Categorical ?
        (
          <select className='border border-gray-300 rounded-md p-1 w-1/3 lg:w-auto' value={inputValue as string} onChange={handleValueChange}>
            {Object.keys((selectedSchema as CategoricalSchema).frequencies).map((freqKey) => (
              <option key={freqKey} value={freqKey}>
                {freqKey}
              </option>
            ))}
          </select>
        ) : selectedSchema?.type === DataType.DateTime ?
        (
          <input
            className='border border-gray-300 rounded-md p-1 w-1/3 lg:w-auto'
            type="datetime-local"
            value={inputValue}
            onChange={handleValueChange}
          />
        ) :
        (
          <input
            className='border border-gray-300 rounded-md p-1 w-1/3 lg:w-auto'
            type="number"
            value={inputValue as number}
            onChange={handleValueChange}
          />
        )
      }
      <button onClick={handleApplyFilter}><PlusCircleIcon className="text-indigo-500 ml-2 h-6 w-6"/></button>
    </div>
  );
};

export default FilterSelector;
