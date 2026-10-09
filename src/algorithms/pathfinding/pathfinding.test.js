import { describe, it, expect } from "vitest";
import { PATH_ALGORITHMS } from "./index.js";
import { neighbors, stepCost } from "./helpers.js";

const numeric = (a, b) => a - b;

// Run an algorithm to the end and collect the result
function solve(fn, opts) {
  let result = null;
  let visits = 0;
  for (const step of fn({ walls: new Set(), weights: new Set(), ...opts })) {
    if (step.type === "visit") visits++;
    else result = step;
  }
  return { result, visits };
}

const costOf = (path, weights) =>
  path.slice(1).reduce((sum, i) => sum + stepCost(i, weights), 0);

function expectValidPath(path, { rows, cols, walls = new Set(), start, end }) {
  expect(path[0]).toBe(start);
  expect(path[path.length - 1]).toBe(end);
  for (let i = 0; i < path.length - 1; i++) {
    expect(neighbors(path[i], rows, cols)).toContain(path[i + 1]);
  }
  for (const cell of path) expect(walls.has(cell)).toBe(false);
}

describe("neighbors", () => {
  it("returns 2 neighbors for a corner", () => {
    expect(neighbors(0, 5, 5).sort(numeric)).toEqual([1, 5]);
  });

  it("returns 3 neighbors for an edge and 4 for the middle", () => {
    expect(neighbors(2, 5, 5).sort(numeric)).toEqual([1, 3, 7]);
    expect(neighbors(12, 5, 5).sort(numeric)).toEqual([7, 11, 13, 17]);
  });

  it("does not wrap around the edge of a row", () => {
    expect(neighbors(4, 5, 5).sort(numeric)).toEqual([3, 9]);
    expect(neighbors(5, 5, 5).sort(numeric)).toEqual([0, 6, 10]);
  });
});

describe.each(Object.keys(PATH_ALGORITHMS))("%s", (key) => {
  const fn = PATH_ALGORITHMS[key].fn;
  const grid = { rows: 5, cols: 5, start: 0, end: 24 };

  it("finds a valid path on an open grid", () => {
    const { result } = solve(fn, grid);
    expect(result.type).toBe("path");
    expectValidPath(result.path, grid);
  });

  it("routes through the only gap in a wall", () => {
    // Wall down column 2, rows 0-3. The gap is at row 4 (cell 22).
    const walls = new Set([2, 7, 12, 17]);
    const opts = { rows: 5, cols: 5, start: 0, end: 4, walls };
    const { result } = solve(fn, opts);
    expect(result.type).toBe("path");
    expect(result.path).toContain(22);
    expectValidPath(result.path, opts);
  });

  it("reports no path when walls block every route", () => {
    const walls = new Set([2, 7, 12, 17, 22]);
    const { result } = solve(fn, { rows: 5, cols: 5, start: 0, end: 4, walls });
    expect(result.type).toBe("nopath");
  });
});

describe("shortest paths", () => {
  it.each(["bfs", "dijkstra", "astar"])(
    "%s finds the fewest steps on an open grid",
    (key) => {
      const { result } = solve(PATH_ALGORITHMS[key].fn, {
        rows: 5,
        cols: 5,
        start: 0,
        end: 24,
      });
      expect(result.path).toHaveLength(9); // 8 steps, 9 cells
    },
  );
});

describe("weights", () => {
  // 3 rows x 5 columns. Start is the left of the middle row, the end is the right.
  // The straight route through the middle row crosses three weighted cells (cost 5 each).
  const rows = 3;
  const cols = 5;
  const start = 5;
  const end = 9;
  const weights = new Set([6, 7, 8]);
  const opts = { rows, cols, start, end, weights };

  it("BFS ignores weights and takes the straight route", () => {
    const { result } = solve(PATH_ALGORITHMS.bfs.fn, opts);
    expect(result.path.length - 1).toBe(4);
    expect(costOf(result.path, weights)).toBe(16);
  });

  it.each(["dijkstra", "astar"])("%s goes around the weighted cells", (key) => {
    const { result } = solve(PATH_ALGORITHMS[key].fn, opts);
    expect(costOf(result.path, weights)).toBe(6);
    expectValidPath(result.path, opts);
  });
});

describe("A* efficiency", () => {
  it("visits far fewer cells than Dijkstra on an open grid", () => {
    const opts = { rows: 15, cols: 30, start: 7 * 30 + 4, end: 7 * 30 + 25 };
    const dijkstraRun = solve(PATH_ALGORITHMS.dijkstra.fn, opts);
    const astarRun = solve(PATH_ALGORITHMS.astar.fn, opts);

    expect(astarRun.visits).toBeLessThan(dijkstraRun.visits);
    expect(costOf(astarRun.result.path, new Set())).toBe(
      costOf(dijkstraRun.result.path, new Set()),
    );
  });
});
