const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });

const getHandPower = (hand) => {
  const groups = {};
  for (const card of hand.split('')) {
    groups[card] = groups[card] ? groups[card] + 1 : 1;
  }

  const buckets = Object.values(groups);
  buckets.sort().reverse();

  return (buckets[0] * 10 + (buckets[1] || 0)); // Five of a kind = 50, full house = 32, etc
};

const compareLines = (a, b) => {
  const tt = getHandPower(a[0]) - getHandPower(b[0]);
  if (tt === 0) {
    if (a[0] < b[0]) return -1;
    if (a[0] > b[0]) return 1;
    return 0;
  }
  return tt;
};

const mapping = { 'T': 'b', 'J': 'c', 'Q': 'd', 'K': 'e', 'A': 'f' };
const lines = data
  .replace(/([TJQKA])/g, m => (mapping[m]))
  .trim().split(/\r?\n/).map(l => l.split(' '));

lines.sort(compareLines);

const winnings = lines.reduce((acc, v, i) => acc + +v[1] * (+i + 1), 0);
console.log(winnings);
