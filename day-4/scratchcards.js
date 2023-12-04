const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const cards = data.trim().split(/\r?\n/);

let points = 0;

cards.forEach(c => {
  const [winning, mine] = c.split(':')[1].split('|')
    .map(s => s.match(/\d+/g).map(a => +a));

  const m = winning.filter(l => mine.includes(l)).length;

  if (m > 0) points += Math.pow(2, m-1);
});

console.log(points);
