#!/usr/bin/env node
// C6 (A) P9 THE CHECK OVER EVERY BIRTH (BIRTH-2, RULING G22 (2)). Oracle independent of the leaf: the RAW threat tier of
// each birth (`config.monsterThreat`, from the probe's records: `probes/p9beasts.census.jsx` output) and the GRADE TEXT AS
// PRINTED in a rendered run of scripts/sameness-census.mjs (`<run>/rows/<seed>.json`, every web tab and the three PDF
// variants): the web Defense tab's "Beasts & Monsters" row, the web Overview's "Monster Defense" row, and the PDF's
// "Beasts & Monsters" row. Counts, per surface, births in heartland (settled) country whose printed grade is below
// ADEQUATE (Weak or Critical). Usage: node p9check.mjs <run dir> <probe.jsonl>
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
const [run, probe] = process.argv.slice(2);
const threat = Object.fromEntries(readFileSync(probe, 'utf8').trim().split('\n').map((l) => { const r = JSON.parse(l); return [r.seed, r.threat]; }));
const first = (x) => String(Array.isArray(x) ? x[0] : x ?? '');
const BELOW = /^(Weak|Critical)\b/i;
const out = { births: 0, heartland: 0, webDefense: 0, webOverview: 0, pdf: 0, anySurface: 0 };
const bySize = {}; const ex = [];
for (const f of readdirSync(join(run, 'rows')).filter((x) => x.endsWith('.json'))) {
  const r = JSON.parse(readFileSync(join(run, 'rows', f), 'utf8')); out.births++;
  if (threat[r.seed] !== 'heartland') continue; out.heartland++;
  const S = r.surfaces || {}; let any = false;
  const after = (k, label) => { const ls = S[k] || []; const i = ls.findIndex((l) => first(l) === label); return i >= 0 ? first(ls[i + 1]).replace(/[▲▼]/g, '').trim() : null; };
  const d = after('web:Systems/Defense', 'Beasts & Monsters'); if (d && BELOW.test(d)) { out.webDefense++; any = true; }
  const o = (S['web:Summary/Overview'] || []).map(first).find((l) => /^Monster Defense/.test(l)); if (o && BELOW.test(o.replace(/^Monster Defense/, ''))) { out.webOverview++; any = true; }
  for (const k of ['pdf:canon_dossier', 'pdf:draft_brief']) { const p = after(k, 'Beasts & Monsters'); if (p && BELOW.test(p)) { out.pdf++; any = true; break; } }
  if (any) { out.anySurface++; bySize[r.size] = (bySize[r.size] || 0) + 1; if (ex.length < 3) ex.push(r.seed); }
}
console.log(JSON.stringify({ ...out, bySize, ex }));
