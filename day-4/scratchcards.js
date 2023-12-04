const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const cards = data.trim().split(/\r?\n/);

const matches = cards.map(c => {
  const [winning, mine] = c.split(':')[1].split('|')
    .map(s => s.match(/\d+/g).map(a => +a));
  return winning.filter(l => mine.includes(l)).length;
});

// --- Part One ---

let points = 0;

matches.forEach(m => {
  if (m > 0) points += Math.pow(2, m-1);
});

console.log(points);

// --- Part Two ---

const copies = Array(cards.length).fill(1);
let total = 0;

matches.forEach((m, id) => {
  total += copies[id];
  for (let i = 1; i <= m; i++) copies[id + i] += copies[id];
});

console.log(total);
