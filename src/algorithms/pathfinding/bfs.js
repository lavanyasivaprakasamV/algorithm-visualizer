import { neighbors, buildPath } from "./helpers";

export function* bfs({ rows, cols, walls, start, end }) {
  const prev = new Map();
  const seen = new Set([start]);
  const queue = [start];
  let head = 0;

  while (head < queue.length) {
    const cur = queue[head++];
    yield { type: "visit", node: cur };

    if (cur === end) {
      yield { type: "path", path: buildPath(prev, start, end) };
      return;
    }
    for (const nb of neighbors(cur, rows, cols)) {
      if (walls.has(nb) || seen.has(nb)) continue;
      seen.add(nb);
      prev.set(nb, cur);
      queue.push(nb);
    }
  }
  yield { type: "nopath" };
}
