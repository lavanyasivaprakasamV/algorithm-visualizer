import { bfs } from "./bfs";
import { dfs } from "./dfs";
import { dijkstra } from "./dijkstra";
import { astar } from "./astar";

export const PATH_ALGORITHMS = {
  bfs: {
    name: "Breadth-First Search (BFS)",
    fn: bfs,
    shortest: "Fewest steps, but ignores weights",
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
  dijkstra: {
    name: "Dijkstra's Algorithm",
    fn: dijkstra,
    shortest: "Yes (lowest total cost)",
    time: "O((V + E) log V)",
    space: "O(V)",
  },
  astar: {
    name: "A* Search",
    fn: astar,
    shortest: "Yes (with an admissible heuristic)",
    time: "O((V + E) log V) worst case",
    space: "O(V)",
  },
};
