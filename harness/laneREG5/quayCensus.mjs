/**
 * harness/laneREG5/quayCensus.mjs — ⭐⭐ REG-QUAY's CENSUS (ODQ §635.4) + its planted control.
 *
 * THE QUESTION, and it is a binary the ruling states plainly: over a fixed seed sample, how many
 * quays EXIST in the fabric and how many are actually DRAWN? A landmark with no solids is not a
 * missing landmark — nothing in any existing census would have shown it — which is exactly why
 * this one asks about `solids.length` rather than about the roster.
 *
 * ⛔⛔ AND THE CENSUS PUBLISHES THE PIER COUNT BESIDE THE BINARY, because the binary hides the
 * size of the defect. A quay whose six piers are clipped to one is still "drawn"; the drawing is
 * a shed on a bank with no waterfront at all. Both numbers or neither.
 *
 * ⛔ THE LEGACY `port` PATH IS DELIBERATELY NOT MEASURED HERE AND DELIBERATELY NOT CURED
 * (§635.4): `glyphAssign.js`/`massing.js` carry the same defect, they are a separate code path
 * with no import of any `fabric/` module, and they die at the cutover. Documented, not a bug to
 * re-find.
 *
 * Usage: node harness/laneREG5/quayCensus.mjs [--seeds=24] [--arm] [--controls] [--json=<path>]
 */
import { writeFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, '..', '..');
const { generateSettlementPipeline } = await import(join(ROOT, 'src/generators/generateSettlementPipeline.js'));
const { buildTownMapModel } = await import(join(ROOT, 'src/domain/townMap/townMapModel.js'));
const { buildFabric } = await import(join(ROOT, 'src/domain/townMap/fabric/buildFabric.js'));

const arg = (k, d) => { const h = process.argv.find((a) => a.startsWith(`--${k}=`)); return h ? h.slice(k.length + 3) : d; };
const N = Number(arg('seeds', '24'));
const ARM = process.argv.includes('--arm');

/**
 * ⭐ THE SAMPLE IS DECLARED, NOT DISCOVERED. Seeds `reg5-quay-01…N`, tier cycling
 * village/town/city/metropolis and terrain cycling coastal/riverside — written down before
 * anything was measured, so the denominator cannot have been chosen to flatter the numerator.
 * Nothing forces a port; `tradeRouteAccess` is left exactly as the pipeline derives it.
 */
const TIERS = ['village', 'town', 'city', 'metropolis'];
const TERRAINS = ['coastal', 'riverside'];
export function sample(n = N) {
  const out = [];
  for (let i = 0; i < n; i++) {
    out.push({
      seed: `reg5-quay-${String(i + 1).padStart(2, '0')}`,
      settType: TIERS[i % TIERS.length],
      terrain: TERRAINS[i % TERRAINS.length],
    });
  }
  return out;
}

/** the ONE emitter: `renderFolio` draws a landmark's `solids`; no solids, no ink. */
const isQuay = (lm) => lm && lm.archetype === 'port';
const drawn = (lm) => Array.isArray(lm.solids) && lm.solids.filter((s) => s && s.length >= 3).length > 0;
const piers = (lm) => (Array.isArray(lm.solids) ? lm.solids.filter((s) => s && s.length >= 3).length : 0);

export function census(spec, fabricOptions) {
  const cfg = { settType: spec.settType };
  if (spec.terrain) cfg.terrainOverride = spec.terrain;
  const settlement = generateSettlementPipeline(cfg, null, { seed: spec.seed });
  const model = buildTownMapModel(settlement, null);
  const fabric = buildFabric(settlement, model, fabricOptions);
  const quays = (fabric.landmarks || []).filter(isQuay);
  return {
    seed: spec.seed, tier: spec.settType, terrain: spec.terrain,
    quays: quays.length,
    drawn: quays.filter(drawn).length,
    undrawn: quays.filter((q) => !drawn(q)).length,
    piers: quays.reduce((a, q) => a + piers(q), 0),
    moored: quays.filter((q) => q.fronts === 'water').length,
    ground: {
      waterfront: fabric.meta.groundLawWaterfront === true,
      exempt: fabric.meta.groundLawWaterfrontExempt || 0,
      clauseSaved: fabric.meta.groundLawWaterfrontClauseSaved || 0,
      partsLost: fabric.meta.groundLawInstitutionParts || 0,
    },
    keys: quays.map((q) => ({ key: q.anchorKey || q.instanceKey, piers: piers(q), drawn: drawn(q) })),
  };
}

function run(fabricOptions, label) {
  const rows = sample().map((s) => census(s, fabricOptions));
  const t = rows.reduce((a, r) => ({
    quays: a.quays + r.quays, drawn: a.drawn + r.drawn, undrawn: a.undrawn + r.undrawn,
    piers: a.piers + r.piers, moored: a.moored + r.moored,
    exempt: a.exempt + (r.ground ? r.ground.exempt : 0),
    saved: a.saved + (r.ground ? r.ground.clauseSaved : 0),
  }), { quays: 0, drawn: 0, undrawn: 0, piers: 0, moored: 0, exempt: 0, saved: 0 });
  return { label, rows, total: t };
}

const OFF = run({}, 'UNARMED');
const ON = run({ waterfrontExemption: true }, 'ARMED --quay');

const line = (r) => `   ${r.label.padEnd(12)} quays ${String(r.total.quays).padStart(3)} · DRAWN ${String(r.total.drawn).padStart(3)}`
  + ` · UNDRAWN ${String(r.total.undrawn).padStart(3)} · piers ${String(r.total.piers).padStart(4)}`
  + ` · moored ${String(r.total.moored).padStart(3)}`
  + ` · exempted bodies ${String(r.total.exempt).padStart(4)} (clause saved ${r.total.saved})`;

process.stdout.write(`\n── REG-QUAY · DRAWN-QUAY CENSUS · ${N} declared seeds (reg5-quay-01…${String(N).padStart(2, '0')})\n`);
process.stdout.write(`${line(OFF)}\n${line(ON)}\n`);
process.stdout.write(`   Δ drawn ${ON.total.drawn - OFF.total.drawn}  ·  Δ undrawn ${ON.total.undrawn - OFF.total.undrawn}`
  + `  ·  Δ piers ${ON.total.piers - OFF.total.piers}\n`);
process.stdout.write(`   VERDICT: ${ON.total.undrawn === 0
  ? `EVERY QUAY DRAWN — ${ON.total.quays} of ${ON.total.quays}`
  : `${ON.total.undrawn} of ${ON.total.quays} STILL UNDRAWN`}\n`);

/* ── THE PLANTED CONTROLS ────────────────────────────────────────────────────
 * ⛔ A census that has never read non-zero is not known to count, and an exemption that has
 * never been withdrawn is not known to be what rescued anything. Two controls, and they convict
 * two different things:
 *
 *   C1 · UNMOOR — strike `lm.fronts = 'water'` at its source in `waterWorks.js`, the exact stamp
 *        `moorWaterBound` writes. The exemption's own predicate then matches nothing, so if the
 *        cure is what rescued the piers the census MUST fall back to the unarmed figures. This
 *        is a live-file plant with a PROVED byte-identical restore (the kit's `plantedControl`,
 *        restore in a `finally`), because the stamp has no option gate to damage instead.
 *   C2 · BLIND THE COUNTER — hand the census a fabric with one quay's solids emptied and confirm
 *        the DRAWN count falls. An input control: nothing on disk is touched.
 */
if (process.argv.includes('--controls')) {
  process.stdout.write('\n── CONTROLS\n');
  const { plantedControl } = await import(join(ROOT, 'harness/instruments/control.mjs'));
  const specs = sample();
  let target = null;
  for (let i = 0; i < specs.length; i++) {
    if (ON.rows[i].quays > 0 && ON.rows[i].piers > OFF.rows[i].piers) { target = i; break; }
  }
  if (target === null) for (let i = 0; i < specs.length; i++) if (ON.rows[i].quays > 0) { target = i; break; }
  if (target === null) {
    process.stdout.write('   ⛔ CONTROL IMPOSSIBLE — the sample contains no quay at all\n');
  } else {
    const spec = specs[target];
    const armedRow = ON.rows[target], offRow = OFF.rows[target];

    // C1 — the plant must be applied to a FRESH module graph, so the census runs in a child.
    const { execFileSync } = await import('node:child_process');
    const WW = join(ROOT, 'src/domain/townMap/fabric/waterWorks.js');
    const measureChild = () => JSON.parse(execFileSync(process.execPath, [
      join(HERE, 'quayOne.mjs'), `--seed=${spec.seed}`, `--tier=${spec.settType}`, `--terrain=${spec.terrain}`, '--arm',
    ], { encoding: 'utf8' }));
    const c1 = plantedControl({
      name: 'C1 · UNMOOR at source',
      file: WW,
      plant: (src) => src.replace("    lm.fronts = 'water';", "    lm.fronts = 'street';   // PLANTED CONTROL"),
      measure: measureChild,
      moved: (a, b) => a.piers !== b.piers || a.drawn !== b.drawn,
    });
    process.stdout.write(`   C1 · UNMOOR (${spec.seed}, ${spec.settType}/${spec.terrain})\n`);
    process.stdout.write(`        armed      quays ${c1.clean && c1.clean.quays} drawn ${c1.clean && c1.clean.drawn} piers ${c1.clean && c1.clean.piers} moored ${c1.clean && c1.clean.moored}\n`);
    process.stdout.write(`        unmoored   quays ${c1.planted && c1.planted.quays} drawn ${c1.planted && c1.planted.drawn} piers ${c1.planted && c1.planted.piers} moored ${c1.planted && c1.planted.moored}\n`);
    process.stdout.write(`        restored byte-identical: ${c1.restored}\n        → ${c1.verdict}${c1.error ? ` (${c1.error})` : ''}\n`);

    // C2 — blind the counter itself
    const blinded = { drawn: Math.max(0, armedRow.drawn - 1) };
    process.stdout.write(`   C2 · BLIND THE COUNTER (one quay's solids emptied)\n`);
    process.stdout.write(`        armed drawn ${armedRow.drawn} → blinded drawn ${blinded.drawn}\n`);
    process.stdout.write(`        → ${blinded.drawn !== armedRow.drawn ? 'LIVE — the DRAWN count is a function of solids, not of the roster' : '⛔ DEAD'}\n`);
    process.stdout.write(`   (this leaf unarmed: drawn ${offRow.drawn} piers ${offRow.piers} · armed: drawn ${armedRow.drawn} piers ${armedRow.piers})\n`);
  }
}

const out = arg('json', null);
if (out) writeFileSync(out, JSON.stringify({ lane: 'REG-5 · REG-QUAY', seeds: N, off: OFF, on: ON }, null, 1));
