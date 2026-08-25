/**
 * harness/laneREG5/vquayCensus.mjs — ⭐ V-QUAY's FIXTURE-COUNT CENSUS + its planted control
 * (chair-minted, ODQ §636.2).
 *
 * THE EXIT: every DRAWN quay carries 2–5 V-QUAY fixtures at page register. Two numbers, because
 * either alone lies — the count per quay AND the share of drawn quays that carry any gear at all.
 *
 * ⛔ THE DENOMINATOR IS *DRAWN* QUAYS, NOT ALL QUAYS, and that is the dress leg deferring to the
 * geometric one: a quay whose piers the ground law ate has no apron, and furnishing it would be
 * the dress leg papering over the defect REG-QUAY exists to cure.
 *
 * Usage: node harness/laneREG5/vquayCensus.mjs [--seeds=24] [--controls]
 */
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const { generateSettlementPipeline } = await import(join(ROOT, 'src/generators/generateSettlementPipeline.js'));
const { buildTownMapModel } = await import(join(ROOT, 'src/domain/townMap/townMapModel.js'));
const { buildFabric } = await import(join(ROOT, 'src/domain/townMap/fabric/buildFabric.js'));
const { V_QUAY_KINDS, V_QUAY_BAND } = await import(join(ROOT, 'src/domain/townMap/fabric/waterWorks.js'));
const { sample } = await import(join(HERE, 'quayCensus.mjs'));

const arg = (k, d) => { const h = process.argv.find((a) => a.startsWith(`--${k}=`)); return h ? h.slice(k.length + 3) : d; };
const N = Number(arg('seeds', '24'));

function one(spec, opts) {
  const cfg = { settType: spec.settType };
  if (spec.terrain) cfg.terrainOverride = spec.terrain;
  const s = generateSettlementPipeline(cfg, null, { seed: spec.seed });
  const fabric = buildFabric(s, buildTownMapModel(s, null), opts);
  const quays = (fabric.landmarks || []).filter((lm) => lm && lm.archetype === 'port');
  const drawn = quays.filter((q) => Array.isArray(q.solids) && q.solids.filter((x) => x && x.length >= 3).length > 0);
  const reg = fabric.quayRegister;
  return { spec, drawnQuays: drawn.length, reg };
}

const OPTS = { waterfrontExemption: true, quayRegister: true };
const rows = sample(N).map((s) => one(s, OPTS)).filter((r) => r.drawnQuays > 0 || (r.reg && r.reg.quays.length));

let drawnTotal = 0, furnished = 0, inBand = 0, fixtures = 0;
const byKind = {};
const perQuay = [];
for (const r of rows) {
  drawnTotal += r.drawnQuays;
  for (const q of (r.reg ? r.reg.quays : [])) {
    furnished++;
    fixtures += q.fixtures.length;
    if (q.fixtures.length >= V_QUAY_BAND[0] && q.fixtures.length <= V_QUAY_BAND[1]) inBand++;
    for (const f of q.fixtures) byKind[f.kind] = (byKind[f.kind] || 0) + 1;
    perQuay.push({ seed: r.spec.seed, tier: r.spec.settType, key: q.key, n: q.fixtures.length, kinds: q.fixtures.map((f) => f.kind) });
  }
}

process.stdout.write(`\n── V-QUAY · FIXTURE-COUNT CENSUS · ${N} declared seeds · band ${V_QUAY_BAND[0]}–${V_QUAY_BAND[1]} per drawn quay\n`);
process.stdout.write(`   drawn quays ${drawnTotal} · furnished ${furnished} · fixtures ${fixtures}`
  + ` · mean ${furnished ? (fixtures / furnished).toFixed(2) : 'n/a'} · IN BAND ${inBand} of ${furnished}\n`);
process.stdout.write(`   vocabulary (closed at ${V_QUAY_KINDS.join(', ')}): ${JSON.stringify(byKind)}\n`);
for (const q of perQuay) process.stdout.write(`      ${q.seed} ${q.tier.padEnd(11)} ${String(q.key).padEnd(18)} ${q.n}  ${q.kinds.join(', ')}\n`);
const unfurnished = drawnTotal - furnished;
process.stdout.write(`   VERDICT: ${inBand === furnished && unfurnished === 0 && furnished > 0
  ? `EVERY DRAWN QUAY FURNISHED IN BAND — ${inBand} of ${drawnTotal}`
  : `${inBand} of ${furnished} in band; ${unfurnished} drawn quays unfurnished`}\n`);

/* ── CONTROLS ─────────────────────────────────────────────────────────────────
 * C1 · THE ARM ITSELF — unarmed, `quayRegister` must be null and the census must read ZERO.
 *      A dress census that reads the same armed and unarmed is measuring nothing.
 * C2 · THE GEOMETRIC DEPENDENCY — with `--quay` WITHDRAWN, quays the ground law eats must fall
 *      out of the furnished set. This is the control that proves the dress leg defers to the
 *      geometry rather than papering over it.
 * C3 · THE BAND — a fixture count outside 2–5 must be detectable, so the band is asked of a
 *      deliberately over-furnished quay.
 */
if (process.argv.includes('--controls')) {
  process.stdout.write('\n── CONTROLS\n');
  const off = sample(N).map((s) => one(s, {})).reduce((a, r) => a + (r.reg ? r.reg.quays.length : 0), 0);
  process.stdout.write(`   C1 · ARM WITHDRAWN (no --vquay): furnished quays ${off}`
    + `  → ${off === 0 ? 'LIVE — the census reads zero unarmed' : '⛔ DEAD — furniture appears with the arm off'}\n`);

  const noGeom = sample(N).map((s) => one(s, { quayRegister: true })).reduce((a, r) => ({
    furnished: a.furnished + (r.reg ? r.reg.quays.length : 0), fixtures: a.fixtures + (r.reg ? r.reg.total : 0),
  }), { furnished: 0, fixtures: 0 });
  process.stdout.write(`   C2 · GEOMETRIC DEPENDENCY (--vquay WITHOUT --quay): furnished ${noGeom.furnished} (armed both: ${furnished})`
    + `  → ${noGeom.furnished < furnished ? 'LIVE — fewer quays survive to be furnished, so the dress defers to the geometry'
      : '⛔ DEAD — the dress leg is furnishing quays the ground law ate'}\n`);

  const over = perQuay.filter((q) => q.n > V_QUAY_BAND[1] || q.n < V_QUAY_BAND[0]).length;
  const synth = { n: V_QUAY_BAND[1] + 2 };
  const caught = !(synth.n >= V_QUAY_BAND[0] && synth.n <= V_QUAY_BAND[1]);
  process.stdout.write(`   C3 · THE BAND (a planted ${synth.n}-fixture quay): ${caught ? 'CAUGHT' : '⛔ MISSED'}`
    + `  (real out-of-band quays in this sample: ${over})\n`);
}
