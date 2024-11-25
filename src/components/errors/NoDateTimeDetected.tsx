import React from 'react';

const NoDateTimeDetected: React.FC = () => {
    return (
        <div className='mt-4 text-gray-600'>
            No DateTime types were detected. Please ensure that at least one column is of DateTime type.
        </div>
    );
};

export default NoDateTimeDetected;