import { Value } from "../types/schema";

export enum TransformType {
    None = "x",
    Log10 = "log10(x)",
    Ln = "ln(x)",
    Squared = "x^2",
}

export function transpose(matrix: Value[][]): Value[][] {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

export function log10Transform(array: number[]): number[] {
    return array.map((value: number) => Math.log10(value));
}

export function logETransform(array: number[]): number[] {
    return array.map((value: number) => Math.log(value));
}

export function squaredTransform(array: number[]): number[] {
    return array.map((value: number) => value ** 2);
}

export const transformOps: {[key: string]: (x: number) => number}= {
    "x": (x: number) => x,
    "y": (x: number) => x,
    "x^2": (x: number) => x ** 2,
    "y^2": (x: number) => x ** 2,
    "log10(x)": (x: number) => Math.log10(x),
    "log10(y)": (x: number) => Math.log10(x),
    "ln(x)": (x: number) => Math.log(x),
    "ln(y)": (x: number) => Math.log(x),
}
