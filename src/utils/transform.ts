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

export const transformOps: Record<TransformType, (value: number) => number> = {
    [TransformType.None]: (value: number) => value,
    [TransformType.Log10]: (value: number) => Math.log10(value),
    [TransformType.Log10Plus1]: (value: number) => Math.log10(value+1),
    [TransformType.Ln]: (value: number) => Math.log(value),
    [TransformType.LnPlus1]: (value: number) => Math.log(value+1),
    [TransformType.Squared]: (value: number) => value ** 2,
}
