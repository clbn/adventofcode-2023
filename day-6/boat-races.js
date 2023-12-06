const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const [times, distances] = data.trim().split(/\r?\n/)
  .map(l => l.match(/\d+/g).map(n => +n));

const { ceil, floor, sqrt } = Math;

const getWays = (t, d) => {
  const l = (t - sqrt(t * t - 4 * d)) / 2;
  const r = (t + sqrt(t * t - 4 * d)) / 2;
  return ceil(r) - floor(l) - 1;
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
