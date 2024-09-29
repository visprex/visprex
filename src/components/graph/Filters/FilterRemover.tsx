import React from 'react';
import { Filter, CategoricalFilter, NumberFilter } from "../../../utils/filters";
import { DataType } from "../../../utils/schema";
import { MinusCircleIcon } from '@heroicons/react/24/outline';

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
    <div className='flex'>
      {filters.map((filter, index) => (
        <div className='rounded mr-4 bg-indigo-50' key={index}>
          <div className='flex align-middle'>
            <span>
              {filter.schemaKey} {filter.operator} {displayFilterValue(filter)}
            </span>
            <button onClick={() => onRemoveFilter(index)}>
              <MinusCircleIcon className='h-5 w-5 ml-2 text-indigo-500'/>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FilterRemover;
