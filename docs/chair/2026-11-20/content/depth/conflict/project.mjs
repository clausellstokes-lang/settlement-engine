// project.mjs <tree> <rows.jsonl> — the PROJECTED top share by size under a keyed hash (drawDeclared's argmax:
// hashKey(`${seed}::governanceNarrative:<POOL>::${id}`)) among the lines of the branch's pool whose needs hold at the site.
import { readFileSync } from 'node:fs';
import { rungOf } from './rungs.mjs';
import { GRAZING_POOL, LEVIES_POOL } from './drafts.mjs';
const [, , L, F] = process.argv;
const { hashKey } = await import(`${L}/src/domain/display/stateProse/stateProseKernel.js`);
const rows = readFileSync(F, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const SIZES = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'];
const holds = (r, a) => (a === 'tier: village' ? r.size === 'village' : r.siteCfg[a] === true);
const pick = (r, pool, id) => { const E = pool.filter((l) => l.needs.every((a) => holds(r, a))); let best = null, bk = -1; for (const l of E) { const k = hashKey(`${r.seed}::governanceNarrative:${id}::${l.id}`); if (k > bk) { best = l; bk = k; } } return best; };
const elig = {};
for (const s of SIZES) {
  const g = rows.filter((r) => r.size === s); const m = new Map(); const before = new Map();
  for (const r of g) {
    before.set(r.masked, (before.get(r.masked) || 0) + 1);
    const k = rungOf(r.rc); let key = r.masked;
    if (/GRAZING|FIELD/.test(k)) { const l = pick(r, GRAZING_POOL, 'GRAZING'); key = l.id === 'g1-grazing' ? r.masked : l.id; for (const x of GRAZING_POOL) if (x.needs.every((a) => holds(r, a))) elig[s + x.id] = (elig[s + x.id] || 0) + 1; }
    if (/LEVIES/.test(k)) { const l = pick(r, LEVIES_POOL, 'LEVIES'); key = l.id === 'l1-levies' ? r.masked : l.id; for (const x of LEVIES_POOL) if (x.needs.every((a) => holds(r, a))) elig[s + x.id] = (elig[s + x.id] || 0) + 1; }
    m.set(key, (m.get(key) || 0) + 1);
  }
  const tb = [...before].sort((a, b) => b[1] - a[1])[0]; const top = [...m].sort((a, b) => b[1] - a[1]);
  console.log(`${s.padEnd(11)} before ${tb[1]}/100  after ${top[0][1]}/100 (${top[0][0].slice(0, 60)}) | next ${top[1][1]} (${top[1][0].slice(0, 40)}), ${top[2][1]} (${top[2][0].slice(0, 40)})`);
}
console.log('\neligibility within the branch (places where the line\'s needs hold at the site), by size:');
for (const pool of [GRAZING_POOL, LEVIES_POOL]) for (const x of pool) console.log(`  ${x.id.padEnd(14)} ${SIZES.map((s) => `${s.slice(0, 5)} ${elig[s + x.id] || 0}`).join('  ')}`);
