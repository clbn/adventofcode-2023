const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const [rawWorkflows, rawParts] = data.trim().split(/\r?\n\r?\n/);

// --- Part One ---
{
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
}

// --- Part Two ---
{
  const workflows = rawWorkflows.split(/\r?\n/).reduce((acc, w) => {
    const [id, rules] = w.split(/[}{]/);
    acc[id] = rules.split(',').map(r => {
      const [cond, dest] = r.split(':');
      if (!dest) return { dest: r }; // the last unconditional rule
      return { op: cond.slice(0, 2), num: +cond.slice(2), dest };
    });
    return acc;
  }, {});

  // Check if n is included in interval (a, b]
  const included = (n, a, b) => (a < n && n <= b) || (b < n && n <= a);

  // Define which interval needs splitting, and whether we add 1 or subtract 1
  const opToCat = {
    'x>': [1, 2, 1],
    'x<': [2, 1, -1],
    'm>': [3, 4, 1],
    'm<': [4, 3, -1],
    'a>': [5, 6, 1],
    'a<': [6, 5, -1],
    's>': [7, 8, 1],
    's<': [8, 7, -1],
  };

  const start = ['in', 1, 4000, 1, 4000, 1, 4000, 1, 4000]; // Workflow ID, then four intervals
  const queue = [start];
  let accepted = 0;

  while (queue.length > 0) {
    const current = queue.shift();

    // Completed branches
    const [w, x1, x2, m1, m2, a1, a2, s1, s2] = current;
    if (w === 'R') continue;
    if (w === 'A') {
      accepted += (x2 - x1 + 1) * (m2 - m1 + 1) * (a2 - a1 + 1) * (s2 - s1 + 1);
      continue;
    }

    // Incomplete branches
    for (const { op, num, dest } of workflows[w]) {
      current[0] = dest;

      if (!op) {
        // End of the workflow, move on to the next
        queue.push(current);
        break;
      }

      const [left, right, one] = opToCat[op];

      if (included(num, current[left], current[right])) {
        // Split a branch with a part of the interval
        const branch = [...current];
        branch[left] = num + one;
        queue.push(branch);
        // Continue current workflow with the rest of the interval
        current[right] = num;
      }
    }
  }

  console.log(accepted);
}
