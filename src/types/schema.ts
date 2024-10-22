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
