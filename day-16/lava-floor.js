const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const tiles = data.trim().split(/\r?\n/);

const width = tiles[0].length;
const height = tiles.length;

const visited = new Set();
const energized = new Set();
const queue = [[0, 0, 1, 0]];

while (queue.length > 0) {
  const [x, y, dx, dy] = queue.shift();

  if (visited.has(`${x},${y},${dx},${dy}`)) continue;
  if (x < 0 || x >= width || y < 0 || y >= height) continue;

  visited.add(`${x},${y},${dx},${dy}`);
  energized.add(`${x},${y}`);

  const t = tiles[y][x];
  if (t === '|' && dx) { queue.push([x, y+1, 0, 1]); queue.push([x, y-1, 0, -1]); } // split up and down
  if (t === '-' && dy) { queue.push([x+1, y, 1, 0]); queue.push([x-1, y, -1, 0]); } // split left and right
  if (t === '\\') { queue.push([x+dy, y+dx, dy, dx]); } // turn
  if (t === '/') { queue.push([x-dy, y-dx, -dy, -dx]); } // turn
  if (t === '.' || t === '-' && dx || t === '|' && dy) { queue.push([x+dx, y+dy, dx, dy]); } // move along
}

console.log(energized.size);
