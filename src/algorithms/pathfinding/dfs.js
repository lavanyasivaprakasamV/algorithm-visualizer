import { neighbors, buildPath } from "./helpers";

export function* dfs({ rows, cols, walls, start, end }) {
  const prev = new Map();
  const seen = new Set();
  const stack = [[start, null]];

  while (stack.length > 0) {
    const [cur, parent] = stack.pop();
    if (seen.has(cur)) continue;
    seen.add(cur);
    if (parent !== null) prev.set(cur, parent);
    yield { type: "visit", node: cur };

    if (cur === end) {
      yield { type: "path", path: buildPath(prev, start, end) };
      return;
    }
    const next = neighbors(cur, rows, cols).filter(
      (nb) => !walls.has(nb) && !seen.has(nb),
    );
    for (let i = next.length - 1; i >= 0; i--) {
      stack.push([next[i], cur]);
    }
  }
  yield { type: "nopath" };
}
