export function neighbors(idx, rows, cols) {
  const r = Math.floor(idx / cols);
  const c = idx % cols;
  const out = [];
  if (r > 0) out.push(idx - cols); // up
  if (c < cols - 1) out.push(idx + 1); // right
  if (r < rows - 1) out.push(idx + cols); // down
  if (c > 0) out.push(idx - 1); // left
  return out;
}

export function buildPath(prev, start, end) {
  const path = [end];
  let cur = end;
  while (cur !== start) {
    cur = prev.get(cur);
    path.push(cur);
  }
  return path.reverse();
}
