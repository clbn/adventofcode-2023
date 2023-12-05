const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const sections = data.trim().split(/\r?\n\r?\n/);

const seeds = sections[0].match(/\d+/g).map(n => +n);

const maps = sections.slice(1)
  .map(m => m.split(/\r?\n/).slice(1)
    .map(line => line.match(/\d+/g)
      .map(n => +n)));

const followChain = (maps, start) => {
  let next = start;
  for (const rules of maps) {
    for (const [dst, src, len] of rules) {
      if (next >= src && next < src + len) {
        next = dst + next - src;
        break;
      }
    }
  }
  return next;
};

let lowest;
for (const seed of seeds) {
  const loc = followChain(maps, seed);
  if (!lowest || lowest > loc) lowest = loc;
}

console.log(lowest);
