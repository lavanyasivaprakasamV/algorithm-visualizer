export function* bubbleSort(input) {
  const a = [...input];
  const n = a.length;

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    for (let j = 0; j < n - 1 - i; j++) {
      yield {
        type: "compare",
        array: [...a],
        comparing: [j, j + 1],
        sortedFrom: n - i,
      };
      if (a[j] > a[j + 1]) {
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
        swapped = true;
        yield {
          type: "swap",
          array: [...a],
          swapping: [j, j + 1],
          sortedFrom: n - i,
        };
      }
    }
    if (!swapped) break;
  }
  yield { type: "done", array: [...a] };
}
