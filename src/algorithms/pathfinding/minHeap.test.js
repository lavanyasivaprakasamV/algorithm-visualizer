import { describe, it, expect } from "vitest";
import { MinHeap } from "./minHeap.js";

describe("MinHeap", () => {
  it("starts empty", () => {
    expect(new MinHeap().size).toBe(0);
  });

  it("pops items in ascending priority order", () => {
    const heap = new MinHeap();
    [5, 1, 4, 2, 3, 9, 0, 7].forEach((p) => heap.push(`item-${p}`, p));

    const popped = [];
    while (heap.size > 0) popped.push(heap.pop().priority);

    expect(popped).toEqual([0, 1, 2, 3, 4, 5, 7, 9]);
  });

  it("returns the value together with its priority", () => {
    const heap = new MinHeap();
    heap.push("far", 10);
    heap.push("near", 1);
    expect(heap.pop()).toEqual({ value: "near", priority: 1 });
  });

  it("works when pushes and pops are mixed", () => {
    const heap = new MinHeap();
    heap.push("a", 5);
    heap.push("b", 2);
    expect(heap.pop().value).toBe("b");
    heap.push("c", 1);
    expect(heap.pop().value).toBe("c");
    expect(heap.pop().value).toBe("a");
  });
});
