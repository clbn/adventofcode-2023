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

const sumLoad = (p) => {
  let sum = 0;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (p[y][x] === 'O') sum += size - y;
    }
  }
  return sum;
};

const rolled = rollNorth(platform);
const sum = sumLoad(rolled);
console.log(sum);
