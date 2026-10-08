import { range } from "./helpers";

export function* selectionSort(input) {
  const a = [...input];
  const n = a.length;

  for (let i = 0; i < n - 1; i++) {
    let min = i;
    const sorted = range(0, i);
    for (let j = i + 1; j < n; j++) {
      yield {
        type: "compare",
        array: [...a],
        comparing: [min, j],
        swapping: [],
        sorted,
      };
      if (a[j] < a[min]) min = j;
    }
    if (min !== i) {
      [a[i], a[min]] = [a[min], a[i]];
      yield {
        type: "swap",
        array: [...a],
        comparing: [],
        swapping: [i, min],
        sorted,
      };
    }
  }
  yield {
    type: "done",
    array: [...a],
    comparing: [],
    swapping: [],
    sorted: range(0, n),
  };
}
