/**
 * Computes the Beta function B(a, b) using the Gamma function.
 * 
 * The Beta function is defined as:
 *    B(a, b) = Γ(a)Γ(b) / Γ(a+b)
 * Taking the logarithm of both sides:
 *    logB(a, b) = logΓ(a) + logΓ(b) − logΓ(a+b)
 * Then:
 *    B(a, b) = exp(logΓ(a) + logΓ(b) − logΓ(a+b)) 
 *
 * @param a - The first shape parameter (must be positive)
 * @param b - The second shape parameter (must be positive)
 * @returns The Beta function value B(a, b)
 * @throws Error if a or b is not positive
 */
export function betaFunction(a: number, b: number): number {
  if (a <= 0 || b <= 0) {
    throw new Error("Beta function parameters must be positive.");
  }
  return Math.exp(logGamma(a) + logGamma(b) - logGamma(a + b));
}

/**
 * Computes the logarithm of the Gamma function log(Γ(x)) using the Lanczos approximation.
 * 
 * @param x - Input value for which to compute log Gamma (x must be positive)
 * @returns The natural logarithm of the Gamma function logΓ(x)
 */
export function logGamma(x: number): number {
  const g = 5.0;

  const lanczosCoefficients = [
    76.18009172947146,
    -86.50532032941677,
    24.01409824083091,
    -1.231739572450155,
    0.001208650973866179,
    -0.000005395239384953,
  ];

  let sum = 1.000000000190015;
  for (let i = 0; i < lanczosCoefficients.length; i++) {
    sum += lanczosCoefficients[i] / (x + i + 1);
  }

  const shiftedX = x + g + 0.5;
  return Math.log(Math.sqrt(2 * Math.PI) * sum / x) - shiftedX + (x + 0.5) * Math.log(shiftedX);
}

/**
 * Computes the continued fraction representation of the incomplete Beta function iteratively.
 *
 * @param x - The input value (0 ≤ x ≤ 1)
 * @param a - The first shape parameter
 * @param b - The second shape parameter
 * @returns The continued fraction approximation of the incomplete Beta function
 */
function betaContinuedFraction(x: number, a: number, b: number): number {
  const MAX_ITERATIONS = 100;
  const EPSILON = 1e-8;

  let delta: number;
  let numerator: number;

  let c = 1;
  let d = 1 - ((a + b) * x) / (a + 1);
  d = d === 0 ? EPSILON : 1 / d;
  let fractionValue = d;

  for (let iteration = 1; iteration <= MAX_ITERATIONS; iteration++) {
    const twiceIteration = 2 * iteration;

    // First term in the continued fraction expansion
    numerator = (iteration * (b - iteration) * x) / ((a + twiceIteration - 1) * (a + twiceIteration));

    d = 1 + numerator * d;
    d = d === 0 ? EPSILON : 1 / d;
    c = 1 + numerator / c;
    c = c === 0 ? EPSILON : c;
    d = 1 / d;
    fractionValue *= d * c;

    // Second term in the continued fraction expansion
    numerator = -((a + iteration) * (a + b + iteration) * x) / ((a + twiceIteration) * (a + twiceIteration + 1));

    d = 1 + numerator * d;
    d = d === 0 ? EPSILON : 1 / d;
    c = 1 + numerator / c;
    c = c === 0 ? EPSILON : c;
    d = 1 / d;

    delta = d * c;
    fractionValue *= delta;

    if (Math.abs(delta - 1) < EPSILON) {
      return fractionValue;
    }
  }
  return fractionValue;
}

/**
 * Computes the regularized incomplete Beta function.
 *
 * @param x - The input value (0 ≤ x ≤ 1)
 * @param a - The first shape parameter
 * @param b - The second shape parameter
 * @returns The regularized incomplete Beta function value
 * @throws Error if x is outside the range [0,1]
 */
export function regularizedIncompleteBeta(x: number, a: number, b: number): number {
  if (x < 0 || x > 1) {
    throw new Error("x must be in the range [0,1]");
  }

  const betaValue = betaFunction(a, b);
  return betaContinuedFraction(x, a, b) * betaValue / a;
}

/**
 * Computes the cumulative distribution function (CDF) of the Student's t-distribution.
 * This function is used to calculate p-values for t-tests.
 *
 * @param t - The t-statistic value
 * @param df - Degrees of freedom (must be > 0)
 * @returns The probability P(T ≤ t) under the t-distribution
 * @throws Error if degrees of freedom is not positive
 */
export function tDistributionCDF(t: number, df: number): number {
  if (df <= 0) {
    throw new Error("Degrees of freedom must be positive.");
  }

  const x = df / (df + t * t);
  const betaIncomplete = regularizedIncompleteBeta(x, df / 2, 0.5);

  return t >= 0 ? 1 - 0.5 * betaIncomplete : 0.5 * betaIncomplete;
}
