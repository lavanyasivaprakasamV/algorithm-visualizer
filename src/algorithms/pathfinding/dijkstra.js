import { neighbors, buildPath, stepCost } from "./helpers";
import { MinHeap } from "./minHeap";

export function* dijkstra({ rows, cols, walls, weights, start, end }) {
  const dist = new Map([[start, 0]]);
  const prev = new Map();
  const done = new Set();
  const heap = new MinHeap();
  heap.push(start, 0);

  while (heap.size > 0) {
    const { value: cur, priority: d } = heap.pop();
    if (done.has(cur)) continue; // stale entry: a cheaper route was already processed
    done.add(cur);
    yield { type: "visit", node: cur };

    if (cur === end) {
      yield { type: "path", path: buildPath(prev, start, end) };
      return;
    }
    for (const nb of neighbors(cur, rows, cols)) {
      if (walls.has(nb) || done.has(nb)) continue;
      const nd = d + stepCost(nb, weights);
      if (nd < (dist.get(nb) ?? Infinity)) {
        dist.set(nb, nd);
        prev.set(nb, cur);
        heap.push(nb, nd);
      }
    }
  }
  yield { type: "nopath" };
}
