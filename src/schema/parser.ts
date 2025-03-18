import { DataType, Schema, CategoricalSchema, NumberSchema, DateTimeSchema, Value } from './schema';
import dayjs from 'dayjs';

function mean(values: number[]): number {
  if (values.length === 0) return NaN;
  return values.reduce((sum, val) => sum + val, 0) / values.length;
}

function countBy<T>(array: T[]): Record<string, number> {
  return array.reduce((acc, val) => {
    const key = String(val);
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
}

function isDatetime(values: Value[]): boolean {
  return values.every((v) => dayjs(v).isValid());
}

function isNumerical(values: Value[]): boolean {
  return !isNaN(mean(values as number[]));
}

export function inferSchema(keys: string[], matrix: Value[][]): Schema[] {
  return keys.map((key: string, index: number) => {
    if (isNumerical(matrix[index])) {
      const values = matrix[index].filter((v) => v !== null && v !== undefined) as number[];
      return {
        type: DataType.Number,
        rows: matrix[0].length,
        index,
        key,
        range: {
          min: Math.min(...values),
          max: Math.max(...values),
        },
        mean: mean(values)
      } as NumberSchema;
    }

    if (isDatetime(matrix[index])) {
      const values = matrix[index].map((v) => dayjs(v).unix() * 1000);
      return {
        type: DataType.DateTime,
        rows: matrix[0].length,
        index,
        key,
        range: {
          minUnix: Math.min(...values.filter((v) => v > 0)),
          maxUnix: Math.max(...values.filter((v) => v < dayjs().unix() * 1000)),
          minDateTime: dayjs(Math.min(...values.filter((v) => v > 0))).format("YYYY-MM-DD HH:mm:ss"),
          maxDateTime: dayjs(Math.max(...values.filter((v) => v < dayjs().unix() * 1000))).format("YYYY-MM-DD HH:mm:ss"),
        },
        frequencies: countBy(matrix[index].map((v) => (v === null || v === undefined || v === "") ? "N/A" : v))
      } as DateTimeSchema;
    }

    return {
      type: DataType.Categorical,
      rows: matrix[0].length,
      index,
      key,
      frequencies: countBy(matrix[index].map((v) => (v === null || v === undefined) ? "N/A" : v))
    } as CategoricalSchema;
  });
}
