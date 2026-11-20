// project2.mjs <tree> <rows.jsonl> [broad] — PROJECTED top share by size under the approved keyed-hash pick
// (argmax hashKey(seed::governanceNarrative:<POOL>::<id>) over the lines whose needs hold at the site with config), with:
// the GRAZING pool + the three new atoms read BY NAME (strict: the row "Water source"; `broad`: "Multiple water sources" too),
// the LEVIES pool, and the military rung's three sub-branch pools. Every other place keeps its masked sentence.
import { readFileSync } from 'node:fs';
import { rungOf } from './rungs.mjs';
import { GRAZING_POOL, LEVIES_POOL } from './drafts.mjs';
import { GRAZING_NEW, MILITARY_A, MILITARY_B, MILITARY_C } from './drafts2.mjs';
const [, , L, F, mode] = process.argv;
const { hashKey } = await import(`${L}/src/domain/display/stateProse/stateProseKernel.js`);
const rows = readFileSync(F, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const NAME = { 'Water source': mode === 'broad' ? /^(multiple )?water sources?$/i : /^water source$/i, 'Access to external mill': /^access to external mill$/i, 'Common grazing land': /^common grazing land$/i };
const holds = (r, a) => a === 'tier: village' ? r.size === 'village' : NAME[a] ? r.names.some((n) => NAME[a].test(n)) : r.siteCfg[a] === true;
const pick = (r, pool, id) => { let best = null, bk = -1; for (const l of pool) if (l.needs.every((a) => holds(r, a))) { const k = hashKey(`${r.seed}::governanceNarrative:${id}::${l.id}`); if (k > bk) { best = l; bk = k; } } return best; };
const G = [...GRAZING_POOL, ...GRAZING_NEW];
console.log(`reading of "Water source": ${mode === 'broad' ? 'broad (also "Multiple water sources")' : 'strict (the row "Water source")'}`);
for (const s of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
  const m = new Map(); const mil = new Map();
  for (const r of rows.filter((x) => x.size === s)) {
    const k = rungOf(r.rc); let key = r.masked;
    if (/GRAZING|FIELD/.test(k)) { const l = pick(r, G, 'GRAZING'); key = l.id === 'g1-grazing' ? r.masked : l.id; }
    else if (/LEVIES/.test(k)) { const l = pick(r, LEVIES_POOL, 'LEVIES'); key = l.id === 'l1-levies' ? r.masked : l.id; }
    else if (/militaryEffective/.test(k)) { const sub = /military commanders/.test(r.rc) ? ['MILITARY_A', MILITARY_A] : /militia captain|armed household is pushing/.test(r.rc) ? ['MILITARY_B', MILITARY_B] : ['MILITARY_C', MILITARY_C];
      const l = pick(r, sub[1], sub[0]); key = /0-today$/.test(l.id) ? r.masked : l.id; mil.set(l.id, (mil.get(l.id) || 0) + 1); }
    m.set(key, (m.get(key) || 0) + 1);
  }
  const top = [...m].sort((a, b) => b[1] - a[1]);
  console.log(`${s.padEnd(11)} top ${top[0][1]}/100 (${top[0][0].slice(0, 55)}) | next ${top[1][1]} (${top[1][0].slice(0, 30)}) | military rung picks ${JSON.stringify(Object.fromEntries(mil))}`);
}
