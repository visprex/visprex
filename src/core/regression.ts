import { transpose, multiply, inverse, vectorToMatrix, flatten } from "./matrix";

export type LinearRegressionResult = {
  coefficients: number[];
  standardErrors: number[];
  confidenceIntervals: number[][];
  zScores: number[];
}

/**
 * Performs Ordinary Least Squares (OLS) Linear Regression.
 *
 * @param {number[][]} X - The independent variable(s) matrix (features).
 * @param {number[]} y - The dependent variable (target vector).
 * @param {0.90 | 0.95 | 0.99} [confidenceLevel=0.95] - Confidence level for confidence intervals (default: 95%).
 * @param {boolean} [addIntercept=true] - Whether to add an intercept term (default: true).
 * @returns {{
 *   coefficients: number[],
 *   standardErrors: number[],
 *   confidenceIntervals: number[][],
 *   zScores: number[]
 * }} Regression results containing coefficients, standard errors, confidence intervals, and Z-scores.
 * @throws {Error} If the matrix inversion fails (e.g. singular matrix).
 */
export function linearRegression(
  X: number[][],
  y: number[],
  confidenceLevel: 0.90 | 0.95 | 0.99 = 0.95,
  addIntercept: boolean = true
): LinearRegressionResult {
  const n = X.length;
  const p = X[0].length;

  const _X = addIntercept ? X.map(row => [1, ...row]) : X;
  const _y = vectorToMatrix(y);

  const Xt = transpose(_X);
  const XtX = multiply(Xt, _X);
  const XtXInv = inverse(XtX);
  if (!XtXInv) throw new Error("Matrix inversion failed.");

  // Compute coefficients: β = (X'X)^-1 * X' * y
  const XtY = multiply(Xt,_y);
  const beta = multiply(XtXInv, XtY);
  const betaFlat = flatten(beta);

  // Compute residuals: e = y - Xβ
  const pred = multiply(_X, beta);
  const residuals = y.map((yi, i) => yi - pred[i][0]);

  // Compute variance of residual: σ² = SSE / (n - p)
  const SSE = residuals.reduce((sum, e) => sum + e * e, 0);
  const sigmaSquared = SSE / (n - (p + (addIntercept ? 1 : 0)));

  // Compute standard errors: SE(β) = sqrt(diag((X'X)^-1) * σ²)
  const standardErrors = XtXInv.map((row, i) => Math.sqrt(row[i] * sigmaSquared));

  // Pre-computed Z-critical values
  const zCriticalValues: Record<number, number> = {
    0.90: 1.645,
    0.95: 1.96,
    0.99: 2.576
  };

  // Compute confidence intervals: CI = β ± Z * SE(β)
  const zCritical = zCriticalValues[confidenceLevel];
  const confidenceIntervals = betaFlat.map((b, i) => [
    b - zCritical * standardErrors[i],
    b + zCritical * standardErrors[i]
  ]);

  // Compute Z-scores: Z = β / SE(β)
  const zScores = betaFlat.map((b, i) => b / standardErrors[i]);

  return {
    coefficients: betaFlat,
    standardErrors,
    confidenceIntervals,
    zScores
  };
}
