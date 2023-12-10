const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const maze = data.trim().split(/\r?\n/);

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

let length = 1;
while (maze[y][x] !== 'S') {
  [px, py, x, y] = getNext(px, py, x, y);
  length++;
}

const farthest = length / 2;
console.log(farthest);
