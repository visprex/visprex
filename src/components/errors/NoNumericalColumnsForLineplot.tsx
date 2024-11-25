import React from 'react';

const NoNumericalColumnsForLineplot: React.FC = () => {
    return (
        <div className='mt-4 text-gray-600'>
            No numerical data detected for line plot. Please ensure that <b>at least 1</b> column is of <b>Numerical</b> type.
        </div>
    );
};

export default NoNumericalColumnsForLineplot;