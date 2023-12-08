const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const [instructions, network] = data.trim().split(/\r?\n\r?\n/);

const graph = network.split(/\r?\n/).map(l => l.match(/\w+/g))
  .reduce((acc, node) => { acc[node[0]] = { L: node[1], R: node[2] }; return acc; }, {});

let length = 0;
for (let current = 'AAA'; current !== 'ZZZ'; length++) {
  const instruction = instructions[length % instructions.length];
  current = graph[current][instruction];
}

console.log(length);
