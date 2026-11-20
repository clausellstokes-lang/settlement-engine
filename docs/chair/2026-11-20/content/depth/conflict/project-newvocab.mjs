// project-newvocab.mjs <tree> <rows.jsonl> — HYPOTHETICAL: the grazing pool plus two lines on facts the roster's NAMES hold but the
// vocabulary has no atom for ("Water source" / "Multiple water sources"; "Access to external mill"), read here by name.
import { readFileSync } from 'node:fs';
import { rungOf } from './rungs.mjs';
import { GRAZING_POOL } from './drafts.mjs';
const [, , L, F] = process.argv;
const { hashKey } = await import(`${L}/src/domain/display/stateProse/stateProseKernel.js`);
const rows = readFileSync(F, 'utf8').split('\n').filter(Boolean).map((l) => JSON.parse(l));
const POOL = [...GRAZING_POOL, { id: 'n1-well', needs: ['name:well/water'] }, { id: 'n2-mill-access', needs: ['name:access-mill'] }];
const holds = (r, a) => a === 'tier: village' ? r.size === 'village' : a === 'name:access-mill' ? r.names.some((n) => /access to external mill/i.test(n)) : a.startsWith('name:') ? r.nameRx[a] : r.siteCfg[a] === true;
for (const s of ['thorp', 'hamlet', 'village']) {
  const m = new Map();
  for (const r of rows.filter((x) => x.size === s)) { let key = r.masked; if (/GRAZING|FIELD/.test(rungOf(r.rc))) { let best = null, bk = -1; for (const l of POOL) if (l.needs.every((a) => holds(r, a))) { const k = hashKey(`${r.seed}::governanceNarrative:GRAZING::${l.id}`); if (k > bk) { best = l; bk = k; } } key = best.id === 'g1-grazing' ? r.masked : best.id; } m.set(key, (m.get(key) || 0) + 1); }
  const top = [...m].sort((a, b) => b[1] - a[1]); console.log(`${s.padEnd(8)} top ${top[0][1]}/100 (${top[0][0].slice(0, 50)}) | next ${top[1][1]} (${top[1][0].slice(0, 30)})`);
}
