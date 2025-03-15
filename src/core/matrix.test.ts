import { describe, expect, test } from "vitest";
import { vectorToMatrix, flatten, multiply, transpose, LUDecomposition, inverse } from "./matrix";
import { generateIdentityMatrix, generateSquareMatrix, isCloseMatrix } from "./utils";

describe("Matrix Utilities", () => {
    test("vectorToMatrix should convert a vector to a column matrix", () => {
        expect(vectorToMatrix([1, 2, 3])).toEqual([[1], [2], [3]]);
        expect(vectorToMatrix([])).toEqual([]);
        expect(vectorToMatrix([-1, 0, 5])).toEqual([[-1], [0], [5]]);
    });

    test("flatten should convert a column matrix to a vector", () => {
        expect(flatten([[1], [2], [3]])).toEqual([1, 2, 3]);
        expect(flatten([])).toEqual([]);
        expect(flatten([[-1], [0], [5]])).toEqual([-1, 0, 5]);
    });

    test("multiply should correctly multiply two matrices", () => {
        const A = [
            [1, 2],
            [3, 4]
        ];
        const B = [
            [2, 0],
            [1, 2]
        ];
        expect(multiply(A, B)).toEqual([
            [4, 4],
            [10, 8]
        ]);
        const I = [
            [1, 0],
            [0, 1]
        ];
        expect(multiply(A, I)).toEqual(A);
        const Z = [
            [0, 0],
            [0, 0]
        ];
        expect(multiply(A, Z)).toEqual(Z);
    });

    test("transpose should correctly transpose a matrix", () => {
        expect(transpose([
            [1, 2, 3],
            [4, 5, 6]
        ])).toEqual([
            [1, 4],
            [2, 5],
            [3, 6]
        ]);
        expect(transpose([
            [1]
        ])).toEqual([
            [1]
        ]);
        expect(transpose([])).toEqual([]);
    });

    test("LUDecomposition should correctly decompose a matrix into L, U, and P", () => {
        const A = [
            [2, -1, -2],
            [-4, 6, 3],
            [-4, -2, 8]
        ];
        const { L, U, P } = LUDecomposition(A);
        const PA = multiply(P, A);
        const LU = multiply(L, U);
        expect(isCloseMatrix(PA, LU)).toBe(true);
    });

    test("inverse should correctly compute the inverse of a matrix", () => {
        const A = [
            [4, 7],
            [2, 6]
        ];
        const invA = inverse(A);
        const expected = [
            [0.6, -0.7],
            [-0.2, 0.4]
        ]
        expect(isCloseMatrix(invA!, expected)).toBe(true);
        const Identity = generateIdentityMatrix(2);
        expect(isCloseMatrix(Identity, multiply(A, invA!))).toBe(true);
    });

    test("inverse should be able to handle larger dimensions", () => {
      const N = 100;
      const A = generateSquareMatrix(N);
      const invA = inverse(A);
      const Identity = generateIdentityMatrix(N);
      expect(isCloseMatrix(Identity, multiply(A, invA!))).toBe(true);
    });

    test("inverse should throw an error for singular matrices", () => {
      const singularMatrix = [
        [1, 2],
        [2, 4]
      ];
      expect(() => inverse(singularMatrix)).toThrow();
    });
    
});
