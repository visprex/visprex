import _ from 'lodash';

export enum DataType {
  Number = 'number',
  Categorical = 'categorical',
}

export type NumberSchema = {
  type: DataType.Number,
  rows: number,
  index: number,
  key: string
  range: {
    min: number,
    max: number,
  }
  mean: number
}

export type CategoricalSchema = {
  type: DataType.Categorical,
  rows: number,
  index: number,
  key: string,
  frequencies: {
    [key: string]: number
  }
}

export type Schema = NumberSchema | CategoricalSchema;

export type Value = number | string;

export function inferSchema(keys: string[], matrix: Value[][]): Schema[] {
 return keys.map((key: string, index: number) => {
    let schema: Schema;
    const mean = _.mean(matrix[index])
    isNaN(mean) ? 
      schema = {
        type: DataType.Categorical,
        rows: matrix[0].length,
        index,
        key,
        frequencies: _.countBy(matrix[index].map((v) => (v === null || v === undefined) ? "N/A" : v))
      } as CategoricalSchema
    :
      schema = {
        type: DataType.Number,
        rows: matrix[0].length,
        index,
        key,
        range: {
          min: _.min(matrix[index]),
          max: _.max(matrix[index]),
        },
        mean
      } as NumberSchema
    return schema
 })
}