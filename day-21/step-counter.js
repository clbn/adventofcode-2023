const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const garden = data.trim().split(/\r?\n/).map(row => row.split(''));

const sy = garden.findIndex(row => row.includes('S'));
const sx = garden[sy].indexOf('S');
const size = garden.length;

const rocky = (x, y) => {
  const nx = (x % size + size) % size;
  const ny = (y % size + size) % size;
  return garden[ny][nx] === '#';
};

const limit = 64; // Part One
let reach = 0;

const crazyLimit = 26501365; // Part Two
const mod = crazyLimit % size;
const needed = mod + 2 * size;
const seq = {};

const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const start = [sx, sy, 0];
const queue = [start];
const visited = new Set();
let even = 0;
let odd = 0;

while (queue.length > 0) {
  const [x, y, step] = queue.shift();

  if (visited.has(`${x},${y}`)) continue;
  visited.add(`${x},${y}`);

  if (step % 2 === 0) even++; else odd++;
  if (step === limit) reach = step % 2 ? odd : even; // Part One
  if ((step - mod) % size === 0) seq[step] = step % 2 ? odd : even; // Part Two
  if (step === needed) continue;

  for (const [dx, dy] of directions) {
    if (rocky(x+dx, y+dy)) continue;
    queue.push([x+dx, y+dy, step+1]);
  }
}

// --- Part One ---

console.log(reach);

// --- Part Two ---

// A sequence prediction from Day 9
const predict = (h) => {
  const h2 = [];
  for (let i = 1; i < h.length; i++) {
    h2.push(h[i] - h[i-1]);
  }
  const next = h2.some(e => e) ? predict(h2) : 0;
  return h.at(-1) + next;
};

const keys = Object.keys(seq).map(n => +n);
const values = Object.values(seq);
while (keys.at(-1) < 26501365) {
  keys.push(predict(keys));
  keys.shift();
  values.push(predict(values));
  values.shift();
}

const madReach = values.at(-1);
console.log(madReach)
