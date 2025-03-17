import { describe, expect, test } from "vitest";
import { betaFunction, logGamma, regularizedIncompleteBeta, tDistributionCDF } from "./distributions";

describe("Beta Function (B(a, b))", () => {
  test("should compute correct Beta function values", () => {
    expect(betaFunction(1, 1)).toBeCloseTo(1, 8);
    expect(betaFunction(2, 2)).toBeCloseTo(1 / 6, 8);
    expect(betaFunction(0.5, 0.5)).toBeCloseTo(Math.PI, 8);
  });

  test("should throw an error for non-positive inputs", () => {
    expect(() => betaFunction(-1, 2)).toThrow("Beta function parameters must be positive.");
    expect(() => betaFunction(2, -1)).toThrow("Beta function parameters must be positive.");
    expect(() => betaFunction(0, 2)).toThrow("Beta function parameters must be positive.");
  });
});

describe("Log Gamma Function (logΓ(x))", () => {
  test("should compute logGamma values correctly", () => {
    expect(logGamma(1)).toBeCloseTo(0, 8);
    expect(logGamma(2)).toBeCloseTo(0, 8);
    expect(logGamma(3)).toBeCloseTo(Math.log(2), 8);
    expect(logGamma(5)).toBeCloseTo(Math.log(24), 8);
  });

  test("should handle large x values without numerical instability", () => {
    expect(logGamma(100)).toBeCloseTo(359.134, 3);
  });
});

describe("Regularized Incomplete Beta Function", () => {
  test("should compute correct values for valid inputs", () => {
    expect(regularizedIncompleteBeta(0.5, 2, 2)).toBeCloseTo(0.5, 8);
    expect(regularizedIncompleteBeta(0.25, 2, 2)).toBeCloseTo(0.15625, 8);
  });

  test("should throw an error for invalid x values", () => {
    expect(() => regularizedIncompleteBeta(-0.1, 2, 2)).toThrow("x must be in the range [0,1]");
    expect(() => regularizedIncompleteBeta(1.1, 2, 2)).toThrow("x must be in the range [0,1]");
  });
});


describe("Student's t-distribution CDF", () => {
  test("should compute correct probabilities", () => {
    expect(tDistributionCDF(0, 1)).toBeCloseTo(0.5, 8);
    expect(tDistributionCDF(1, 10)).toBeCloseTo(0.75, 8);
    expect(tDistributionCDF(-1, 10)).toBeCloseTo(0.25, 8);
  });

  test("should throw an error for non-positive degrees of freedom", () => {
    expect(() => tDistributionCDF(1, 0)).toThrow("Degrees of freedom must be positive.");
    expect(() => tDistributionCDF(1, -2)).toThrow("Degrees of freedom must be positive.");
  });
});
