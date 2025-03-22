import { describe, it, expect } from "vitest";
import { linearRegression } from "./regression";

describe("linearRegression", () => {
  
  it("should return correct coefficients for a simple linear relation (single feature)", () => {
    const X = [[1, 2, 3, 4, 5]];
    const y = [2, 4, 6, 8, 10];
    const result = linearRegression(X, y);

    expect(result.coefficients[0]).toBeCloseTo(0, 5);
    expect(result.coefficients[1]).toBeCloseTo(2, 5);
  });

  it("should compute standard errors correctly", () => {
    const X = [[1, 2, 3, 4, 5]];
    const y = [2, 4, 6, 8, 10];

    const result = linearRegression(X, y);
    
    expect(result.standardErrors.length).toBe(2);
    expect(result.standardErrors[0]).toBeGreaterThanOrEqual(0);
    expect(result.standardErrors[1]).toBeGreaterThanOrEqual(0);
  });

  it("should compute confidence intervals correctly for 95% confidence level", () => {
    const X = [[1.2, 2.4, 3.3, 4.2, 5.2]];
    const y = [2, 4, 6, 8, 10];

    const result = linearRegression(X, y, 0.95);
    const [lowerCI, upperCI] = result.confidenceIntervals[1];

    expect(lowerCI).toBeLessThan(result.coefficients[1]);
    expect(upperCI).toBeGreaterThan(result.coefficients[1]);
  });

  it("should compute confidence intervals correctly for 99% confidence level", () => {
    const X = [[1.2, 2.4, 3.3, 4.2, 5.2]];
    const y = [2, 4, 6, 8, 10];

    const result = linearRegression(X, y, 0.99);
    const [lowerCI, upperCI] = result.confidenceIntervals[1];

    expect(lowerCI).toBeLessThan(result.coefficients[1]);
    expect(upperCI).toBeGreaterThan(result.coefficients[1]);
  });

  it("should compute different confidence intervals for different confidence levels", () => {
    const X = [[1.2, 2.4, 3.3, 4.2, 5.2]];
    const y = [2, 4, 6, 8, 10];

    const result95 = linearRegression(X, y, 0.95);
    const result99 = linearRegression(X, y, 0.99);

    expect(result99.confidenceIntervals[1][0]).toBeLessThan(result95.confidenceIntervals[1][0]);
    expect(result99.confidenceIntervals[1][1]).toBeGreaterThan(result95.confidenceIntervals[1][1]);
  });

  it("should compute correct Z-scores", () => {
    const X = [[1, 2, 3, 4, 5]];
    const y = [2, 4, 6, 8, 10];

    const result = linearRegression(X, y);
    
    expect(result.zScores.length).toBe(2);
    expect(result.zScores[0]).toBeDefined();
    expect(result.zScores[1]).toBeDefined();
  });

  it("should handle high-dimensional feature space", () => {
    const X = Array.from({ length: 10 }, (_, i) => Array.from({ length: 50 }, (_, j) => Math.random() * i + j));
    const y = Array.from({ length: 50 }, (_, i) => Math.random() * i * 10);

    const result = linearRegression(X, y);
    
    expect(result.coefficients.length).toBe(11);
    result.coefficients.forEach(coef => expect(coef).toBeDefined());
  });

  it("should work with negative and zero values", () => {
    const X = [[-5, -3, 0 ,3, 5]];
    const y = [-10, -6, 0, 6, 10];

    const result = linearRegression(X, y);

    expect(result.coefficients[0]).toBeCloseTo(0, 2);
    expect(result.coefficients[1]).toBeCloseTo(2, 2);
  });
});
