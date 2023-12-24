const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const hailstones = data.trim().split(/\r?\n/)
  .map(r => r.split(/[@,]/)
    .map(n => +n));

const crossed = (a, b, range) => {
  const [ax, ay, az, adx, ady, adz] = a;
  const [bx, by, bz, bdx, bdy, bdz] = b;
  const [min, max] = range;

  const af = ady / adx;
  const bf = bdy / bdx;
  const x = (af * ax - bf * bx - (ay - by)) / (af - bf);
  const y = af * (x - ax) + ay;
  const within = x >= min && x <= max && y >= min && y <= max;

  const at = (x - ax) / adx;
  const bt = (x - bx) / bdx;
  const future = at > 0 && bt > 0;

  return within && future;
};

const testarea = [7, 27];
// const testarea = [200000000000000, 400000000000000];

let intersections = 0;
for (let a = 0; a < hailstones.length - 1; a++) {
  for (let b = a + 1; b < hailstones.length; b++) {
    const ah = hailstones[a], bh = hailstones[b];
    if (crossed(ah, bh, testarea)) intersections++;
  }
}

console.log(intersections);
