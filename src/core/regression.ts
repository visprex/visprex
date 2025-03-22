import { transpose, multiply, inverse, vectorToMatrix, flatten } from "./matrix";

export type LinearRegressionResult = {
  coefficients: number[];
  standardErrors: number[];
  confidenceIntervals: number[][];
  zScores: number[];
  pValues: number[];
  rSquared: number;
};

/**
 * Adds an intercept column to the design matrix if required.
 * 
 * @param {number[][]} X - The feature matrix (shape: features × samples).
 * @param {boolean} addIntercept - Whether to add an intercept term.
 * @returns {number[][]} - The design matrix with or without intercept.
 */
function prepareDesignMatrix(X: number[][], addIntercept: boolean): number[][] {
  const n = X[0].length;
  return transpose(addIntercept ? [Array(n).fill(1), ...X] : X);
}

/**
 * Computes regression coefficients using the Normal Equation.
 * 
 * @param {number[][]} X - Design matrix.
 * @param {number[]} y - Target vector.
 * @returns {number[]} - Flattened coefficient vector.
 * @throws {Error} If matrix inversion fails.
 */
function computeCoefficients(X: number[][], y: number[]): number[] {
  const Xt = transpose(X);
  const XtX = multiply(Xt, X);
  const XtXInv = inverse(XtX);
  if (!XtXInv) throw new Error("Matrix inversion failed.");
  const XtY = multiply(Xt, vectorToMatrix(y));
  return flatten(multiply(XtXInv, XtY));
}

/**
 * Generates predictions based on the design matrix and coefficients.
 * 
 * @param {number[][]} X - Design matrix.
 * @param {number[]} coefficients - Model coefficients.
 * @returns {number[]} - Predicted values.
 */
function predict(X: number[][], coefficients: number[]): number[] {
  const predMatrix = multiply(X, vectorToMatrix(coefficients));
  return predMatrix.map(row => row[0]);
}

/**
 * Calculates residuals (errors) between actual and predicted values.
 * 
 * @param {number[]} y - Actual target values.
 * @param {number[]} yPred - Predicted target values.
 * @returns {number[]} - Residuals.
 */
function computeResiduals(y: number[], yPred: number[]): number[] {
  return y.map((val, idx) => val - yPred[idx]);
}

/**
 * Calculates standard errors of the coefficients.
 * 
 * @param {number[][]} X - Design matrix.
 * @param {number[]} residuals - Residuals from the model.
 * @param {boolean} addIntercept - Whether intercept was included.
 * @returns {number[]} - Standard errors for each coefficient.
 * @throws {Error} If matrix inversion fails.
 */
function computeStandardErrors(X: number[][], residuals: number[], addIntercept: boolean): number[] {
  const n = X.length;
  const p = X[0].length;
  const SSE = residuals.reduce((sum, e) => sum + e * e, 0);
  const sigmaSquared = SSE / (n - (p + (addIntercept ? 1 : 0)));

  const Xt = transpose(X);
  const XtX = multiply(Xt, X);
  const XtXInv = inverse(XtX);
  if (!XtXInv) throw new Error("Matrix inversion failed (again).");

  return XtXInv.map((row, i) => Math.sqrt(row[i] * sigmaSquared));
}

/**
 * Computes confidence intervals for each coefficient.
 * 
 * @param {number[]} coefficients - Model coefficients.
 * @param {number[]} standardErrors - Standard errors.
 * @param {number} confidenceLevel - Desired confidence level (e.g., 0.95).
 * @returns {number[][]} - Confidence intervals as [lower, upper] pairs.
 */
function computeConfidenceIntervals(coefficients: number[], standardErrors: number[], confidenceLevel: number): number[][] {
  const zCriticalValues: Record<number, number> = {
    0.90: 1.645,
    0.95: 1.96,
    0.99: 2.576
  };
  const z = zCriticalValues[confidenceLevel];
  return coefficients.map((b, i) => [b - z * standardErrors[i], b + z * standardErrors[i]]);
}

/**
 * Calculates Z-scores for the coefficients.
 * 
 * @param {number[]} coefficients - Model coefficients.
 * @param {number[]} standardErrors - Standard errors.
 * @returns {number[]} - Z-scores.
 */
function computeZScores(coefficients: number[], standardErrors: number[]): number[] {
  return coefficients.map((b, i) => b / standardErrors[i]);
}

/**
 * Computes the cumulative distribution function (CDF) of the standard normal distribution.
 * Polynomial approximation by Abramowitz & Stegun.
 * 
 * @param {number} z - The z-score (standard normal deviate).
 * @returns {number} - The cumulative probability up to z (i.e., P(Z ≤ z)).
 *
 * @example
 * normalCDF(1.96); // ≈ 0.975
 * normalCDF(-1.96); // ≈ 0.025
 */
function normalCDF(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return z > 0 ? 1 - prob : prob;
}

/**
 * Computes the R-squared statistic to measure model fit.
 * 
 * @param {number[]} y - Actual target values.
 * @param {number[]} yPred - Predicted values.
 * @returns {number} - R² value.
 */
function computeRSquared(y: number[], yPred: number[]): number {
  const meanY = y.reduce((sum, yi) => sum + yi, 0) / y.length;
  const SST = y.reduce((sum, yi) => sum + (yi - meanY) ** 2, 0);
  const SSE = y.reduce((sum, yi, i) => sum + (yi - yPred[i]) ** 2, 0);
  return 1 - (SSE / SST);
}

/**
 * Performs Ordinary Least Squares (OLS) Linear Regression.
 * 
 * @param {number[][]} X - Independent variable(s) matrix (features).
 * @param {number[]} y - Dependent variable (target vector).
 * @param {0.90 | 0.95 | 0.99} [confidenceLevel=0.95] - Confidence level for confidence intervals.
 * @param {boolean} [addIntercept=true] - Whether to include an intercept.
 * @returns {LinearRegressionResult} - Regression result including coefficients, SEs, CIs, Z-scores, and R².
 */
export function linearRegression(
  X: number[][],
  y: number[],
  confidenceLevel: 0.90 | 0.95 | 0.99 = 0.95,
  addIntercept: boolean = true
): LinearRegressionResult {
  const designMatrix = prepareDesignMatrix(X, addIntercept);
  const coefficients = computeCoefficients(designMatrix, y);
  const predictions = predict(designMatrix, coefficients);
  const residuals = computeResiduals(y, predictions);
  const standardErrors = computeStandardErrors(designMatrix, residuals, addIntercept);
  const confidenceIntervals = computeConfidenceIntervals(coefficients, standardErrors, confidenceLevel);
  const zScores = computeZScores(coefficients, standardErrors);
  const pValues = zScores.map(z => 2 * (1 - normalCDF(Math.abs(z))));
  const rSquared = computeRSquared(y, predictions);

  return {
    coefficients,
    standardErrors,
    confidenceIntervals,
    zScores,
    pValues,
    rSquared
  };
}
