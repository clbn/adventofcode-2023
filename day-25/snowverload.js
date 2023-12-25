const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });

const graph = data.trim().split(/\r?\n/)
  .map(row => {
    const [from, to] = row.split(': ');
    const nodes = to.split(' ');
    return [from, nodes];
  })
  .reduce((acc, [name, edges]) => {
    if (!acc[name]) acc[name] = { name, links: [] };
    for (const e of edges) {
      if (!acc[e]) acc[e] = { name: e, links: [] };
      acc[name].links.push(acc[e]);
      acc[e].links.push(acc[name]);
    }
    return acc;
  }, {});

// Find path from A to B, but don't walk the edges
// we've seen before
const getPath = (a, b, seen) => {
  const visited = new Set();
  const queue = [[a, []]];
  while (queue.length > 0) {
    const [node, path] = queue.shift();
    if (node === b) return path;
    for (const link of node.links) {
      const edge = node.name + link.name;
      if (seen.has(edge)) continue;
      if (visited.has(link)) continue;
      visited.add(link);
      queue.push([link, [...path, edge]]);
    }
  }
  return null;
};

const nodes = Object.values(graph);
const start = nodes.shift();
let black = 1, white = 0;

// If there's more than three paths between A and B,
// they must belong to the same cluster
for (const end of nodes) {
  const seen = new Set();
  for (let i = 0; i < 3; i++) {
    const path = getPath(start, end, seen);
    for (let edge of path) seen.add(edge);
  }
  const hasFourthPath = getPath(start, end, seen);
  if (hasFourthPath) black++; else white++;
}

console.log(black * white);
