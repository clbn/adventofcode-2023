const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const lines = data.trim().split(/\r?\n/);

// --- Part One ---

const sum = lines.reduce((acc, line) => {
  const num = line.replace(/\D/g, '');
  return acc + +(num[0] + num[num.length-1]);
}, 0);

console.log(sum);

// --- Part Two ---

const words = ['\\d', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
const re = new RegExp(`(?=(${words.join('|')}))`, 'g'); // a lookahead assertion, for overlapping matches ("oneight" -> "18")
const anotherSum = lines.reduce((acc, line) => {
  const m = [...line.matchAll(re)];
  const first = +m[0][1] || words.indexOf(m[0][1]);
  const last = +m[m.length-1][1] || words.indexOf(m[m.length-1][1]);
  return acc + 10 * first + last;
}, 0);

console.log(anotherSum);
