export enum DataType {
  Number = 'Numerical',
  Categorical = 'Categorical',
  DateTime = 'DateTime'
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

export type DateTimeSchema = {
  type: DataType.DateTime,
  rows: number,
  index: number,
  key: string
  range: {
    minUnix: number,
    maxUnix: number,
    minDateTime: string,
    maxDateTime: string,
  }
  frequencies: {
    [key: string]: number
  }
}

export type Schema = NumberSchema | CategoricalSchema | DateTimeSchema;

export type Value = number | string;
