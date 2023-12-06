const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const [times, distances] = data.trim().split(/\r?\n/)
  .map(l => l.match(/\d+/g).map(n => +n));

const getWays = (time, distance) => {
  let c = 0;
  for (let w = 0; w <= time; w++) {
    if (w * (time - w) > distance) c++;
  }
  return c;
};

// --- Part One ---

let product = 1;
for (const i in times) {
  product *= getWays(times[i], distances[i]);
}
console.log(product);

// --- Part Two ---

const time = +times.reduce((acc, t) => acc + t, '');
const distance = +distances.reduce((acc, t) => acc + t, '');
const ways = getWays(time, distance);
console.log(ways);
