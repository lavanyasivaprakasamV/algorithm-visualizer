import { useState, useRef, useEffect } from "react";
import { ALGORITHMS } from "./algorithms/index.js";
import "./App.css";

const randomArray = (n = 30) =>
  Array.from({ length: n }, () => Math.floor(Math.random() * 95) + 5);

function describe(step) {
  if (!step) return "Press Play or Step to begin.";
  if (step.type === "compare") {
    return `Comparing positions ${step.comparing[0]} and ${step.comparing[1]}`;
  }
  if (step.type === "swap") {
    return step.swapping.length === 2
      ? `Swapping positions ${step.swapping[0]} and ${step.swapping[1]}`
      : `Writing a value at position ${step.swapping[0]}`;
  }
  return "Sorted!";
}

function parseInput(text) {
  const nums = text
    .split(/[\s,]+/)
    .filter(Boolean)
    .map(Number);
  if (nums.length < 2) return { error: "Enter at least 2 numbers." };
  if (nums.length > 100) return { error: "Use at most 100 numbers." };
  if (nums.some((n) => !Number.isFinite(n) || n <= 0)) {
    return {
      error: "Use positive numbers only, separated by commas or spaces.",
    };
  }
  return { values: nums };
}

export default function App() {
  const [size, setSize] = useState(30);
  const [array, setArray] = useState(() => randomArray(30));
  const [algo, setAlgo] = useState("bubble");
  const [step, setStep] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(70);
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0 });
  const [customText, setCustomText] = useState("");
  const [inputError, setInputError] = useState("");
  const gen = useRef(null);

  const advance = () => {
    if (!gen.current) gen.current = ALGORITHMS[algo].fn(array);
    const { value, done } = gen.current.next();
    if (done || !value) {
      setPlaying(false);
      return;
    }
    setStep(value);
    setStats((s) => ({
      comparisons: s.comparisons + (value.type === "compare" ? 1 : 0),
      swaps: s.swaps + (value.type === "swap" ? 1 : 0),
    }));
    if (value.type === "done") setPlaying(false);
  };

  const restart = () => {
    setPlaying(false);
    gen.current = null;
    setStep(null);
    setStats({ comparisons: 0, swaps: 0 });
  };

  const newArray = (n = size) => {
    restart();
    setArray(randomArray(n));
  };

  const changeSize = (n) => {
    setSize(n);
    newArray(n);
  };

  const changeAlgo = (key) => {
    restart();
    setAlgo(key);
  };

  const applyCustom = () => {
    const result = parseInput(customText);
    if (result.error) {
      setInputError(result.error);
      return;
    }
    setInputError("");
    restart();
    setArray(result.values);
  };

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(advance, 1000 - speed * 9);
    return () => clearInterval(id);
  }, [playing, speed, algo]);

  const bars = step ? step.array : array;
  const max = Math.max(...bars);
  const info = ALGORITHMS[algo];

  return (
    <div className="app">
      <h1>Algorithm Visualizer</h1>

      <div className="controls">
        <select value={algo} onChange={(e) => changeAlgo(e.target.value)}>
          {Object.entries(ALGORITHMS).map(([key, a]) => (
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
        <button onClick={restart}>Restart</button>
        <button onClick={() => newArray()}>New array</button>
      </div>

      <div className="controls">
        <label>
          Size: {array.length}
          <input
            type="range"
            min="5"
            max="100"
            value={size}
            onChange={(e) => changeSize(Number(e.target.value))}
          />
        </label>
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
        <input
          className="custom"
          type="text"
          placeholder="Custom array, e.g. 8, 3, 10, 1, 6"
          value={customText}
          onChange={(e) => setCustomText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && applyCustom()}
        />
        <button onClick={applyCustom}>Use this array</button>
      </div>
      {inputError && <div className="error">{inputError}</div>}

      <div className="info">
        <strong>{info.name}</strong> — best {info.best} · average {info.avg} ·
        worst {info.worst} · space {info.space}
      </div>

      <div className="stats">
        Comparisons: {stats.comparisons} | Swaps / writes: {stats.swaps}
      </div>
      <div className="status">{describe(step)}</div>

      <div className="bars">
        {bars.map((v, i) => {
          let cls = "bar";
          if (step?.comparing?.includes(i)) cls += " comparing";
          if (step?.swapping?.includes(i)) cls += " swapping";
          if (step?.sorted?.includes(i)) cls += " sorted";
          return (
            <div
              key={i}
              className={cls}
              style={{ height: `${(v / max) * 100}%` }}
            >
              {bars.length <= 20 && <span>{v}</span>}
            </div>
          );
        })}
      </div>

      <div className="legend">
        <span>
          <i className="dot normal" /> Unsorted
        </span>
        <span>
          <i className="dot comparing" /> Comparing
        </span>
        <span>
          <i className="dot swapping" /> Swapping / writing
        </span>
        <span>
          <i className="dot sorted" /> Sorted
        </span>
      </div>
    </div>
  );
}
