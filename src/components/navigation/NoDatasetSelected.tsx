import React from 'react';

const NoDatasetSelected: React.FC = () => {
    return (
        <div className='mt-4 text-gray-600'>
            No data found. Load a CSV file or select from example dataseets in the <span className='font-semibold'>Datasets</span> tab.
        </div>
    );
};

export default NoDatasetSelected;