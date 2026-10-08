import { bubbleSort } from "./bubbleSort";
import { selectionSort } from "./selectionSort";
import { insertionSort } from "./insertionSort";
import { mergeSort } from "./mergeSort";
import { quickSort } from "./quickSort";
import { heapSort } from "./heapSort";
export const ALGORITHMS = {
  bubble: {
    name: "Bubble Sort",
    fn: bubbleSort,
    best: "O(n)",
    avg: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
  },
  selection: {
    name: "Selection Sort",
    fn: selectionSort,
    best: "O(n²)",
    avg: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
  },
  insertion: {
    name: "Insertion Sort",
    fn: insertionSort,
    best: "O(n)",
    avg: "O(n²)",
    worst: "O(n²)",
    space: "O(1)",
  },
  merge: {
    name: "Merge Sort",
    fn: mergeSort,
    best: "O(n log n)",
    avg: "O(n log n)",
    worst: "O(n log n)",
    space: "O(n)",
  },
  quick: {
    name: "Quick Sort",
    fn: quickSort,
    best: "O(n log n)",
    avg: "O(n log n)",
    worst: "O(n²)",
    space: "O(log n)",
  },
  heap: {
    name: "Heap Sort",
    fn: heapSort,
    best: "O(n log n)",
    avg: "O(n log n)",
    worst: "O(n log n)",
    space: "O(1)",
  },
};
