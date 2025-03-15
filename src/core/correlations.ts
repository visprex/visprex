import { Schema, NumberSchema, Value } from "@/schema";
import { multiply, transpose } from "./matrix";

export type Correlation = {
  x: string;
  y: string;
  coef: number;
};

export function calculateCorrelations(matrix: Value[][], schema: Schema[]): Correlation[] {
  const nCols = matrix.length;
  const nRows = matrix[0].length;

  const X: number[][] = Array.from({ length: nRows }, (_, row) =>
    Array.from({ length: nCols }, (__, col) => (matrix[col][row] as number) - (schema[col] as NumberSchema).mean)
  );

  // Cov(X) = (X^T * X) / (nRows - 1)
  const XT = transpose(X);
  const covarianceMatrix = multiply(XT, X).map(row => row.map(value => value / (nRows - 1)));


  // Cor(X) = Cov(X) / (stdX * stdY)
  const correlations: Correlation[] = [];
  const stds = covarianceMatrix.map((row, i) => Math.sqrt(row[i]));

  for (let colX = 0; colX < nCols; colX++) {
    for (let colY = 0; colY < nCols; colY++) {
      const coef = colX === colY ? 1 : covarianceMatrix[colX][colY] / (stds[colX] * stds[colY]);
      correlations.push({
        x: schema[colX].key,
        y: schema[colY].key,
        coef,
      });
    }
  }

  return correlations;
}
