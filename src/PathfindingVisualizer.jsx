import { useState, useRef, useEffect } from "react";
import { PATH_ALGORITHMS } from "./algorithms/pathfinding/index.js";
import { stepCost } from "./algorithms/pathfinding/helpers.js";

const ROWS = 15;
const COLS = 30;
const START = 7 * COLS + 4;
const END = 7 * COLS + 25;
const HINT = "Click and drag on the grid to draw, then press Play.";

export default function PathfindingVisualizer() {
  const [algo, setAlgo] = useState("bfs");
  const [walls, setWalls] = useState(new Set());
  const [weights, setWeights] = useState(new Set());
  const [drawMode, setDrawMode] = useState("wall");
  const [visited, setVisited] = useState(new Set());
  const [path, setPath] = useState(new Set());
  const [status, setStatus] = useState(HINT);
  const [playing, setPlaying] = useState(false);
  const [started, setStarted] = useState(false);
  const [speed, setSpeed] = useState(80);
  const gen = useRef(null);
  const drawing = useRef(null); // null | 'add' | 'erase'

  const advance = () => {
    setStarted(true);
    if (!gen.current) {
      gen.current = PATH_ALGORITHMS[algo].fn({
        rows: ROWS,
        cols: COLS,
        walls,
        weights,
        start: START,
        end: END,
      });
    }
    const { value, done } = gen.current.next();
    if (done || !value) {
      setPlaying(false);
      return;
    }

    if (value.type === "visit") {
      setVisited((prev) => new Set(prev).add(value.node));
    } else if (value.type === "path") {
      const cost = value.path
        .slice(1)
        .reduce((sum, i) => sum + stepCost(i, weights), 0);
      setPath(new Set(value.path));
      setStatus(
        `Path found: ${value.path.length - 1} steps, total cost ${cost}`,
      );
      setPlaying(false);
    } else if (value.type === "nopath") {
      setStatus("No path exists. The walls block every route.");
      setPlaying(false);
    }
  };

  const clearPath = () => {
    setPlaying(false);
    gen.current = null;
    setStarted(false);
    setVisited(new Set());
    setPath(new Set());
    setStatus(HINT);
  };

  const clearAll = () => {
    clearPath();
    setWalls(new Set());
    setWeights(new Set());
  };

  const randomWalls = () => {
    clearPath();
    const w = new Set();
    for (let i = 0; i < ROWS * COLS; i++) {
      if (i !== START && i !== END && Math.random() < 0.25) w.add(i);
    }
    setWalls(w);
    setWeights(new Set());
  };

  const randomWeights = () => {
    clearPath();
    const w = new Set();
    for (let i = 0; i < ROWS * COLS; i++) {
      if (i !== START && i !== END && !walls.has(i) && Math.random() < 0.25)
        w.add(i);
    }
    setWeights(w);
  };

  const changeAlgo = (key) => {
    clearPath();
    setAlgo(key);
  };

  const paint = (idx) => {
    const action = drawing.current;
    if (!action || started || idx === START || idx === END) return;

    if (drawMode === "wall") {
      setWalls((prev) => {
        const next = new Set(prev);
        if (action === "add") next.add(idx);
        else next.delete(idx);
        return next;
      });
      if (action === "add") {
        setWeights((prev) => {
          const next = new Set(prev);
          next.delete(idx);
          return next;
        });
      }
    } else {
      if (walls.has(idx)) return;
      setWeights((prev) => {
        const next = new Set(prev);
        if (action === "add") next.add(idx);
        else next.delete(idx);
        return next;
      });
    }
  };

  const handleDown = (idx) => {
    if (started || idx === START || idx === END) return;
    const target = drawMode === "wall" ? walls : weights;
    drawing.current = target.has(idx) ? "erase" : "add";
    paint(idx);
  };

  useEffect(() => {
    const stop = () => {
      drawing.current = null;
    };
    window.addEventListener("mouseup", stop);
    return () => window.removeEventListener("mouseup", stop);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(advance, 1000 - speed * 9.5);
    return () => clearInterval(id);
  }, [playing, speed, algo]);

  const info = PATH_ALGORITHMS[algo];

  return (
    <div>
      <div className="controls">
        <select value={algo} onChange={(e) => changeAlgo(e.target.value)}>
          {Object.entries(PATH_ALGORITHMS).map(([key, a]) => (
            <option key={key} value={key}>
              {a.name}
            </option>
          ))}
        </select>
        <button onClick={() => setPlaying((p) => !p)}>
          {playing ? "Pause" : "Play"}
        </button>
        <button onClick={advance} disabled={playing}>
          Step
        </button>
        <button onClick={clearPath}>Clear path</button>
        <label>
          Speed
          <input
            type="range"
            min="1"
            max="100"
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
          />
        </label>
      </div>

      <div className="controls">
        <label>
          Draw
          <select
            value={drawMode}
            onChange={(e) => setDrawMode(e.target.value)}
          >
            <option value="wall">Walls</option>
            <option value="weight">Weights (cost 5)</option>
          </select>
        </label>
        <button onClick={randomWalls}>Random walls</button>
        <button onClick={randomWeights}>Random weights</button>
        <button onClick={clearAll}>Clear all</button>
      </div>

      <div className="info">
        <strong>{info.name}</strong> — best path: {info.shortest} · time{" "}
        {info.time} · space {info.space}
      </div>
      <div className="stats">Visited cells: {visited.size}</div>
      <div className="status">{status}</div>

      <div
        className="grid"
        style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
        onMouseLeave={() => {
          drawing.current = null;
        }}
      >
        {Array.from({ length: ROWS * COLS }, (_, idx) => {
          let cls = "cell";
          if (walls.has(idx)) cls += " wall";
          else {
            if (path.has(idx)) cls += " path";
            else if (visited.has(idx)) cls += " visited";
            if (weights.has(idx)) cls += " weight";
          }
          if (idx === START) cls += " start";
          if (idx === END) cls += " end";
          return (
            <div
              key={idx}
              className={cls}
              onMouseDown={() => handleDown(idx)}
              onMouseEnter={() => paint(idx)}
              onDragStart={(e) => e.preventDefault()}
            />
          );
        })}
      </div>

      <div className="legend">
        <span>
          <i className="dot start" /> Start
        </span>
        <span>
          <i className="dot end" /> Target
        </span>
        <span>
          <i className="dot wall" /> Wall
        </span>
        <span>
          <i className="dot weight" /> Weight (cost 5)
        </span>
        <span>
          <i className="dot visited" /> Visited
        </span>
        <span>
          <i className="dot path" /> Path
        </span>
      </div>
    </div>
  );
}
