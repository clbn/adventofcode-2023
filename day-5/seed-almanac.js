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

// --- Part One ---

let lowest;
for (const seed of seeds) {
  const loc = followChain(maps, seed);
  if (!lowest || lowest > loc) lowest = loc;
}

console.log(lowest);

// --- Part Two ---

const seedRanges = [];
for (let i = 0; i < seeds.length; i += 2) {
  seedRanges.push({ min: seeds[i], max: seeds[i] + seeds[i+1] });
}

const reversedMaps = maps.reverse()
  .map(m => m.map(rule => [ rule[1], rule[0], rule[2] ]));

let lowestest = 0;
while (++lowestest) {
  const seed = followChain(reversedMaps, lowestest);
  if (seedRanges.some(r => seed >= r.min && seed < r.max)) break;
}

console.log(lowestest);
