const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const plan = data.trim().split(/\r?\n/);

const directions = { 'R': [1, 0], 'D': [0, 1], 'L': [-1, 0], 'U': [0, -1] };

const steps = plan.map(step => {
  const s = step.split(' ');
  return [...directions[s[0]], +s[1]];
});

let current = { x: 0, y: 0 };
const polygon = [current];
let perimeter = 1; // Besides main perimeter area, there's 4 extra squares, 1/4 m² each
for (const [dx, dy, len] of steps) {
  current = { x: current.x + dx * len, y: current.y + dy * len };
  polygon.push(current);
  perimeter += len / 2; // Every piece of "perimeter" is LEN m long and 1/2 m wide
}

let area = 0; // Calculating polygon area using "shoelace formula"
for (let i = 1; i < polygon.length; i++) {
  area += polygon[i].x * polygon[i-1].y - polygon[i-1].x * polygon[i].y;
}
area = Math.abs(area) / 2;

console.log(area + perimeter);
