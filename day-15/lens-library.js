const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const seq = data.trim().split(/,/);

const hash = (s) => {
  let c = 0;
  for (let i = 0; i < s.length; i++) {
    const n = s.charCodeAt(i);
    c += n;
    c *= 17;
    c %= 256;
  }
  return c;
};

// --- Part One ---

const sum = seq.reduce((acc, step) => acc + hash(step), 0);
console.log(sum);

// --- Part Two ---

const boxes = Array(256).fill(null).map(_ => []);

for (const step of seq) {
  const [label, focal] = step.split(/[-=]/);
  const bi = hash(label);
  const li = boxes[bi].findIndex(l => l.label === label);
  if (focal) {
    if (li > -1) {
      boxes[bi][li].focal = focal;
    } else {
      boxes[bi].push({ label, focal });
    }
  } else {
    if (li > -1) {
      boxes[bi].splice(li, 1);
    }
  }
}

const power = boxes.reduce((acc, box, bi) =>
  acc + (bi + 1) * box.reduce((acc, lens, li) =>
    acc + (li + 1) * lens.focal, 0), 0);

console.log(power);
