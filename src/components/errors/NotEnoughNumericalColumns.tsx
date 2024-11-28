import React from 'react';

const NotEnoughNumericalColumns: React.FC = () => {
    return (
        <div className='mt-4 text-gray-600'>
            Not enough numerical columns found. Load a CSV file with <b>at least 2</b> numerical columns in the <b>Datasets</b> tab.
        </div>
    );
};

export default NotEnoughNumericalColumns;