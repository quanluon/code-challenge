const ZERO = 0;
const UNIT_INCREMENT = 1;
const TRIANGULAR_DIVISOR = 2;

/**
 * Closed-form triangular number formula.
 * Complexity: O(1) time, O(1) space.
 */
export const sum_to_n_a = (n: number): number => {
  if (n <= ZERO) {
    return ZERO;
  }
  return (n * (n + UNIT_INCREMENT)) / TRIANGULAR_DIVISOR;
};

/**
 * Iterative accumulation to avoid overflow in intermediate values.
 * Complexity: O(n) time, O(1) space.
 */
export const sum_to_n_b = (n: number): number => {
  if (n <= ZERO) {
    return ZERO;
  }
  let total = ZERO;
  for (let current = UNIT_INCREMENT; current <= n; current += UNIT_INCREMENT) {
    total += current;
  }
  return total;
};

/**
 * Functional approach using array generation and reduction.
 * Complexity: O(n) time, O(n) space.
 */
export const sum_to_n_c = (n: number): number => {
  if (n <= ZERO) {
    return ZERO;
  }
  return Array.from({ length: n }, (_, index) => index + UNIT_INCREMENT).reduce(
    (total, value) => total + value,
    ZERO,
  );
};
