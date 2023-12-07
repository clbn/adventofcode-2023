const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });

const getHandPower = (part) => (hand) => {
  const groups = {};
  for (const card of hand.split('')) {
    groups[card] = groups[card] ? groups[card] + 1 : 1;
  }

  let jokers;
  if (part === 2) {
    jokers = groups['#'] || 0;
    if (jokers === 5) return 50; // Five of a kind, all jokers
    delete groups['#'];
  }

  const buckets = Object.values(groups);
  buckets.sort().reverse();

  if (part === 2) {
    buckets[0] += jokers;
  }

  return (buckets[0] * 10 + (buckets[1] || 0)); // Five of a kind = 50, full house = 32, etc
};

const compareLines = (part) => (a, b) => {
  const tt = getHandPower(part)(a[0]) - getHandPower(part)(b[0]);
  if (tt === 0) {
    if (a[0] < b[0]) return -1;
    if (a[0] > b[0]) return 1;
    return 0;
  }
  return tt;
};

const answer = (part, mapping) => {
  const lines = data
    .replace(/([TJQKA])/g, m => (mapping[m]))
    .trim().split(/\r?\n/).map(l => l.split(' '));

  lines.sort(compareLines(part));

  return lines.reduce((acc, v, i) => acc + +v[1] * (+i + 1), 0);
}

// --- Part One ---

const winnings = answer(1, { 'T': 'b', 'J': 'c', 'Q': 'd', 'K': 'e', 'A': 'f' });
console.log(winnings);

// --- Part Two ---

const winnings2 = answer(2, { 'T': 'b', 'J': '#', 'Q': 'd', 'K': 'e', 'A': 'f' });
console.log(winnings2);
