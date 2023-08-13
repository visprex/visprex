export function transpose<T>(matrix: T[][]): T[][] {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

export function center(array: number[], mean: number): number[] {
    return array.map((value: number) => value - mean);
}

export function logPlusOneTransform(array: number[]): number[] {
    return array.map((value: number) => Math.log(value+1));
}