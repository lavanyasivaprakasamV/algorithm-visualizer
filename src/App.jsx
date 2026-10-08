import { useState, useRef, useEffect } from "react";
import { bubbleSort } from "./algorithms/bubbleSort";
import "./App.css";

const randomArray = (n = 30) =>
  Array.from({ length: n }, () => Math.floor(Math.random() * 95) + 5);

export default function App() {
  const [array, setArray] = useState(randomArray());
  const [step, setStep] = useState(null);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(70); // 1 (slow) to 100 (fast)
  const [stats, setStats] = useState({ comparisons: 0, swaps: 0 });
  const gen = useRef(null);

  const advance = () => {
    if (!gen.current) gen.current = bubbleSort(array);
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

  const reset = () => {
    setPlaying(false);
    gen.current = null;
    setStep(null);
    setStats({ comparisons: 0, swaps: 0 });
    setArray(randomArray());
  };

  useEffect(() => {
    if (!playing) return;
    const id = setInterval(advance, 1000 - speed * 9);
    return () => clearInterval(id);
  }, [playing, speed]);

  const bars = step ? step.array : array;

  return (
    <div className="app">
      <h1>Algorithm Visualizer</h1>
      <div className="controls">
        <button onClick={() => setPlaying((p) => !p)}>
          {playing ? "Pause" : "Play"}
        </button>
        <button onClick={advance} disabled={playing}>
          Step
        </button>
        <button onClick={reset}>New array</button>
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
      <div className="stats">
        Comparisons: {stats.comparisons} | Swaps: {stats.swaps}
      </div>
      <div className="bars">
        {bars.map((v, i) => {
          let cls = "bar";
          if (step?.comparing?.includes(i)) cls += " comparing";
          if (step?.swapping?.includes(i)) cls += " swapping";
          if (step && i >= step.sortedFrom) cls += " sorted";
          if (step?.type === "done") cls += " sorted";
          return <div key={i} className={cls} style={{ height: `${v}%` }} />;
        })}
      </div>
    </div>
  );
}
