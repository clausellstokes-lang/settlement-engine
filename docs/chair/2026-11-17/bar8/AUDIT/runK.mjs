// BAR8-AUDIT-K runner · LAWS 12 TO 15 (`tests/helpers/pageLaws/law12K.mjs` .. `law15K.mjs`, read by `pageK.mjs`) over ANY
// PAGE-COPY render.
//   node docs/chair/2026-11-17/bar8/AUDIT/runK.mjs <render-dir> <out.json>
// <render-dir> holds dumps/<seed>.txt (or .txt.gz) and corpus.ndjson.gz (PAGE-COPY's census3.sh --count-only). Writes every
// instance to <out.json>; prints counts by rule (towns, instances, distinct lines with the town's name struck), by crisis,
// and by writer; the static census of the secret pools (every row whose words presume a command, and the holder test it
// carries); and, where the render holds the seventh read's towns, the controls table of controlsK.json (positive: STANDS,
// must be FOUND; negative: EXPLAINED, must be clear of every rule of the seat; WEAK: reported apart).
// Exit 1 when no dump is read; exit 3 when a STANDS control of a town in the render is missed or an EXPLAINED one is found.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../../../../..');
const L = (f) => import(path.join(root, 'tests/helpers/pageLaws', f));
const { readTownK } = await L('pageK.mjs');
const laws = [(await L('law12K.mjs')).law12K, (await L('law13K.mjs')).law13K, (await L('law14K.mjs')).law14K, (await L('law15K.mjs')).law15K];

const [dir, outPath] = process.argv.slice(2);
if (!dir || !outPath) { console.error('usage: runK.mjs <render-dir> <out.json>'); process.exit(2); }
const records = new Map();
for (const l of zlib.gunzipSync(fs.readFileSync(path.join(dir, 'corpus.ndjson.gz'))).toString().split('\n')) {
  if (!l.trim()) continue; const o = JSON.parse(l); records.set(o.seed, o.s);
}
const dumps = fs.readdirSync(path.join(dir, 'dumps')).filter((f) => /\.txt(\.gz)?$/.test(f)).sort();
if (!dumps.length) { console.error('no dumps'); process.exit(1); }
const readDump = (f) => { const b = fs.readFileSync(path.join(dir, 'dumps', f)); return (f.endsWith('.gz') ? zlib.gunzipSync(b) : b).toString('utf8'); };

const all = [];
const towns = new Map();
// THE STOCK RECENT-CONFLICT LINE'S SHARE (rule 15b's census): `governanceNarrative.js`'s cascade ends on the grazing line;
// for every town: its tier, crisis, whether its recent conflict is that line, and whether it holds a grazing house or a
// pastoral chain (what the second check's negatives read)
const graze = [];
for (const f of dumps) {
  const seed = f.replace(/\.txt(\.gz)?$/, '');
  const rec = records.get(seed);
  if (!rec) { console.error(`no record for ${seed}`); process.exit(1); }
  const T = readTownK(readDump(f), rec);
  towns.set(seed, { crises: [...T.crises], tier: T.tier });
  const rc = String(rec?.powerStructure?.recentConflict || '');
  const houses = (rec?.institutions || []).map((x) => String(x?.name || ''));
  graze.push({ seed, tier: T.tier, calm: T.crises.size === 0, line: /grazing rights and water access/.test(rc) ? 'grazing+water' : /field rotation and grazing/.test(rc) ? 'rotation+grazing' : 'other',
    grazing: houses.some((n) => /grazing|pasture|herd|shepherd|livestock|cattle|sheep|goat|ranch|dairy|stable|drover/i.test(n)) || rec?.economicState?.foodSecurity?.chains?.['Pastoral & livestock'] === true });
  for (const law of laws) for (const x of law(T, seed)) all.push({ ...x, form: T.stripName(x.s || x.line), crises: [...T.crises], tier: T.tier });
}
fs.writeFileSync(outPath, JSON.stringify(all, null, 1));

const tally = (xs) => ({ towns: new Set(xs.map((x) => x.town)).size, n: xs.length, lines: new Set(xs.map((x) => x.form)).size });
const fmt = (t) => `towns ${String(t.towns).padStart(4)} · instances ${String(t.n).padStart(5)} · distinct lines ${String(t.lines).padStart(4)}`;
console.log(`LAWS 12 TO 15 (seat K) over ${dumps.length} towns: ${fmt(tally(all))}`);
const rules = [...new Set(all.map((x) => x.rule))].sort((a, b) => a.localeCompare(b, 'en', { numeric: true }));
for (const r of rules) {
  const xs = all.filter((x) => x.rule === r);
  const by = {}; for (const x of xs) { const k = x.crises.length ? x.crises.join('+') : 'calm'; by[k] = (by[k] || 0) + 1; }
  console.log(`  ${r.padEnd(20)} ${fmt(tally(xs))} · by crisis ${Object.entries(by).map(([k, v]) => `${k} ${v}`).join(', ')}`);
}
console.log('BY WRITER (rule · instances · writer)');
const wk = {}; for (const x of all) { const k = `${x.rule} · ${x.writer}`; wk[k] = (wk[k] || 0) + 1; }
for (const [k, v] of Object.entries(wk).sort()) console.log(`  ${String(v).padStart(5)} · ${k}`);

// ---- 15b's census: the stock line's share of the population, by tier
console.log('THE STOCK RECENT-CONFLICT LINE (15b census): tier · towns · grazing+water line (with a grazing house or chain / without) · rotation+grazing line');
for (const t of ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis']) {
  const xs = graze.filter((g) => g.tier === t); if (!xs.length) continue;
  const gw = xs.filter((g) => g.line === 'grazing+water');
  console.log(`  ${t.padEnd(10)} ${String(xs.length).padStart(4)} · ${String(gw.length).padStart(4)} (${gw.filter((g) => g.grazing).length} / ${gw.filter((g) => !g.grazing).length}) · calm ${xs.filter((g) => g.calm).length}, of them the line ${gw.filter((g) => g.calm).length} · ${xs.filter((g) => g.line === 'rotation+grazing').length}`);
}

// ---- THE STATIC CENSUS OF THE SECRET POOLS (rule 14f): every row whose words presume a command or an office
try {
  const { STRESS_INSTITUTION_EFFECTS } = await import(path.join(root, 'src/data/stressInstitutionEffects.js'));
  const { RARE_SECRET_ROWS } = await import(path.join(root, 'src/data/rareSecrets.js'));
  const PRESUME = /\b(authori[sz]ed|ordered|commanded|sortie|surrender terms|council's knowledge|declared destroyed|emergency stores|signed|their office|in office|as (?:magistrate|commander|captain|steward)|reports? (?:false|falsified)|the accounts they keep|the books they keep)\b/i;
  let crisisRows = 0, crisisPresume = [];
  for (const [kind, rows] of Object.entries(STRESS_INSTITUTION_EFFECTS)) for (const r of rows || []) {
    if (!r?.secret) continue; crisisRows++;
    if (PRESUME.test(`${r.secret} ${r.stakes || ''}`)) crisisPresume.push(`${kind}: ${r.secret.slice(0, 80)} [needs ${JSON.stringify(r.needs || [])}; excludes ${JSON.stringify(r.excludes || [])}; holder test: none]`);
  }
  const rare = Array.isArray(RARE_SECRET_ROWS) ? RARE_SECRET_ROWS : Object.values(RARE_SECRET_ROWS || {}).flat();
  const rarePresume = rare.filter((r) => PRESUME.test(`${r?.what || ''} ${r?.stakes || ''}`));
  console.log(`SECRET POOLS (static): the crisis pools ${crisisRows} rows, ${crisisPresume.length} presume a command or an office, none with a holder test; the rare rows ${rare.length}, ${rarePresume.length} presume one, ${rarePresume.filter((r) => r?.holder && (r.holder.office || r.holder.roles || r.holder.category || r.holder.keepsHouse)).length} of them with a holder test`);
  for (const l of crisisPresume) console.log(`  crisis · ${l}`);
  // THE DEALT RARE ROWS OVER THIS RENDER, against their holders: a row known by its words (up to its first slot); a row
  // with a holder test of role or office is checked against the card's own role and rank
  const stem = (t) => String(t || '').split('{')[0].trim();
  const roleOf = (n) => String(n?.role || '').replace(/^the /i, '').trim().toLowerCase();
  let dealt = 0, tested = 0, miss = [];
  const byFam = {};
  for (const [seed, s] of records) for (const n of s?.npcs || []) {
    const what = String(n?.secret?.what || '');
    const r = rare.find((x) => stem(x.what).length > 12 && what.startsWith(stem(x.what)));
    if (!r) continue;
    dealt++; const fam = Object.entries({ deeds: 'RARE_DEEDS', natures: 'RARE_NATURES', ties: 'RARE_TIES', masters: 'RARE_MASTERS', outsiders: 'RARE_OUTSIDERS' }).find(([k]) => (RARE_SECRET_ROWS[k] || []).includes(r))?.[0] || '?';
    byFam[fam] = (byFam[fam] || 0) + 1;
    const h = r.holder || {};
    if (!h.roles && !h.office) continue;
    tested++;
    const okRole = !h.roles || h.roles.includes(roleOf(n));
    const okOffice = !h.office || h.office.includes(String(n?.structuralRank || ''));
    if (!okRole || !okOffice) miss.push(`${seed} · ${n.name} (${roleOf(n)}, ${n.structuralRank}) · ${r.key}`);
  }
  console.log(`RARE ROWS DEALT over this render: ${dealt} (${Object.entries(byFam).map(([k, v]) => `${k} ${v}`).join(', ')}); ${tested} with a holder test of role or office; ${miss.length} against their holder`);
  for (const m of miss.slice(0, 20)) console.log(`  rare against its holder · ${m}`);
  for (const r of rarePresume) console.log(`  rare   · ${r.key}: ${String(r.what).slice(0, 80)} [holder ${JSON.stringify(r.holder || {})}]`);
} catch (e) { console.log(`SECRET POOLS (static): not read (${e.message})`); }

// ---- THE CONTROLS
const controls = JSON.parse(fs.readFileSync(path.join(here, 'controlsK.json'), 'utf8'));
const norm = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
let bad = 0; const rows = [];
const inRender = controls.filter((c) => towns.has(c.town));
if (inRender.length) {
  console.log('CONTROLS (stands must be FOUND; explained must be clear of every rule of the seat; weak apart)');
  for (const c of inRender) {
    const t = norm(c.text);
    const hit = all.filter((x) => x.town === c.town && (t.length <= 12 ? norm(x.line) === t || norm(x.s) === t : norm(x.line).includes(t.slice(0, 80)) || norm(x.s).includes(t.slice(0, 80)) || t.includes(norm(x.s || x.line).slice(0, 80))));
    const got = hit.length ? `FOUND ${[...new Set(hit.map((x) => x.rule))].join(',')}` : 'clear';
    const ok = c.expect === 'found' ? hit.length > 0 : c.expect === 'clear' ? hit.length === 0 : true;
    if (!ok) bad++;
    rows.push({ ...c, got, ok });
    console.log(`  ${String(c.law).padEnd(3)} ${c.verdict.padEnd(9)} ${c.id.padEnd(7)} ${ok ? '  ' : '✗ '}${got.padEnd(24)} ${String(c.text).slice(0, 90)}`);
  }
  fs.writeFileSync(outPath.replace(/\.json$/, '') + '.controls.json', JSON.stringify(rows, null, 1));
  console.log(`controls: ${rows.filter((r) => r.ok).length} of ${rows.length} as expected`);
}
process.exit(bad ? 3 : 0);
