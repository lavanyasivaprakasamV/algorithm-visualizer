import { range } from "./helpers";

export function* mergeSort(input) {
  const a = [...input];
  yield* sort(a, 0, a.length - 1);
  yield {
    type: "done",
    array: [...a],
    comparing: [],
    swapping: [],
    sorted: range(0, a.length),
  };
}

function* sort(a, l, r) {
  if (l >= r) return;
  const m = Math.floor((l + r) / 2);
  yield* sort(a, l, m);
  yield* sort(a, m + 1, r);
  yield* merge(a, l, m, r);
}

function* merge(a, l, m, r) {
  const left = a.slice(l, m + 1);
  const right = a.slice(m + 1, r + 1);
  let i = 0,
    j = 0,
    k = l;

  while (i < left.length && j < right.length) {
    yield {
      type: "compare",
      array: [...a],
      comparing: [l + i, m + 1 + j],
      swapping: [],
      sorted: [],
    };
    if (left[i] <= right[j]) a[k] = left[i++];
    else a[k] = right[j++];
    yield {
      type: "swap",
      array: [...a],
      comparing: [],
      swapping: [k],
      sorted: [],
    };
    k++;
  }
  while (i < left.length) {
    a[k] = left[i++];
    yield {
      type: "swap",
      array: [...a],
      comparing: [],
      swapping: [k],
      sorted: [],
    };
    k++;
  }
  while (j < right.length) {
    a[k] = right[j++];
    yield {
      type: "swap",
      array: [...a],
      comparing: [],
      swapping: [k],
      sorted: [],
    };
    k++;
  }
}
