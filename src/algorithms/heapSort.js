import { range } from "./helpers";

export function* heapSort(input) {
  const a = [...input];
  const n = a.length;

  // Phase 1: build a max-heap (biggest value ends up at index 0)
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* heapify(a, n, i);
  }

  // Phase 2: move the biggest value to the end, shrink the heap, repeat
  for (let end = n - 1; end > 0; end--) {
    [a[0], a[end]] = [a[end], a[0]];
    yield {
      type: "swap",
      array: [...a],
      comparing: [],
      swapping: [0, end],
      sorted: range(end, n),
    };
    yield* heapify(a, end, 0);
  }

  yield {
    type: "done",
    array: [...a],
    comparing: [],
    swapping: [],
    sorted: range(0, n),
  };
}

// Push a[i] down until both of its children are smaller
function* heapify(a, size, i) {
  while (true) {
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    let largest = i;
    const sorted = range(size, a.length);

    if (left < size) {
      yield {
        type: "compare",
        array: [...a],
        comparing: [largest, left],
        swapping: [],
        sorted,
      };
      if (a[left] > a[largest]) largest = left;
    }
    if (right < size) {
      yield {
        type: "compare",
        array: [...a],
        comparing: [largest, right],
        swapping: [],
        sorted,
      };
      if (a[right] > a[largest]) largest = right;
    }

    if (largest === i) return;

    [a[i], a[largest]] = [a[largest], a[i]];
    yield {
      type: "swap",
      array: [...a],
      comparing: [],
      swapping: [i, largest],
      sorted,
    };
    i = largest;
  }
}
