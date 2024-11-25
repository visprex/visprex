import React from 'react';

const NoNumericalColumnsForLineplot: React.FC = () => {
    return (
        <div className='mt-4 text-gray-600'>
            No numerical data detected for line plot. Please ensure that at least one column is of Numerical type.
        </div>
    );
};

export default NoNumericalColumnsForLineplot;