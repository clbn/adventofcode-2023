const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const records = data.trim().split(/\r?\n/)
  .map(row => {
    const [springs, groups] = row.split(' ');
    return { springs, groups: groups.split(',').map(n => +n) }
  });

// Is the bit set to 1 in the number
const bit = (number, index) => (number & (1 << index)) > 0;

const variants = (springs, groups) => {
  const questionMarks = springs.match(/\?/g).length;
  const max = Math.pow(2, questionMarks);
  let matchingCombinations = 0;

  for (let c = 0; c < max; c++) {
    let variant = [];
    for (let i = 0, q = 0, g = -1, prev = '.'; i < springs.length; i++) {
      const next = springs[i] === '?' ? (bit(c, q++) ? '#' : '.') : springs[i];
      if (prev === '.' && next === '#') variant[++g] = 0;
      if (next === '#') variant[g]++;
      prev = next;
    }
    if (variant.length === groups.length && groups.every((v, i) => v === variant[i])) {
      matchingCombinations++;
    }
  }

  return matchingCombinations;
};

const sum = records.reduce((acc, { springs, groups }) => {
  return acc + variants(springs, groups);
}, 0);

console.log(sum);
