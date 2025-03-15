export function isCloseMatrix(A: number[][], B: number[][], epsilon = 1e-5): boolean {
  if (A.length !== B.length || A[0].length !== B[0].length) return false;

  return A.every((row, i) =>
    row.every((value, j) => Math.abs(value - B[i][j]) < epsilon)
  );
}

export function generateSquareMatrix(n: number, min = 0, max = 10): number[][] {
  return Array.from({ length: n }, () =>
    Array.from({ length: n }, () => Math.random() * (max - min) + min)
  );
}

export function generateIdentityMatrix(n: number): number[][] {
  return Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => i === j ? 1 : 0)
  );
}
