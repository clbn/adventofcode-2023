const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const games = data.trim().split(/\r?\n/);

// --- Part One ---

const limits = { red: 12, green: 13, blue: 14 };

const sum = games.reduce((acc, game, index) => {
  const cn = game.match(/\d+ (red|green|blue)/g);

  for (let i = 0; i < cn.length; i++) {
    const [n, c] = cn[i].split(' ');
    if (+n > limits[c]) return acc;
  }

  return acc + index + 1;
}, 0);

console.log(sum);

// --- Part Two ---

const powerSum = games.reduce((acc, game) => {
  const cn = [...game.matchAll(/(\d+) (red|green|blue)/g)];

  const fewest = { red: 0, green: 0, blue: 0 };
  cn.forEach(([, n, c]) => {
    fewest[c] = Math.max(+n, fewest[c]);
  });

  return acc + fewest.red * fewest.green * fewest.blue;
}, 0);

console.log(powerSum);
