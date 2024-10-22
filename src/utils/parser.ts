import { DataType, Schema, CategoricalSchema, NumberSchema, Value } from '../types/schema';
import _ from 'lodash';

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