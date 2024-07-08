import React from 'react';

const NotEnoughNumericalColumns: React.FC = () => {
    return (
        <div className='mt-4 text-gray-600'>
            Not enough numerical columns found. Load a CSV file with <span className="font-semibold">at least 2</span> numerical columns in the <span className='font-semibold'>Datasets</span> tab.
        </div>
    );
};

export default NotEnoughNumericalColumns;