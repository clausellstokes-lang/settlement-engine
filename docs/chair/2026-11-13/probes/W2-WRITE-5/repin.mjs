// repin.mjs <vitest-log> : re-pin docs/content/prose-shift-register.json from the contract test's own drift lines
import { readFileSync, writeFileSync } from 'node:fs';
const log = readFileSync(process.argv[2], 'utf8');
const P = 'docs/content/prose-shift-register.json';
const reg = JSON.parse(readFileSync(P, 'utf8'));
const re = /"([a-z-]+) pin (\d+) \((.*?)\): the register pins (.*?) and the corpus measures (.*?)\. If this move/g;
const seen = new Set(); let n = 0;
for (const m of log.matchAll(re)) {
  const [, id, i, , wantRaw, nowRaw] = m; const key = id + i; if (seen.has(key)) continue; seen.add(key);
  const unq = (x) => JSON.parse(JSON.parse('"' + x + '"'));
  const want = unq(wantRaw), now = unq(nowRaw);
  const row = reg.mechanisms.find((r) => r.id === id); const pin = row.pin[+i];
  if (JSON.stringify(pin.value) !== JSON.stringify(want)) throw new Error(`${id} ${i}: register holds ${pin.value}, log says ${want}`);
  pin.value = now; n++; console.log(`${id} pin ${i}: ${JSON.stringify(want)} -> ${JSON.stringify(now)}`);
}
const txt = readFileSync(P, 'utf8');
writeFileSync(P, JSON.stringify(reg, null, txt.includes('\n    "') ? 2 : 1) + (txt.endsWith('\n') ? '\n' : ''));
console.log('repinned', n);
