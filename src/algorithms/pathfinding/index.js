import { bfs } from "./bfs";
import { dfs } from "./dfs";

export const PATH_ALGORITHMS = {
  bfs: {
    name: "Breadth-First Search (BFS)",
    fn: bfs,
    shortest: "Yes (on an unweighted grid)",
    time: "O(V + E)",
    space: "O(V)",
  },
  dfs: {
    name: "Depth-First Search (DFS)",
    fn: dfs,
    shortest: "No",
    time: "O(V + E)",
    space: "O(V)",
  },
};
