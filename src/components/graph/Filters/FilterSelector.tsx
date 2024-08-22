import React, { useState, useEffect } from 'react';
import { Schema, NumberSchema, CategoricalSchema, DataType, Value } from "../../../utils/schema";
import { Filter, Operator, CategoricalFilter, NumberFilter } from "../../../utils/filters";

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
    if (selectedSchema?.type === DataType.Number) {
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
    if (selectedSchema?.type === DataType.Categorical) {
      const categoricalSchema = selectedSchema as CategoricalSchema;
      setInputValue(Object.keys(categoricalSchema.frequencies)[0]);
    }
  }, [selectedOperator, selectedSchema, selectedSchemaKey]);

  const handleSchemaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const key = e.target.value;
    setSelectedSchemaKey(key);
    setSelectedOperator(Operator.Equal);
    setInputValue('');
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

    const filter: Filter = selectedSchema.type === DataType.Categorical
      ? {
          type: DataType.Categorical,
          schemaKey: selectedSchemaKey,
          operator: selectedOperator,
          value: inputValue as string,
        } as CategoricalFilter
      : {
          type: DataType.Number,
          schemaKey: selectedSchemaKey,
          operator: selectedOperator,
          value: inputValue as number,
        } as NumberFilter;

    onFilterChange(filter);
  };

  return (
    <div>
      <select value={selectedSchemaKey} onChange={handleSchemaChange}>
        {schema.map((s) => (
          <option key={s.key} value={s.key}>
            {s.key}
          </option>
        ))}
      </select>

      <select value={selectedOperator} onChange={handleOperatorChange}>
        {selectedSchema?.type === DataType.Categorical ? (
          <>
            <option value={Operator.Equal}>{Operator.Equal}</option>
            <option value={Operator.NotEqual}>{Operator.NotEqual}</option>
            <option value={Operator.Contains}>{Operator.Contains}</option>
            <option value={Operator.NotContains}>{Operator.NotContains}</option>
          </>
        ) : (
          <>
            <option value={Operator.Equal}>{Operator.Equal}</option>
            <option value={Operator.NotEqual}>{Operator.NotEqual}</option>
            <option value={Operator.GreaterThan}>{Operator.GreaterThan}</option>
            <option value={Operator.GreaterThanOrEqual}>{Operator.GreaterThanOrEqual}</option>
            <option value={Operator.LessThan}>{Operator.LessThan}</option>
            <option value={Operator.LessThanOrEqual}>{Operator.LessThanOrEqual}</option>
          </>
        )}
      </select>

      {selectedSchema?.type === DataType.Categorical ? (
        <select value={inputValue as string} onChange={handleValueChange}>
          {Object.keys((selectedSchema as CategoricalSchema).frequencies).map((freqKey) => (
            <option key={freqKey} value={freqKey}>
              {freqKey}
            </option>
          ))}
        </select>
      ) : (
        <input
          type="number"
          value={inputValue}
          onChange={handleValueChange}
        />
      )}

      <button onClick={handleApplyFilter}>Add filter</button>
    </div>
  );
};

export default FilterSelector;
