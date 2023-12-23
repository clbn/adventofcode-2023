const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });

const map = data.trim().split(/\r?\n/);
const height = map.length;
const width = map[0].length;
const moves = { '^': [0, -1], '>': [1, 0], 'v': [0, 1], '<': [-1, 0] };
const directions = Object.values(moves);

const getDirections = (x, y, visited, from = {}) => {
  const dd = [];
  for (const [dx, dy] of directions) {
    const [nx, ny] = [x+dx, y+dy];
    if (!map[ny]?.[nx]) continue;
    if (moves[map[ny][nx]] && !from.x) { // Part One
      const [mx, my] = moves[map[ny][nx]];
      if (dx !== mx || dy !== my) continue;
    }
    if (map[ny][nx] === '#') continue;
    if (nx === from.x && ny === from.y) continue; // Part Two
    if (visited.has(`${nx},${ny}`)) continue;
    dd.push([nx, ny]);
  }
  return dd;
};

const start = { x: 1, y: 0, edges: [] };
const end = { x: width-2, y: height-1, edges: [] };

// --- Part One ---

let queue = [[start.x, start.y, 0, new Set()]];
let longest = 0;
while (queue.length) {
  let [x, y, len, visited] = queue.pop();
  visited.add(`${x},${y}`);
  while (x !== end.x || y !== end.y) {
    const dd = getDirections(x, y, visited);
    if (dd.length > 1) {
      dd.slice(1).forEach(([nx, ny]) =>
        queue.push([nx, ny, len + 1, new Set([...visited])]));
    }
    [x, y] = dd[0];
    len++;
    visited.add(`${x},${y}`);
  }
  longest = Math.max(longest, len);
}

console.log(longest);

// --- Part Two ---

// 1. Populate graph edges

const graph = [start, end];
const visited = new Set();
queue = [[start, start.x, start.y + 1]];
while (queue.length) {
  let [from, x, y] = queue.pop();

  let len = 1;
  while (true) {
    const dd = getDirections(x, y, visited, from);
    if (dd.length === 0) break; // dead end
    if (dd.length > 1) { // fork
      const to = { x, y, edges: [] };
      graph.push(to);
      from.edges.push({ node: to, weight: len });
      to.edges.push({ node: from, weight: len });
      dd.forEach(([nx, ny]) =>
        queue.push([to, nx, ny]));
      break;
    }

    const maybeNode = graph.find(n => n.x === dd[0][0] && n.y === dd[0][1]);
    if (maybeNode) { // circled back to a visited node
      from.edges.push({ node: maybeNode, weight: len + 1});
      maybeNode.edges.push({ node: from, weight: len + 1});
      break;
    }

    visited.add(`${x},${y}`);
    [x, y] = dd[0];
    len++;
  }
}

// 2. Find longest path in graph

queue = [[start, 0, new Set()]];
longest = 0;
while (queue.length) {
  let [node, len, visited] = queue.pop();
  visited.add(node);
  while (node !== end) {
    const next = node.edges.filter(e => !visited.has(e.node));
    if (next.length === 0) break;
    if (next.length > 1) {
      next.slice(1).forEach(({ node, weight }) =>
        queue.push([node, len + weight, new Set([...visited])]));
    }
    node = next[0].node;
    len += next[0].weight;
    visited.add(node);
  }
  longest = Math.max(longest, len);
}

console.log(longest);
