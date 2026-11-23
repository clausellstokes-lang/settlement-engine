// VEIL-10, V7-2 measure: compare two prints of second-homes-cost.probe.jsx (before, after).
// For each sample (guard, wide), veil and home: carried by the projection, sent before, sent after; of those newly
// withheld, FAULT (the eye of the source the composer built it from is OPEN) against PRICE (that eye is shut, the
// words did not embed it) and ORPHAN (the source is not in the projection at all: the rule is closed); and anything newly SENT (must be none). node second-homes-cost.diff.mjs <before> <after>
import { readFileSync } from 'node:fs';
const [a, b] = process.argv.slice(2).map((f) => JSON.parse(readFileSync(f, 'utf8')));
const groups = new Map(); const newlySent = []; const hows = new Map();
for (const [key, before] of Object.entries(a)) {
  const after = b[key];
  const [label, dm, vn, homeRaw] = key.split('|');
  const sample = label.split(':')[0]; const home = homeRaw.replace(/#\d+$/, '');
  const g = `${sample} | ${vn} | ${home}`;
  const r = groups.get(g) || { carried: 0, before: 0, after: 0, fault: 0, price: 0, orphan: 0, sourceShutSentAfter: 0 };
  r.carried += 1; if (before.sent) r.before += 1; if (after && after.sent) r.after += 1;
  if (before.sent && !(after && after.sent)) {
    const cls = before.how.startsWith('ORPHAN') ? 'ORPHAN' : before.sourceShut ? 'PRICE' : 'FAULT';
    if (cls === 'ORPHAN') r.orphan += 1; else if (cls === 'PRICE') r.price += 1; else r.fault += 1;
    const hk = `${g} | ${cls} | ${before.how}`; hows.set(hk, (hows.get(hk) || 0) + 1);
  }
  if (!before.sent && after && after.sent) newlySent.push(key);
  if (after && after.sent && after.sourceShut) { r.sourceShutSentAfter += 1; const hk = `${g} | SENT AFTER WITH ITS SOURCE'S EYE SHUT | ${after.how}`; hows.set(hk, (hows.get(hk) || 0) + 1); }
  groups.set(g, r); void dm;
}
console.log('sample | veil | home | carried | sent before | sent after | newly withheld, source OPEN (fault) | newly withheld, source shut (price) | newly withheld, its source not in the projection (orphan, closed) | sent after with its source shut');
for (const [g, r] of [...groups].sort()) console.log(`${g} | ${r.carried} | ${r.before} | ${r.after} | ${r.fault} | ${r.price} | ${r.orphan} | ${r.sourceShutSentAfter}`);
console.log(`\nnewly SENT (must be 0): ${newlySent.length}${newlySent.length ? `\n${newlySent.slice(0, 20).join('\n')}` : ''}`);
console.log('\nthe newly withheld and the still sent with a shut source, by what the composer built the home from:');
for (const [k, n] of [...hows].sort()) console.log(`${n} | ${k}`);
