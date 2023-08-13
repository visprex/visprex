import _ from 'lodash';

export type NumberSchema = {
  index: number,
  key: string
  range: {
    min: number,
    max: number,
  }
  mean: number
}

export function inferNumberSchema(keys: string[], matrix: number[][]): NumberSchema[] {
 return keys.map((key: string, index: number) => (
    {
      index,
      key,
      range: {
        min: _.min(matrix[index]),
        max: _.max(matrix[index]),
      },
      mean: _.mean(matrix[index])
    } as NumberSchema
  ))
}