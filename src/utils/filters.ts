import { DataType, Schema, Value } from "../types/schema";
import { transpose } from "./transform";

export enum Operator {
  Equal = "=",
  NotEqual = "!=",
  GreaterThan = ">",
  GreaterThanOrEqual = ">=",
  LessThan = "<",
  LessThanOrEqual = "<=",
}

export type CategoricalFilter = {
  type: DataType.Categorical;
  schemaKey: string;
  operator: Operator;
  value: string;
};

export type NumberFilter = {
  type: DataType.Number;
  schemaKey: string;
  operator: Operator;
  value: number;
};

export type DateTimeFilter = {
  type: DataType.DateTime;
  schemaKey: string;
  operator: Operator;
  value: string;
};

export type Filter = CategoricalFilter | NumberFilter | DateTimeFilter;

function applyCategoricalFilter(value: string, filter: CategoricalFilter): boolean {
  switch (filter.operator) {
    case Operator.Equal:
      return value === filter.value;
    case Operator.NotEqual:
      return value !== filter.value;
    default:
      return false;
  }
}

function applyNumberFilter(value: number, filter: NumberFilter): boolean {
  switch (filter.operator) {
    case Operator.Equal:
      return value === filter.value;
    case Operator.NotEqual:
      return value !== filter.value;
    case Operator.GreaterThan:
      return value > filter.value;
    case Operator.GreaterThanOrEqual:
      return value >= filter.value;
    case Operator.LessThan:
      return value < filter.value;
    case Operator.LessThanOrEqual:
      return value <= filter.value;
    default:
      return false;
  }
}

function applyDateTimeFilter(value: string, filter: DateTimeFilter): boolean {
  switch (filter.operator) {
    case Operator.GreaterThanOrEqual:
        return new Date(value).getTime() >= new Date(filter.value).getTime();
    case Operator.LessThanOrEqual:
      return new Date(value).getTime() <= new Date(filter.value).getTime();
    default:
      return false;
  }
}

export function filterMatrix(matrix: Value[][], filters: Filter[], schema: Schema[]): Value[][] {
  if (filters.length === 0) {
    return matrix;
  }
  const filteredT = transpose(matrix).filter((row) => {
    return filters.every((f) => {
      const schemaItem = schema.find((schemaItem) => schemaItem.key === f.schemaKey);
      if (schemaItem === undefined) {
        return false;
      }
      const value = row[schemaItem.index];
      if (schemaItem.type === DataType.Categorical) {
        return applyCategoricalFilter(value as string, f as CategoricalFilter)
      }
      if (schemaItem.type === DataType.DateTime) {
        return applyDateTimeFilter(value as string, f as DateTimeFilter);
      }
      return applyNumberFilter(value as number, f as NumberFilter);
    });
  })
  if (filteredT.length === 0) {
    return matrix;
  }
  return transpose(filteredT);
}
