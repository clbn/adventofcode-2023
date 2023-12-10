const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const maze = data.trim().split(/\r?\n/);
const height = maze.length;
const width = maze[0].length;

const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];

const pipes = {
  'L': [[0, -1], [1, 0]],
  '|': [[0, -1], [0, 1]],
  'J': [[0, -1], [-1, 0]],
  'F': [[1, 0], [0, 1]],
  '-': [[1, 0], [-1, 0]],
  '7': [[0, 1], [-1, 0]],
};

const getStartNeighbors = (x, y) => {
  const neighbors = [];
  for (const [dx, dy] of directions) {
    const neighbor = maze[y + dy][x + dx];
    if (!pipes[neighbor]) continue;
    const conn1 = pipes[neighbor][0];
    const conn2 = pipes[neighbor][1];
    if ((dx === -conn1[0] && dy === -conn1[1]) || (dx === -conn2[0] && dy === -conn2[1])) {
      neighbors.push([dx, dy]);
    }
  }
  return neighbors;
};

const getNext = (px, py, x, y) => {
  const here = maze[y][x];
  for (const [dx, dy] of pipes[here]) {
    if (x + dx === px && y + dy === py) continue; // we came from that direction, don't want to go back
    return [x, y, x + dx, y + dy];
  }
};

// Start tile
const sy = maze.findIndex(row => row.includes('S'));
const sx = maze[sy].indexOf('S');

// Current tile
const [dx, dy] = getStartNeighbors(sx, sy)[0];
let [x, y] = [sx + dx, sy + dy];

// Previous tile
let [px, py] = [sx, sy];

// --- Part One ---

let length = 1;
const loop = Array(height).fill(false).map(_ => Array(width).fill('.')); // Part Two
loop[y][x] = maze[y][x]; // Part Two
while (maze[y][x] !== 'S') {
  [px, py, x, y] = getNext(px, py, x, y);
  length++;
  loop[y][x] = maze[y][x]; // Part Two
}

const farthest = length / 2;
console.log(farthest);

// --- Part Two ---

// Replace S with appropriate pipe
const [[nx1, ny1], [nx2, ny2]] = getStartNeighbors(sx, sy);
loop[sy][sx] = Object.keys(pipes).find(p => {
  const [[dx1, dy1], [dx2, dy2]] = pipes[p];
  return (dx1 === nx1 && dy1 === ny1 && dx2 === nx2 && dy2 === ny2);
});

// Count enclosed tiles with even-odd rule
let enclosed = 0;
for (let y = 1; y < height - 1; y++) {
  let verticals = 0;
  for (let x = 0; x < width; x++) {
    const here = loop[y][x];
    if (here === '|' || here === 'F' || here === '7') verticals++;
    if (here === '.' && verticals % 2) enclosed++;
  }
}

console.log(enclosed);
