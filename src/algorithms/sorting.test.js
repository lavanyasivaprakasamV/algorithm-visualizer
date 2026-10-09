import { describe, it, expect } from "vitest";
import { ALGORITHMS } from "./index.js";

const byNumber = (a, b) => a - b;

function lastStep(fn, input) {
  let last = null;
  for (const step of fn(input)) last = step;
  return last;
}

// Small seeded random generator, so the tests give the same result every run
function makeRng(seed) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

function randomArray(rng, n, max = 100) {
  return Array.from({ length: n }, () => Math.floor(rng() * max) + 1);
}

describe.each(Object.entries(ALGORITHMS))("%s", (_key, { fn }) => {
  it("sorts a normal array", () => {
    const input = [5, 2, 9, 1, 5, 6];
    expect(lastStep(fn, input).array).toEqual([1, 2, 5, 5, 6, 9]);
  });

  it("handles empty and single-element arrays", () => {
    expect(lastStep(fn, []).array).toEqual([]);
    expect(lastStep(fn, [7]).array).toEqual([7]);
  });

  it("handles duplicates", () => {
    const input = [3, 3, 3, 1, 1, 2, 2];
    expect(lastStep(fn, input).array).toEqual([...input].sort(byNumber));
  });

  it("handles already sorted and reverse sorted input", () => {
    const sorted = [1, 2, 3, 4, 5, 6, 7, 8];
    expect(lastStep(fn, sorted).array).toEqual(sorted);
    expect(lastStep(fn, [...sorted].reverse()).array).toEqual(sorted);
  });

  it("matches Array.sort on many random arrays", () => {
    const rng = makeRng(42);
    for (let n = 0; n <= 40; n++) {
      const input = randomArray(rng, n);
      expect(lastStep(fn, input).array).toEqual([...input].sort(byNumber));
    }
  });

  it("does not modify the input array", () => {
    const input = [4, 3, 2, 1];
    lastStep(fn, input);
    expect(input).toEqual([4, 3, 2, 1]);
  });

  it("finishes with a done step that marks every index as sorted", () => {
    const input = [9, 4, 7, 1];
    const last = lastStep(fn, input);
    expect(last.type).toBe("done");
    expect(last.sorted).toEqual([0, 1, 2, 3]);
  });

  it("keeps the array length the same in every step", () => {
    const input = [8, 3, 5, 1, 9, 2];
    for (const step of fn(input)) {
      expect(step.array).toHaveLength(input.length);
    }
  });
});
