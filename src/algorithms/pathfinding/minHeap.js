export class MinHeap {
  constructor() {
    this.items = [];
  }

  get size() {
    return this.items.length;
  }

  push(value, priority) {
    this.items.push({ value, priority });
    this.#up(this.items.length - 1);
  }

  // returns { value, priority } with the smallest priority
  pop() {
    const items = this.items;
    const top = items[0];
    const last = items.pop();
    if (items.length > 0) {
      items[0] = last;
      this.#down(0);
    }
    return top;
  }

  #up(i) {
    const items = this.items;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (items[parent].priority <= items[i].priority) break;
      [items[parent], items[i]] = [items[i], items[parent]];
      i = parent;
    }
  }

  #down(i) {
    const items = this.items;
    const n = items.length;
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let smallest = i;
      if (left < n && items[left].priority < items[smallest].priority)
        smallest = left;
      if (right < n && items[right].priority < items[smallest].priority)
        smallest = right;
      if (smallest === i) break;
      [items[smallest], items[i]] = [items[i], items[smallest]];
      i = smallest;
    }
  }
}
