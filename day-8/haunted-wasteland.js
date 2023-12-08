const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const [instructions, network] = data.trim().split(/\r?\n\r?\n/);

const graph = network.split(/\r?\n/).map(l => l.match(/\w+/g))
  .reduce((acc, node) => { acc[node[0]] = { L: node[1], R: node[2] }; return acc; }, {});

const follow = (start) => {
  let length = 0;
  for (let current = start; current.slice(-1) !== 'Z'; length++) {
    const instruction = instructions[length % instructions.length];
    current = graph[current][instruction];
  }
  return length;
};

// --- Part One ---

const length = follow('AAA');
console.log(length);

// --- Part Two ---

const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
const lcm = (a, b) => a / gcd(a, b) * b;

const starts = Object.keys(graph).filter(k => k.slice(-1) === 'A');
const ghostPath = starts.reduce((acc, current) => {
  const period = follow(current);
  return lcm(acc, period);
}, 1);
console.log(ghostPath);
