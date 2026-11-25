// node grievshare.mjs <label=food.jsonl> ... : the grievance slot (`commoner_resentments`) per size: places holding it,
// empty places, the commonest sentence's places / all the size's places (shareAll, the door's bar), the sentence.
// Sentence split as the door's rule (at . ! ? … followed by space and a capital or a quote); digits masked to 0.
import { readFileSync } from 'node:fs';
const SZ = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const split = (t) => t.replace(/\d+/g, '0').split(/(?<=[.!?…])\s+(?=[A-Z"“'‘])/).map((s) => s.trim()).filter(Boolean);
const res = {};
for (const a of process.argv.slice(2)) {
  const [label, f] = a.split('=');
  const rows = readFileSync(f, 'utf8').trim().split('\n').map((l) => JSON.parse(l));
  res[label] = {};
  for (const z of SZ) {
    const rs = rows.filter((r) => r.size === z); const by = new Map(); let held = 0;
    for (const r of rs) { const ss = new Set(split(r.commoner_resentments || '')); if (ss.size) held++; for (const s of ss) by.set(s, (by.get(s) || 0) + 1); }
    let top = '', n = 0; for (const [s, c] of by) if (c > n || (c === n && s < top)) { n = c; top = s; }
    res[label][z] = { of: rs.length, held, top: n, share: +(n / rs.length).toFixed(3), sentence: top };
  }
}
const L = Object.keys(res);
console.log(['size', ...L.map((l) => `${l} share (top/of, held)`), ...L.map((l) => `${l} commonest`)].join('\t'));
for (const z of SZ) console.log([z, ...L.map((l) => { const x = res[l][z]; return `${x.share} (${x.top}/${x.of}, held ${x.held})`; }), ...L.map((l) => res[l][z].sentence.slice(0, 90))].join('\t'));
