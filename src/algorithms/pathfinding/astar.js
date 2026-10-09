import { neighbors, buildPath, stepCost } from "./helpers";
import { MinHeap } from "./minHeap";

export function* astar({ rows, cols, walls, weights, start, end }) {
  const endRow = Math.floor(end / cols);
  const endCol = end % cols;
  const h = (idx) =>
    Math.abs(Math.floor(idx / cols) - endRow) + Math.abs((idx % cols) - endCol);

  const g = new Map([[start, 0]]);
  const prev = new Map();
  const done = new Set();
  const heap = new MinHeap();
  heap.push(start, h(start));

  while (heap.size > 0) {
    const { value: cur } = heap.pop();
    if (done.has(cur)) continue;
    done.add(cur);
    yield { type: "visit", node: cur };

    if (cur === end) {
      yield { type: "path", path: buildPath(prev, start, end) };
      return;
    }
    for (const nb of neighbors(cur, rows, cols)) {
      if (walls.has(nb) || done.has(nb)) continue;
      const ng = g.get(cur) + stepCost(nb, weights);
      if (ng < (g.get(nb) ?? Infinity)) {
        g.set(nb, ng);
        prev.set(nb, cur);
        heap.push(nb, ng + h(nb));
      }
    }
  }
  yield { type: "nopath" };
}
