const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const games = data.trim().split(/\r?\n/);

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
