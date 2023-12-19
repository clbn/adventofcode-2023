const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const [rawWorkflows, rawParts] = data.trim().split(/\r?\n\r?\n/);

const workflows = rawWorkflows.split(/\r?\n/).reduce((acc, w) => {
  const [id, rules] = w.split(/[}{]/);
  acc[id] = rules.split(',').map(r => {
    const [cond, dest] = r.split(':');
    if (!dest) return { cond: 'true', dest: r }; // the last unconditional rule
    return { cond, dest };
  });
  return acc;
}, {});

const parts = rawParts.split(/\r?\n/)
  .map(p => [...p.matchAll(/\d+/g)].map(cat => +cat[0]));

let accepted = 0;
for (const [x, m, a, s] of parts) {
  let workflow = workflows['in'];
  loop:
  while (true) {
    for (const { cond, dest } of workflow) {
      if (eval(cond)) { // 🤓
        if (dest === 'R') break loop;
        if (dest === 'A') {
          accepted += x + m + a + s;
          break loop;
        }
        workflow = workflows[dest];
        break;
      }
    }
  }
}

console.log(accepted);
