const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const histories = data.trim().split(/\r?\n/)
  .map(h => h.split(' ').map(n => +n));

const predict = (h) => {
  const h2 = [];
  for (let i = 1; i < h.length; i++) {
    h2.push(h[i] - h[i-1]);
  }
  const next = h2.some(e => e) ? predict(h2) : 0;
  return h.at(-1) + next;
};

// --- Part One ---

const future = histories.reduce((acc, h) => acc + predict(h), 0);
console.log(future);

// --- Part Two ---

const past = histories.reduce((acc, h) => acc + predict(h.reverse()), 0);
console.log(past);
