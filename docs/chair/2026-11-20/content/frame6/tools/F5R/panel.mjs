// probe: on the framed owner sheets whose seat-holder is no face, is he among Session Mode's panel (its filter, verbatim)?
import fs from 'node:fs';
const [POOL, R] = process.argv.slice(2);
const { composeTonightSheet } = await import(R + 'domain/summary/tonightSheet.js');
const { towns } = JSON.parse(fs.readFileSync(POOL, 'utf8'));
let n = 0, inPanel = 0; const out = [];
for (const { seed, s } of towns) {
  const ow = composeTonightSheet(s, { audience: 'owner' }); if (!ow.frame) continue;
  const seat = composeTonightSheet(s).people.find((p) => p.why === 'seat');
  if (ow.frame.sides.some((x) => x.name === seat.name)) continue;
  n++;
  const shown = new Set(ow.people.map((p) => p.name));
  const npcs = (s.npcs || []).filter((x) => !shown.has(x?.name)).slice().sort((a, b) => (b?.power || 0) - (a?.power || 0)).slice(0, 8);
  const at = npcs.findIndex((x) => x.name === seat.name);
  if (at >= 0) inPanel++; else out.push(seed);
}
console.log(JSON.stringify({ n, inPanel, out }));
