const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const schematic = data.trim().split(/\r?\n/);

const width = schematic[0].length;
const height = schematic.length;

// --- Part One ---
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
const findSymbol = (x, y, pn) => {
  if (isSymbolAround(x - 1, x + pn.length, y)) sum += +pn;
}

// --- Part Two ---
const gearLevels = {}; // How many parts the gear adjacent to
const gearRatios = {}; // The product of those adjacent parts
const handleGear = (x, y, pn) => {
  if (schematic[y]?.[x] === '*') {
    gearLevels[`${x},${y}`] = gearLevels[`${x},${y}`] ? gearLevels[`${x},${y}`] + 1 : 1;
    gearRatios[`${x},${y}`] = gearRatios[`${x},${y}`] ? gearRatios[`${x},${y}`] * pn : pn;
  }
}
const findGear = (x, y, pn) => {
  const xmin = x-1, xmax = x + pn.length;
  for (let xx = xmin; xx <= xmax; xx++) handleGear(xx, y-1, pn);
  for (let xx = xmin; xx <= xmax; xx++) handleGear(xx, y+1, pn);
  handleGear(xmin, y, pn);
  handleGear(xmax, y, pn);
};

// --- Parts One and Two ---
for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    if (!isDigit(x, y)) continue;

    let partNumber = '', dx = 0;
    while (isDigit(x+dx, y)) {
      partNumber += schematic[y]?.[x+dx];
      dx++;
    }

    findSymbol(x, y, partNumber); // --- Part One ---
    findGear(x, y, partNumber); // --- Part Two ---

    x += dx - 1; // move current position to the end of the found number
  }
}

// --- Part One ---
console.log(sum);

// --- Part Two ---
let gearSum = 0;
Object.entries(gearLevels).forEach(([k, v]) => {
  if (v === 2) gearSum += gearRatios[k];
});
console.log(gearSum);
