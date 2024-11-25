import React from 'react';

const NoDateTimeDetected: React.FC = () => {
    return (
        <div className='mt-4 text-gray-600'>
            No DateTime types were detected. Please ensure that <b>at least 1</b> column is of <b>DateTime</b> type.
        </div>
    );
};

export default NoDateTimeDetected;