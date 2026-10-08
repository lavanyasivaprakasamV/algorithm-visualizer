export const range = (from, to) =>
  Array.from({ length: Math.max(0, to - from) }, (_, k) => from + k);
