const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const records = data.trim().split(/\r?\n/)
  .map(row => {
    const [springs, groups] = row.split(' ');
    return { springs, groups: groups.split(',').map(n => +n) }
  });

const memo = (fn) => {
  const cache = new Map();
  return (...args) => {
    const key = JSON.stringify(args);
    if (!cache.has(key)) cache.set(key, fn(...args));
    return cache.get(key);
  };
}

const variants = memo((springs, groups) => {
  // Out of springs
  if (!springs.length) {
    if (!groups.length) return 1;
    return 0;
  }

  // Out of groups
  if (!groups.length) {
    if (!springs.match(/#/)) return 1;
    return 0;
  }

  // Not enough springs for groups
  if (springs.length < groups.reduce((acc, v) => acc + v + 1)) {
    return 0;
  }

  // Go deeper with '.'
  if (springs[0] === '.') {
    return variants(springs.slice(1), groups);
  }

  // Go deeper with '#'
  if (springs[0] === '#') {
    const [group, ...rest] = groups;
    if (springs.slice(0, group).match(/\./)) return 0;
    if (springs[group] === "#") return 0;
    return variants(springs.slice(group + 1), rest);
  }

  // Go deeper with '?'
  return variants('#' + springs.slice(1), groups) + variants('.' + springs.slice(1), groups);
});

// --- Part One ---

const sum = records.reduce((acc, { springs, groups }) => {
  return acc + variants(springs, groups);
}, 0);

console.log(sum);

// --- Part Two ---

const unfolded = records.reduce((acc, { springs, groups }) => {
  springs += `?${springs}?${springs}?${springs}?${springs}`;
  groups = groups.concat(groups, groups, groups, groups);
  return acc + variants(springs, groups);
}, 0);

console.log(unfolded);
