import { DataType, Schema, CategoricalSchema, NumberSchema, DateTimeSchema, Value } from '../types/schema';
import dayjs from 'dayjs';
import _ from 'lodash';

function isDatetime(values: Value[]): boolean {
  return values.every((v) => dayjs(v).isValid())
}

function isNumerical(values: Value[]): boolean {
  return !isNaN(_.mean(values))
}

export function inferSchema(keys: string[], matrix: Value[][]): Schema[] {
  return keys.map((key: string, index: number) => {
    if (isNumerical(matrix[index])) {
      return {
        type: DataType.Number,
        rows: matrix[0].length,
        index,
        key,
        range: {
          min: _.min(matrix[index]),
          max: _.max(matrix[index]),
        },
        mean: _.mean(matrix[index].filter((v) => v !== null && v !== undefined))
      } as NumberSchema
    }
    if (isDatetime(matrix[index])) {
      const values = matrix[index].map((v) => dayjs(v).unix() * 1000)
      return {
        type: DataType.DateTime,
        rows: matrix[0].length,
        index,
        key,
        range: {
          min: _.min(values.filter((v) => v > 0)),
          max: _.max(values.filter((v) => v > 0)),
        },
        frequencies: _.countBy(matrix[index].map((v) => (v === null || v === undefined) ? "N/A" : v))
      } as DateTimeSchema
    }
    return {
      type: DataType.Categorical,
      rows: matrix[0].length,
      index,
      key,
      frequencies: _.countBy(matrix[index].map((v) => (v === null || v === undefined) ? "N/A" : v))
    } as CategoricalSchema
  })
}
