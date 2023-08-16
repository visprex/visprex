export function transpose<T>(matrix: T[][]): T[][] {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

export function center(array: number[], mean: number): number[] {
    return array.map((value: number) => value - mean);
}

export function log10Transform(array: number[]): number[] {
    return array.map((value: number) => Math.log10(value));
}

export function logETransform(array: number[]): number[] {
    return array.map((value: number) => Math.log(value));
}

export const transformOps:  {[key: string]: (x: number) => number}= {
    "none": (x: number) => x,
    "log10(x)": (x: number) => Math.log10(x),
    "ln(x)": (x: number) => Math.log(x),
}
