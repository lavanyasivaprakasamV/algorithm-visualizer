import { useState } from "react";
import SortingVisualizer from "./SortingVisualizer.jsx";
import PathfindingVisualizer from "./PathfindingVisualizer.jsx";
import "./App.css";

export default function App() {
  const [tab, setTab] = useState("sorting");

  return (
    <div className="app">
      <h1>Algorithm Visualizer</h1>
      <div className="tabs">
        <button
          className={tab === "sorting" ? "tab active" : "tab"}
          onClick={() => setTab("sorting")}
        >
          Sorting
        </button>
        <button
          className={tab === "pathfinding" ? "tab active" : "tab"}
          onClick={() => setTab("pathfinding")}
        >
          Pathfinding
        </button>
      </div>
      {tab === "sorting" ? <SortingVisualizer /> : <PathfindingVisualizer />}
    </div>
  );
}
