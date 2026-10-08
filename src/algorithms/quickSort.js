import { range } from "./helpers";

export function* quickSort(input) {
  const a = [...input];
  yield* quick(a, 0, a.length - 1);
  yield {
    type: "done",
    array: [...a],
    comparing: [],
    swapping: [],
    sorted: range(0, a.length),
  };
}

function* quick(a, lo, hi) {
  if (lo >= hi) return;
  const pivot = a[hi];
  let i = lo;

  for (let j = lo; j < hi; j++) {
    yield {
      type: "compare",
      array: [...a],
      comparing: [j, hi],
      swapping: [],
      sorted: [],
    };
    if (a[j] < pivot) {
      if (i !== j) {
        [a[i], a[j]] = [a[j], a[i]];
        yield {
          type: "swap",
          array: [...a],
          comparing: [],
          swapping: [i, j],
          sorted: [],
        };
      }
      i++;
    }
  }
  if (i !== hi) {
    [a[i], a[hi]] = [a[hi], a[i]];
    yield {
      type: "swap",
      array: [...a],
      comparing: [],
      swapping: [i, hi],
      sorted: [],
    };
  }
  yield* quick(a, lo, i - 1);
  yield* quick(a, i + 1, hi);
}
