import { Value } from "../types/schema";

export enum TransformType {
    None = "x",
    Log10 = "log10(x)",
    Log10Plus1 = "log10(x+1)",
    Ln = "ln(x)",
    LnPlus1 = "ln(x+1)",
    Squared = "x²",
}

export function transpose(matrix: Value[][]): Value[][] {
    return matrix[0].map((_, colIndex) => matrix.map(row => row[colIndex]));
}

export function log10Transform(array: number[]): number[] {
    return array.map((value: number) => Math.log10(value));
}

export function log10Plus1Transform(array: number[]): number[] {
    return array.map((value: number) => Math.log10(value+1));
}

export function logETransform(array: number[]): number[] {
    return array.map((value: number) => Math.log(value));
}

export function logEPlus1Transform(array: number[]): number[] {
    return array.map((value: number) => Math.log(value+1));
}

export function squaredTransform(array: number[]): number[] {
    return array.map((value: number) => value ** 2);
}

export const transformOps: {[key: string]: (x: number) => number} = {
    "x": (x: number) => x,
    "y": (x: number) => x,
    "x²": (x: number) => x ** 2,
    "y²": (x: number) => x ** 2,
    "log10(x)": (x: number) => Math.log10(x),
    "log10(x+1)": (x: number) => Math.log10(x+1),
    "log10(y)": (x: number) => Math.log10(x),
    "log10(y+1)": (x: number) => Math.log10(x+1),
    "ln(x)": (x: number) => Math.log(x),
    "ln(x+1)": (x: number) => Math.log(x+1),
    "ln(y)": (x: number) => Math.log(x),
    "ln(y+1)": (x: number) => Math.log(x+1),
}
