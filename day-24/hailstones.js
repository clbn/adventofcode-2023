const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const hailstones = data.trim().split(/\r?\n/)
  .map(r => r.split(/[@,]/)
    .map(n => +n));

// --- Part One ---

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

// --- Part Two ---

(async () => {
  const { init } = require('z3-solver');
  const { Context } = await init();
  const { Solver, Real } = new Context('main');

  const x = Real.const('x');
  const y = Real.const('y');
  const z = Real.const('z');
  const dx = Real.const('dx');
  const dy = Real.const('dy');
  const dz = Real.const('dz');

  const solver = new Solver();
  for (let i = 0; i < 3; i++) {
    const [sx, sy, sz, sdx, sdy, sdz] = hailstones[i];
    const t = Real.const(`t${i}`);
    solver.add(t.ge(0));
    solver.add(x.add(dx.mul(t)).eq(t.mul(sdx).add(sx)));
    solver.add(y.add(dy.mul(t)).eq(t.mul(sdy).add(sy)));
    solver.add(z.add(dz.mul(t)).eq(t.mul(sdz).add(sz)));
  }

  await solver.check();
  const model = solver.model();
  const rx = +model.eval(x);
  const ry = +model.eval(y);
  const rz = +model.eval(z);
  const sum = rx + ry + rz;

  console.log(sum);
  process.exit();
})();
