const fs = require('fs');
const data = fs.readFileSync('input.txt', { encoding: 'utf8' });

const map = data.trim().split(/\r?\n/).map(row => row.split('').map(n => +n));
const height = map.length;
const width = map[0].length;

// Priority queue implementation from https://stackoverflow.com/a/66511107/4235871, where items ordered by item[0]
const MinHeap = {siftDown(h,i=0,v=h[i]){if(i<h.length){let k=v[0];while(1){let j=i*2+1;if(j+1<h.length&&h[j][0]>h[j+1][0])j++;if(j>=h.length||k<=h[j][0])break;h[i]=h[j];i=j;}h[i]=v}},heapify(h){for(let i=h.length>>1;i--;)this.siftDown(h,i);return h},pop(h){return this.exchange(h,h.pop())},exchange(h,v){if(!h.length)return v;let w=h[0];this.siftDown(h,0,v);return w},push(h,v){let k=v[0],i=h.length,j;while((j=(i-1)>>1)>=0&&k<h[j][0]){h[i]=h[j];i=j}h[i]=v;return h}};

const directions = [[0, -1], [1, 0], [0, 1], [-1, 0]];
const distance = (ax, ay, bx, by) => Math.abs(ax - bx) + Math.abs(ay - by);

const getLoss = () => {
  const visited = new Map();
  const queue = [
    [0, { x: 0, y: 0, dx: 1, dy: 0, len: 0, heat: 0 }], // move right
    [0, { x: 0, y: 0, dx: 0, dy: 1, len: 0, heat: 0 }], // move down
  ];
  while (queue.length) {
    const [, cur] = MinHeap.pop(queue);
    if (cur.x === width-1 && cur.y === height-1) return cur.heat;

    for (const [dx, dy] of directions) {
      if (!cur.dx && cur.dy === -dy) continue;
      if (!cur.dy && cur.dx === -dx) continue;

      const x = cur.x + dx;
      const y = cur.y + dy;
      if (!map[y]?.[x]) continue;

      const len = (dx === cur.dx && dy === cur.dy) ? cur.len + 1 : 1;
      if (len > 3) continue;

      const heat = cur.heat + map[y][x];

      const key = [x, y, dx, dy, len].join(',');
      if (visited.get(key) && visited.get(key) <= heat) continue;
      visited.set(key, heat);

      const priority = heat + distance(x, y, width, height);
      MinHeap.push(queue, [priority, { x, y, dx, dy, len, heat }]);
    }
  }
};

const loss = getLoss();
console.log(loss);
