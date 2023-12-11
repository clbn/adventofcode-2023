const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const image = data.trim().split(/\r?\n/);
const height = image.length;
const width = image[0].length;

const sum = (factor) => {
  // Gather galaxies and find empty cols/rows
  const galaxies = [];
  const cols = Array(width).fill(true);
  const rows = Array(height).fill(true);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (image[y][x] === '#') {
        galaxies.push({ x, y });
        cols[x] = false;
        rows[y] = false;
      }
    }
  }

  // Accumulate expansion
  for (let i = 0, shift = 0; i < width; i++) {
    if (cols[i]) {
      shift += factor - 1;
    } else {
      cols[i] = shift;
    }
  }
  for (let i = 0, shift = 0; i < height; i++) {
    if (rows[i]) {
      shift += factor - 1;
    } else {
      rows[i] = shift;
    }
  }

  // Expand universe
  for (const g of galaxies) {
    g.x += cols[g.x];
    g.y += rows[g.y];
  }

  // Sum up distances
  let sum = 0;
  for (let a = 0; a < galaxies.length; a++) {
    for (let b = a + 1; b < galaxies.length; b++) {
      const ga = galaxies[a], gb = galaxies[b];
      sum += Math.abs(ga.x - gb.x) + Math.abs(ga.y - gb.y);
    }
  }

  return sum;
}

console.log(sum(2));
console.log(sum(1_000_000));
