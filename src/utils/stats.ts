import { Schema, NumberSchema, DataType } from './schema';

export type Correlation = {
    x: string,
    y: string,
    coef: number,
};

export function calculateCorrelations(matrix: unknown[][], schema: Schema[]): Correlation[] {
    const nCols = matrix.length;
    const nRows = matrix[0].length;
    const correlations: Correlation[] = [];
    const stds: number[] = [];

    for (let col = 0; col < nCols; col++) {
        let sum = 0;
        for (let row = 0; row < nRows; row++) {
            if (typeof matrix[col][row] === DataType.Number) {
                const diff = (matrix[col][row] as number) - (schema[col] as NumberSchema).mean;
                sum += diff * diff;
            }
        }
        stds[col] = Math.sqrt(sum);
    }

    for (let colX = 0; colX < nCols; colX++) {
        for (let colY = 0; colY < nCols; colY++) {
            if (colX !== colY) {
                let covariance = 0;
                for (let row = 0; row < nRows; row++) {
                    if (typeof matrix[colX][row] === DataType.Number && typeof matrix[colY][row] === DataType.Number) {
                        const diffX = (matrix[colX][row] as number) - (schema[colX] as NumberSchema).mean;
                        const diffY = (matrix[colY][row] as number) - (schema[colY] as NumberSchema).mean;
                        covariance += diffX * diffY;
                    }
                }
                const coef = covariance / (stds[colX] * stds[colY]);
                correlations.push({
                    x: schema[colX].key,
                    y: schema[colY].key,
                    coef,
                });
            } else {
                correlations.push({
                    x: schema[colX].key,
                    y: schema[colY].key,
                    coef: 1,
                });
            }
        }
    }

    return correlations;
}
