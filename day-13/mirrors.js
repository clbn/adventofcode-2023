const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const patterns = data.trim().split(/\r?\n\r?\n/).map(p => p.split(/\r?\n/));

const mirrorHo = (p, fp) => {
  const h = p.length;
  for (let y = 1; y < h; y++) {
    if (p[y] === p[y-1] && y !== fp) {
      let confirm = true;
      for (let y1 = y, y2 = y-1; y1 < h && y2 >= 0; y1++, y2--) {
        if (p[y1] !== p[y2]) { confirm = false; break; }
      }
      if (confirm) return y;
    }
  }
  return 0;
};

const mirrorVe = (p, fp) => {
  const w = p[0].length;
  const h = p.length;
  const transposed = [];
  for (let x = 0; x < w; x++) {
    transposed.push('');
    for (let y = 0; y < h; y++) transposed[x] += p[y][x];
  }
  return mirrorHo(transposed, fp);
};

const mirror = (p, fp = 0) => {
  const ho = mirrorHo(p, fp / 100);
  if (ho) return ho * 100;
  return mirrorVe(p, fp);
}

// --- Part One ---

const sum = patterns.reduce((acc, p) => acc + mirror(p), 0);
console.log(sum);

// --- Part Two ---

const mirrorDirty = (p) => {
  const falsePositive = mirror(p);
  const w = p[0].length;
  const h = p.length;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const cleaned = [...p];
      cleaned[y] = cleaned[y].slice(0, x) + (cleaned[y][x] === '#' ? '.' : '#') + cleaned[y].slice(x + 1);
      const r = mirror(cleaned, falsePositive);
      if (r > 0) return r;
    }
  }
  return 0;
};

const sum2 = patterns.reduce((acc, p) => acc + mirrorDirty(p), 0);
console.log(sum2);
