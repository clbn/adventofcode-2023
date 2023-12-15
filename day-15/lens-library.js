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

const sum = seq.reduce((acc, step) => acc + hash(step), 0);
console.log(sum);
