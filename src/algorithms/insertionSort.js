import { range } from "./helpers";

export function* insertionSort(input) {
  const a = [...input];
  const n = a.length;

  for (let i = 1; i < n; i++) {
    let j = i;
    while (j > 0) {
      yield {
        type: "compare",
        array: [...a],
        comparing: [j - 1, j],
        swapping: [],
        sorted: [],
      };
      if (a[j - 1] > a[j]) {
        [a[j - 1], a[j]] = [a[j], a[j - 1]];
        yield {
          type: "swap",
          array: [...a],
          comparing: [],
          swapping: [j - 1, j],
          sorted: [],
        };
        j--;
      } else {
        break;
      }
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
