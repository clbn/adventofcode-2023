const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const lines = data.trim().split(/\r?\n/);

const sum = lines.reduce((acc, line) => {
  const num = line.replace(/\D/g, '');
  return acc + +(num[0] + num[num.length-1]);
}, 0);

console.log(sum);
