/**
 * P3 — CRITERION 1: NO EDIT. Over the 63-row sample, held bag = the record's own held facts.
 * Which record keys reproduce, which do not, by tier — and how large is the SETTLING SHIFT
 * (the readings that move because a held key's FINAL value now reaches an INTERMEDIATE
 * consumer that originally read an intermediate value).
 *
 * Four variants, so the ruling's own choices are separable:
 *   V1  ruling 1 literal: name SKIPPED, factions final (no relink), power replay skipped,
 *       asserts pin-aware.
 *   V2  V1 but the name mint CONSUMES its draws and discards the result.
 *   V3  V2 but `relinkFactionMembers` runs (the member mirror follows the held roster).
 *   V4  V2 with `institutions` NOT held (the roster free) — isolates the settling shift to
 *       the institution pin.
 *
 * usage: node --import ./hook3.mjs p3-noedit.mjs [rows]
 */
import { h, clone, pathDiff, fmtTally, keyOf, sample63 } from './lib.mjs';
import { rederive, tryRederive, generate, heldOf, HELD_KEYS } from './seam.mjs';

const ROWS = sample63().slice(0, Number(process.argv[2] || 63));
const VARIANTS = [
  ['V1 ruling-1 literal (name SKIP, factions final, replay skipped, asserts pin-aware)', { nameMode: 'skip', relink: false }],
  ['V2 V1 + the name mint CONSUMES its draws', { nameMode: 'consume', relink: false }],
  ['V3 V2 + relinkFactionMembers runs', { nameMode: 'consume', relink: true }],
  ['V4 V2 with institutions NOT held', { nameMode: 'consume', relink: false, dropInstitutions: true }],
];

const results = VARIANTS.map(([name]) => ({
  name, ok: 0, n: 0, threw: 0, mutated: 0, ms: 0,
  keys: new Map(), byTier: new Map(), paths: new Map(), okByTier: new Map(),
}));

for (const row of ROWS) {
  const rec = generate(row);
  const target = h(rec);
  const tier = row.settType;
  for (let i = 0; i < VARIANTS.length; i += 1) {
    const [, opts] = VARIANTS[i];
    const r = results[i];
    const held = heldOf(rec);
    if (opts.dropInstitutions) delete held.institutions;
    const before = h(rec);
    const t0 = process.hrtime.bigint();
    const rr = tryRederive(row, held, opts);
    r.ms += Number(process.hrtime.bigint() - t0) / 1e6;
    r.n += 1;
    r.byTier.set(tier, (r.byTier.get(tier) || 0) + 1);
    if (rr.err) { r.threw += 1; r.keys.set(`THREW:${rr.err.slice(0, 40)}`, (r.keys.get(`THREW:${rr.err.slice(0, 40)}`) || 0) + 1); continue; }
    if (h(rec) !== before) r.mutated += 1;
    const out = rr.out;
    if (h(out) === target) { r.ok += 1; r.okByTier.set(tier, (r.okByTier.get(tier) || 0) + 1); continue; }
    for (const k of new Set([...Object.keys(rec), ...Object.keys(out)])) {
      if (h(rec[k]) === h(out[k])) continue;
      r.keys.set(k, (r.keys.get(k) || 0) + 1);
      const d = pathDiff(rec[k], out[k]);
      const cur = r.paths.get(k) || { n: 0, shapes: [] };
      cur.n += d.added.length + d.changed.length + d.removed.length;
      cur.shapes.push(...d.added, ...d.changed, ...d.removed);
      r.paths.set(k, cur);
    }
  }
}

console.log(`=== P3 — NO EDIT, held bag = the record's own held facts, ${ROWS.length} rows ===\n`);
for (const r of results) {
  const keys = [...r.keys.entries()].sort((a, b) => b[1] - a[1]).map(([k, n]) => `${k}×${n}`).join(' ');
  console.log(`${r.name}`);
  console.log(`    reproduces=${r.ok}/${r.n}  threw=${r.threw}  caller record mutated=${r.mutated}/${r.n}  ${(r.ms / r.n).toFixed(1)} ms/re-derivation`);
  console.log(`    keys that diverge: ${keys || '—'}`);
  console.log(`    by tier (reproduced/rows): ${[...r.byTier.entries()].map(([t, n]) => `${t} ${r.okByTier.get(t) || 0}/${n}`).join('  ')}`);
}

console.log('\n=== P3.b — THE SETTLING SHIFT, per diverging key (V2), leaf paths summed over the sample ===');
{
  const r = results[1];
  const rows = [...r.paths.entries()].sort((a, b) => b[1].n - a[1].n);
  console.log('key                           rows  leaf paths  shapes');
  for (const [k, v] of rows) {
    console.log(`${k.padEnd(28)} ${String(r.keys.get(k)).padStart(5)} ${String(v.n).padStart(11)}  ${fmtTally(v.shapes, 6)}`);
  }
}

// ── P3.c: the settling shift by TIER, and whether it is VISIBLE (a reading a DM reads) ──
console.log('\n=== P3.c — per-row settling, V2, one row per tier ===');
const DROWS = ['thorp', 'hamlet', 'village', 'town', 'city', 'metropolis'].map(t => sample63().find(r => r.settType === t));
for (const row of DROWS) {
  const rec = generate(row);
  const rr = tryRederive(row, heldOf(rec), { nameMode: 'consume', relink: false });
  if (rr.err) { console.log(`${keyOf(row)}\n    THREW ${rr.err}`); continue; }
  const out = rr.out;
  const parts = [];
  for (const k of new Set([...Object.keys(rec), ...Object.keys(out)])) {
    if (h(rec[k]) === h(out[k])) continue;
    const d = pathDiff(rec[k], out[k]);
    parts.push(`${k} ${d.added.length}+/${d.changed.length}~/${d.removed.length}- [${fmtTally([...d.added, ...d.changed, ...d.removed], 4)}]`);
  }
  console.log(`${keyOf(row)}  → ${parts.length ? '' : 'IDENTICAL'}`);
  for (const p of parts) console.log(`    ${p}`);
  // the two DM-visible headline readings
  console.log(`    prosperity ${rec.economicState?.prosperity} → ${out.economicState?.prosperity}`
    + ` | safety ${rec.economicState?.safetyProfile?.safetyLabel} → ${out.economicState?.safetyProfile?.safetyLabel}`
    + ` | food ${rec.economicState?.foodSecurity?.label} → ${out.economicState?.foodSecurity?.label}`
    + ` | defense ${rec.defenseProfile?.readiness?.label} → ${out.defenseProfile?.readiness?.label}`
    + ` | fingerprint ${rec.powerStructure?.economyInputFingerprint === out.powerStructure?.economyInputFingerprint ? 'same' : `MOVED ${rec.powerStructure?.economyInputFingerprint} → ${out.powerStructure?.economyInputFingerprint}`}`);
}

// ── P3.d: does the freshness invariant throw WITHOUT ruling 4? ──
console.log('\n=== P3.d — the same runs with the invariants NOT pin-aware (ruling 4 withdrawn) ===');
{
  let threw = 0; let ok = 0; const msgs = new Map();
  for (const row of ROWS) {
    const rec = generate(row);
    const rr = tryRederive(row, heldOf(rec), { nameMode: 'consume', relink: false, pinAwareAsserts: false });
    if (rr.err) { threw += 1; msgs.set(rr.err.slice(0, 60), (msgs.get(rr.err.slice(0, 60)) || 0) + 1); } else ok += 1;
  }
  console.log(`rows=${ROWS.length}  threw=${threw}  ran=${ok}`);
  for (const [m, n] of msgs) console.log(`    ×${n}  ${m}`);
}
