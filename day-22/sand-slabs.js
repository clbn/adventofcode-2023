const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const bricks = data.trim().split(/\r?\n/)
  .map(row => row.split('~')
    .map(end => end.split(','))
    .map(end => ({ x: +end[0], y: +end[1], z: +end[2] })))
  .map(([s, e]) => {
    // Make sure brick's start < end
    if (s.x < e.x || s.y < e.y || s.z < e.z) return { s, e };
    return { s: e, e: s };
  })
  .map(({ s, e }, id) => {
    return { id, s, e, below: new Set(), above: new Set() };
  });

// 1. Sort bricks

bricks.sort((a, b) => a.s.z - b.s.z);

// 2. Let them settle

const inc = (n, a, b) => (a <= n && n <= b) || (b <= n && n <= a);

const occupied = (x, y, z) => {
  if (z === 0) return true;
  for (const b of bricks) {
    if (b.s.z > z) continue;
    if (inc(x, b.s.x, b.e.x) && inc(y, b.s.y, b.e.y) && inc(z, b.s.z, b.e.z)) return true;
  }
  return false;
};

const unstable = (b) => {
  let stable = false;
  for (let y = b.s.y; y <= b.e.y; y++)
    for (let x = b.s.x; x <= b.e.x; x++)
      if (occupied(x, y, b.s.z - 1)) stable = true; // there's support below
  return !stable;
};

const lower = (b) => {
  b.s.z--;
  b.e.z--;
};

for (const b of bricks)
  while (unstable(b))
    lower(b);

// 3. Calc neighbors below and above

const { xmax, ymax, zmax } = bricks.reduce((acc, b) => {
  acc.xmax = Math.max(acc.xmax, b.e.x);
  acc.ymax = Math.max(acc.ymax, b.e.y);
  acc.zmax = Math.max(acc.zmax, b.e.z);
  return acc;
}, { xmax: -Infinity, ymax: -Infinity, zmax: -Infinity });

const jenga = Array(zmax + 2).fill(null)
  .map(_ => Array(ymax + 1).fill(null)
    .map(_ => Array(xmax + 1).fill(null)));

for (const b of bricks)
  for (let z = b.s.z; z <= b.e.z; z++)
    for (let y = b.s.y; y <= b.e.y; y++)
      for (let x = b.s.x; x <= b.e.x; x++)
        jenga[z][y][x] = b;

for (const b of bricks) {
  for (let y = b.s.y; y <= b.e.y; y++) {
    for (let x = b.s.x; x <= b.e.x; x++) {
      const na = jenga[b.e.z + 1][y][x]; // neighbor above
      if (na !== null) b.above.add(na);
      const nb = jenga[b.s.z - 1][y][x]; // neighbor below
      if (nb !== null) b.below.add(nb);
    }
  }
}

// --- Part One ---

// A brick is safe to disintegrate if all its aboves rely on more than one
const safe = bricks
  .filter(b => [...b.above]
    .every(na => na.below.size > 1));

console.log(safe.length);

// --- Part Two ---

let sum = 0;
for (const b of bricks) {
  const queue = [b];
  const affected = new Set();

  while (queue.length > 0) {
    const brick = queue.shift();
    affected.add(brick);

    // A brick above will be affected if all its belows are already affected
    const nextAffected = [...brick.above]
      .filter(na => [...na.below]
        .every(nb => affected.has(nb)));

    for (const na of nextAffected)
      queue.push(na);
  }

  sum += affected.size - 1; // don't count the first disintegrated one
}

console.log(sum);
