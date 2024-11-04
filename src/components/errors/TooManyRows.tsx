import React from "react";
import { MAX_ROWS_TO_DISPLAY } from "./constants";


type TooManyRowsProps = {
    rows: number;
};

const TooManyRows: React.FC<TooManyRowsProps> = ({rows}: TooManyRowsProps) => {
    return (
        <div className='mt-4 text-gray-600'>
            Your CSV file has too many rows ({rows}). Please use a file with less than {MAX_ROWS_TO_DISPLAY} rows.
        </div>
    );
};

export default TooManyRows;