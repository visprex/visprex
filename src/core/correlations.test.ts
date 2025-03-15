import { describe, expect, test } from "vitest";
import { calculateCorrelations } from "./correlations";
import { Schema, DataType, Value } from "@/schema";

describe("calculateCorrelations", () => {
  test("should calculate correlations correctly for a simple dataset", () => {
    const matrix: Value[][] = [
      [1, 2, 3, 4, 5],
      [2, 4, 6, 8, 10],
      [5, 3, 1, -1, -3],
    ];

    const schema: Schema[] = [
      { key: "Feature1", mean: 3, type: DataType.Number, rows: 5, index: 0, range: {min: 1, max: 5} },
      { key: "Feature2", mean: 6, type: DataType.Number, rows: 5, index: 1, range: { min: 2, max: 10 } },
      { key: "Feature3", mean: 1, type: DataType.Number, rows: 5, index: 2, range: { min: -3, max: 5 } },
    ];

    const result = calculateCorrelations(matrix, schema);

    const expected = [
      { x: "Feature1", y: "Feature1", coef: 1 },
      { x: "Feature1", y: "Feature2", coef: 1 },
      { x: "Feature1", y: "Feature3", coef: -1 },
      { x: "Feature2", y: "Feature1", coef: 1 },
      { x: "Feature2", y: "Feature2", coef: 1 },
      { x: "Feature2", y: "Feature3", coef: -1 },
      { x: "Feature3", y: "Feature1", coef: -1 },
      { x: "Feature3", y: "Feature2", coef: -1 },
      { x: "Feature3", y: "Feature3", coef: 1 },
    ];

    expect(result.length).toBe(expected.length);

    result.forEach((correlation, i) => {
      expect(correlation.x).toBe(expected[i].x);
      expect(correlation.y).toBe(expected[i].y);
      expect(correlation.coef).toBeCloseTo(expected[i].coef);
    });
  });

  test("should handle independent columns correctly", () => {
    const matrix: Value[][] = [
      [1, 2, 3, 4, 5],
      [10, 10, 10, 10, 10],
    ];

    const schema: Schema[] = [
      { key: "X", mean: 3, type: DataType.Number, rows: 5, index: 0, range: { min: 1, max: 5 } },
      { key: "Y", mean: 10, type: DataType.Number, rows: 5, index: 1, range: { min: 10, max: 10 } },
    ];

    const result = calculateCorrelations(matrix, schema);
    
    expect(result.length).toBe(4);
    expect(result[0]).toEqual({ x: "X", y: "X", coef: 1 });
    expect(result[1].x).toBe("X");
    expect(result[1].y).toBe("Y");
    expect(isNaN(result[1].coef)).toBe(true);
  });
});
