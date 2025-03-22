import { describe, expect, test } from "vitest";
import { inferSchema } from "./parser";
import { DataType, NumberSchema, DateTimeSchema, CategoricalSchema, Value } from "@/schema";

describe("inferSchema", () => {
  test("should infer numerical schema correctly", () => {
    const keys = ["age", "height"];
    const matrix = [
      [25, 30, 35, 40, 45],
      [150, 160, 170, 180, 190]
    ];

    const schema = inferSchema(keys, matrix);
    expect(schema.length).toBe(2);

    schema.forEach((colSchema, index) => {
      expect(colSchema.type).toBe(DataType.Number);
      expect((colSchema as NumberSchema).range.min).toBe(Math.min(...matrix[index]));
      expect((colSchema as NumberSchema).range.max).toBe(Math.max(...matrix[index]));
      expect((colSchema as NumberSchema).mean).toBe(
        matrix[index].reduce((sum, val) => sum + (val as number), 0) / matrix[index].length
      );
    });
  });

  test("should infer categorical schema correctly", () => {
    const keys = ["gender", "color"];
    const matrix = [
      ["Male", "Female", "Male", "Female", "Male"],
      ["Red", "Blue", "Red", "Green", "Blue"]
    ];

    const schema = inferSchema(keys, matrix);
    expect(schema.length).toBe(2);

    schema.forEach((colSchema) => {
      expect(colSchema.type).toBe(DataType.Categorical);
      expect((colSchema as CategoricalSchema).frequencies).toBeTruthy();
    });

    expect((schema[0] as CategoricalSchema).frequencies).toEqual({ Male: 3, Female: 2 });
    expect((schema[1] as CategoricalSchema).frequencies).toEqual({ Red: 2, Blue: 2, Green: 1 });
  });

  test("should infer datetime schema correctly with various formats", () => {
    const keys = ["event_date"];
    const matrix: Value[][] = [
      [
        "2022-01-01", // ISO format
        "2022-06-15 12:30", // Missing seconds
        "2023/03/10 18:45:30", // Slash separator
        "March 5, 2023", // Full month name
        "05-08-2023", // DD-MM-YYYY format
        "2024-02-01T14:05:09Z", // ISO with time & UTC
        "2024/02/01 14:05", // Slash separator, missing seconds
        "2024-02-01T14:05:09+02:00", // ISO with timezone offset
        "01-02-2024 14:00:30", // European format DD-MM-YYYY
        "2024.02.01", // Dots instead of slashes
      ]
    ];

    const schema = inferSchema(keys, matrix);
    expect(schema.length).toBe(1);
    expect(schema[0].type).toBe(DataType.DateTime);

    const dateSchema = schema[0] as DateTimeSchema;
    expect(dateSchema.range.minDateTime).toBe("2022-01-01 00:00:00");
    expect(dateSchema.range.maxDateTime).toBe("2024-02-01 15:05:09");
    expect(dateSchema.frequencies).toBeTruthy();
  });

  test("should handle mixed data types and missing values", () => {
    const keys = ["name", "score", "date"];
    const matrix: Value[][] = [
      ["Alice", "Bob", "Alice", "Charlie"],
      [90, 85, 88, 95],
      ["2022-01-01", "2022-06-15", "2023-08-20", "2024-02-01"],
    ];

    const schema = inferSchema(keys, matrix);
    expect(schema.length).toBe(3);

    expect(schema[0].type).toBe(DataType.Categorical);
    expect((schema[0] as CategoricalSchema).frequencies).toEqual({ Alice: 2, Bob: 1, Charlie: 1, });

    expect(schema[1].type).toBe(DataType.Number);
    expect((schema[1] as NumberSchema).mean).toBeCloseTo((90 + 85 + 88 + 95) / 4, 5);

    expect(schema[2].type).toBe(DataType.DateTime);
    expect((schema[2] as DateTimeSchema).range.minDateTime).toBe("2022-01-01 00:00:00");
    expect((schema[2] as DateTimeSchema).range.maxDateTime).toBe("2024-02-01 00:00:00");
  });

  test("should handle an empty dataset", () => {
    const keys: string[] = [];
    const matrix: Value[][] = [];

    const schema = inferSchema(keys, matrix);
    expect(schema).toEqual([]);
  });
});
