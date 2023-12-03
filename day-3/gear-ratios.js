const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const schematic = data.trim().split(/\r?\n/);

const width = schematic[0].length;
const height = schematic.length;

let sum = 0;
const isDigit = (x, y) => schematic[y]?.[x] && schematic[y]?.[x].match(/\d/);
const isSymbol = (x, y) => schematic[y]?.[x] && !isDigit(x, y) && schematic[y]?.[x] !== '.';
const isSymbolAround = (xmin, xmax, y) => {
  for (let xx = xmin; xx <= xmax; xx++) if (isSymbol(xx, y-1)) return true;
  for (let xx = xmin; xx <= xmax; xx++) if (isSymbol(xx, y+1)) return true;
  if (isSymbol(xmin, y)) return true;
  if (isSymbol(xmax, y)) return true;
  return false;
};

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (!isDigit(x, y)) continue;

    let partNumber = '', dx = 0;
    while (isDigit(x+dx, y)) {
      partNumber += schematic[y]?.[x+dx];
      dx++;
    }

    if (isSymbolAround(x - 1, x + dx, y)) {
      sum += +partNumber;
    }

    x += dx - 1;
  }
}

console.log(sum);
