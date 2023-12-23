const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });

const map = data.trim().split(/\r?\n/);
const height = map.length;
const width = map[0].length;
const moves = { '^': [0, -1], '>': [1, 0], 'v': [0, 1], '<': [-1, 0] };
const directions = Object.values(moves);

const getDirections = (x, y, visited) => {
  const dd = [];
  for (const [dx, dy] of directions) {
    const [nx, ny] = [x+dx, y+dy];
    if (!map[ny]?.[nx]) continue;
    if (moves[map[ny][nx]]) {
      const [mx, my] = moves[map[ny][nx]];
      if (dx !== mx || dy !== my) continue;
    }
    if (map[ny][nx] === '#') continue;
    if (visited.has(`${nx},${ny}`)) continue;
    dd.push([nx, ny]);
  }
  return dd;
};

const start = { x: 1, y: 0 };
const end = { x: width-2, y: height-1 };

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
