const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });
const modules = data.trim().split(/\r?\n/)
  .reduce((acc, row) => {
    const [, type, name, dest] = row.match(/^([%&]?)(\w+) -> (.+)$/);
    acc[name] = {
      type,
      name,
      flip: false, // state of flip-flop module
      inputs: {}, // state of conjunction inputs
      dest: dest.split(', ')
    };
    return acc;
  }, {});

const setInitialStates = () => {
  for (const m of Object.values(modules)) {
    m.flip = false;
    for (const d of m.dest) {
      if (modules[d]?.type === '&') modules[d].inputs[m.name] = false;
    }
  }
};

const pushButton = (times, start, exits = []) => {
  setInitialStates();
  let lows = 0, highs = 0;

  for (let i = 1; i <= times; i++) {
    const queue = [start];

    while (queue.length > 0) {
      const [src, pulse, name] = queue.shift();

      if (pulse) highs++; else lows++; // Part One
      if (pulse === false && exits.includes(name)) return i; // Part Two

      const module = modules[name];
      if (!module) continue;

      if (module.type === '%') {
        if (pulse) continue;
        module.flip = !module.flip;
        for (const d of module.dest) {
          queue.push([name, module.flip, d]);
        }
      } else if (module.type === '&') {
        module.inputs[src] = pulse;
        const allHigh = Object.values(module.inputs).every(v => v);
        for (const d of module.dest) {
          queue.push([name, !allHigh, d]);
        }
      } else { // broadcaster
        for (const d of module.dest) {
          queue.push([name, pulse, d]);
        }
      }
    }
  }
  return lows * highs; // Part One
}

// --- Part One ---

const pulses = pushButton(1000, ['button', false, 'broadcaster']);
console.log(pulses);

// --- Part Two ---

const entrances = modules['broadcaster'].dest;
const gate = Object.values(modules).find(m => m.dest[0] === 'rx').name;
const exits = Object.values(modules).filter(m => m.dest[0] === gate).map(m => m.name);

let lcm = 1;
for (const e of entrances) {
  lcm *= pushButton(10000, ['broadcaster', false, e], exits);
}
console.log(lcm);
