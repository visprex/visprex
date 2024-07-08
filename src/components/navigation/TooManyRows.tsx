export const MAX_ROWS_TO_DISPLY = 100000;

type TooManyRowsProps = {
    rows: number;
};

const TooManyRows = ({rows}: TooManyRowsProps) => {
    return (
        <div className='mt-4 text-gray-600'>
            Your CSV file has too many rows ({rows}). Please upload a file with less than {MAX_ROWS_TO_DISPLY} rows.
        </div>
    );
};

export default TooManyRows;