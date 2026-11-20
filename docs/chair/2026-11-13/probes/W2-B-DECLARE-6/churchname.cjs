const fs = require('fs'); const d = process.argv[2]; const m = new Map(); let towns = 0;
for (const f of fs.readdirSync(d)) {
  const t = fs.readFileSync(d + '/' + f, 'utf8'); let hit = false;
  for (const s of t.split(/(?<=[.!?;])\s+/)) if (/church['’]s name/i.test(s)) { hit = true; const k = s.trim().slice(-90); m.set(k, (m.get(k) || 0) + 1); }
  if (hit) towns++;
}
console.log('towns', towns); for (const [k, v] of m) console.log(v, k);
