import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);
const L = require('./load.cjs')(process.argv[2]); const T = process.env.TREE; const fs=require('fs');
const { deriveMagicReliance } = await import(T + '/src/domain/magicReliance.js'); const c = {}; let printedNone=0, printedNothing=0, inClass=0, offZeroPct=0;
for (const { seed, s } of L) { const f = s.economicState.foodSecurity; const mp = f.foodRecord?.magicPct || 0;
  if (Math.round(f.magicOffset||0)===0 && mp>0) offZeroPct++;
  if (!(mp > 0)) continue; const r = deriveMagicReliance(s); c[r.reading] = (c[r.reading] || 0) + 1;
  const d = process.env.DUMPS + '/' + seed + '.txt'; if (!fs.existsSync(d)) continue; const t = fs.readFileSync(d, 'utf8');
  const tabs = t.split('\n== PDF/')[0];
  if (/Reliance on magic: None/.test(tabs)) printedNone++; if (/Nothing structural depends on arcane work/.test(tabs)) printedNothing++;
  if (/Reliance on magic: None/.test(tabs) || /Nothing structural depends on arcane work/.test(tabs)) inClass++; }
console.log(JSON.stringify({ readings: c, printedNone, printedNothing, inClass, offZeroPct }));
