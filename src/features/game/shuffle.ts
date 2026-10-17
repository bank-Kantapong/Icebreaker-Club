/**
 * Random number generator function returning a float in [0, 1).
 * Defaults to Math.random in production, injectable for deterministic unit testing.
 */
export type RandomFn = () => number;

/**
 * Pure Fisher–Yates shuffle that returns a new array containing all items from `items`
 * in randomized order without mutating the input array.
 */
export function shuffleDeck<T>(
  items: readonly T[],
  rng: RandomFn = Math.random
): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const rawRandom = rng();
    const clampedRandom = Math.max(0, Math.min(0.999999999, rawRandom));
    const j = Math.floor(clampedRandom * (i + 1));
    const temp = result[i]!;
    result[i] = result[j]!;
    result[j] = temp;
  }
  return result;
}

/**
 * Creates a deterministic seeded PRNG (Mulberry32) useful for reproducible tests.
 */
export function createSeededRng(seed: number): RandomFn {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

