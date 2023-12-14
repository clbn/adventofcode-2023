const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const platform = data.trim().split(/\r?\n/).map(row => row.split(''));

const size = platform.length; // the platform is square

const roll = (row) => {
  // Rolling one row to the left
  for (let i = 0, spot = 0; i < size; i++) {
    if (row[i] === 'O') {
      if (spot < i) {
        row[spot] = 'O';
        row[i] = '.';
      }
      spot++;
    } else if (row[i] === '#') {
      spot = i + 1;
    }
  }
  return row;
};

const rollNorth = (p) => {
  for (let x = 0; x < size; x++) {
    const col = roll(p.map(row => row[x]));
    for (let y = 0; y < size; y++) {
      p[y][x] = col[y];
    }
  }
  return p;
};

const rollSouth = (p) => rollNorth(p.reverse()).reverse();
const rollWest = (p) => p.map(row => roll(row));
const rollEast = (p) => p.map(row => roll(row.reverse()).reverse());

const sumLoad = (p) => {
  let sum = 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (p[y][x] === 'O') sum += size - y;
    }
  }
  return sum;
};

// --- Part One ---

const rolled = rollNorth(platform);
const sum = sumLoad(rolled);
console.log(sum);

// --- Part Two ---

let p = platform;
const cache = [];
let first, second, milestone;
for (let i = 0; i < 500; i++) {
  const key = JSON.stringify(p);
  if (!first) {
    if (cache.includes(key)) { first = i; milestone = key; }
  } else if (!second) {
    if (key === milestone) { second = i; break; }
  }
  p = rollNorth(p);
  p = rollWest(p);
  p = rollSouth(p);
  p = rollEast(p);
  cache.push(key);
}

// 1_000_000_000 = head + period * N + tail
const period = second - first;
const head = first - period;
const tail = (1_000_000_000 - head) % period;
p = JSON.parse(cache[head + tail]);

const sum2 = sumLoad(p);
console.log(sum2);
