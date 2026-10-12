# Algorithm Visualizer

![CI](https://github.com/lavanyasivaprakasamV/algorithm-visualizer/actions/workflows/ci.yml/badge.svg)

An interactive visualizer for sorting and pathfinding algorithms, built with React.

\*\*[Live demo](https://algorithm-visualizer-ecru-two.vercel.app/)

## Features

- **6 sorting algorithms:** bubble, selection, insertion, merge, quick, heap
- **4 pathfinding algorithms:** BFS, DFS, Dijkstra, A\*
- Play, pause, step, restart and speed controls
- Live counters for comparisons and swaps/writes, plus the complexity of each algorithm
- Custom array input with validation, and an adjustable array size
- A drawable grid with walls and weighted cells (cost 5)

## How it works

Every algorithm is a JavaScript generator function that yields a snapshot
at each interesting step (compare, swap, visit). The UI only plays those
snapshots back, so it knows nothing about how any algorithm works.
Adding a new algorithm means writing one file and adding one line to a registry.

Dijkstra and A\* use a binary min-heap priority queue written from scratch
(`src/algorithms/pathfinding/minHeap.js`).

## Tech stack

React, Vite, JavaScript, Vitest, ESLint, GitHub Actions, Vercel

## Run locally

```bash
git clone https://github.com/lavanyasivaprakasamV/algorithm-visualizer.git
cd algorithm-visualizer
npm install
npm run dev
```

## Tests

```bash
npm test
```

Unit tests cover all sorting algorithms (including empty arrays and duplicates),
the min-heap, and pathfinding (valid paths, walls, unreachable targets, weighted routes).
Tests run on every push through GitHub Actions.
