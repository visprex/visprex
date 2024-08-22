import React from 'react';
import { Filter, CategoricalFilter, NumberFilter } from "../../../utils/filters";
import { DataType } from "../../../utils/schema";

interface FilterRemoverProps {
  filters: Filter[];
  onRemoveFilter: (index: number) => void;
}

const FilterRemover: React.FC<FilterRemoverProps> = ({ filters, onRemoveFilter }) => {
  const displayFilterValue = (filter: Filter) => {
    if (filter.type === DataType.Categorical) {
      return (filter as CategoricalFilter).value;
    } else if (filter.type === DataType.Number) {
      return (filter as NumberFilter).value;
    }
    return '';
  };

  return (
    <div>
      {filters.map((filter, index) => (
        <div key={index} style={{ marginBottom: '8px' }}>
          <span>
            {filter.schemaKey} {filter.operator} {displayFilterValue(filter)}
          </span>
          <button onClick={() => onRemoveFilter(index)} style={{ marginLeft: '8px' }}>
            Remove
          </button>
        </div>
      ))}
    </div>
  );
};

export default FilterRemover;
