export function vectorToMatrix(vec: number[]): number[][] {
  return vec.map(v => [v]);
}

export function flatten(matrix: number[][]): number[] {
  return matrix.map(row => row[0]);
}

export function multiply(A: number[][], B: number[][]): number[][] {
  return A.map(row =>
      Array.from({ length: B[0].length }, (_, j) =>
          row.reduce((sum, a, k) => sum + a * B[k][j], 0)
      )
  );
}

export function transpose(A: number[][]): number[][] {
  if (A.length === 0) return [];
  return A[0].map((_, colIndex) => A.map(row => row[colIndex]));
}

/*
  LU Decomposition with partial pivoting such that PA = LU
  Reference: https://en.wikipedia.org/wiki/LU_decomposition
*/
export function LUDecomposition(A: number[][]): { L: number[][]; U: number[][]; P: number[][] } {
  const n = A.length;

  const L = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0) as number)
  );

  const U = A.map(row => [...row]);
  const P = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0) as number)
  );

  for (let i = 0; i < n; i++) {
    let pivot = i;
    for (let k = i + 1; k < n; k++) {
      if (Math.abs(U[k][i]) > Math.abs(U[pivot][i])) pivot = k;
    }

    if (pivot !== i) {
      [U[i], U[pivot]] = [U[pivot], U[i]];
      [P[i], P[pivot]] = [P[pivot], P[i]];
      for (let j = 0; j < i; j++) [L[i][j], L[pivot][j]] = [L[pivot][j], L[i][j]];
    }

    if (U[i][i] === 0) throw new Error("Matrix is singular and cannot be decomposed.");

    for (let j = i + 1; j < n; j++) {
      L[j][i] = U[j][i] / U[i][i];
      for (let k = i; k < n; k++) U[j][k] -= L[j][i] * U[i][k];
    }
  }

  return { L, U, P };
}



export function inverse(A: number[][]): number[][] | null {
  const n = A.length;
  const { L, U, P } = LUDecomposition(A);

  if (U.some((row, i) => row[i] === 0)) return null;

  const invA = Array.from({ length: n }, () => Array(n).fill(0));
  const Y = Array.from({ length: n }, () => Array(n).fill(0));

  // Forward substitution: Solve LY = P
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      let sum = 0;
      for (let k = 0; k < i; k++) {
        sum += L[i][k] * Y[k][j];
      }
      Y[i][j] = P[i][j] - sum;
    }
  }

  // Backward substitution: Solve UX = Y
  for (let j = 0; j < n; j++) {
    for (let i = n - 1; i >= 0; i--) {
      let sum = 0;
      for (let k = i + 1; k < n; k++) {
        sum += U[i][k] * invA[k][j];
      }
      if (U[i][i] === 0) return null;
      invA[i][j] = (Y[i][j] - sum) / U[i][i];
    }
  }

  return invA;
}
